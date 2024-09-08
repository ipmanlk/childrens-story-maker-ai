import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { openai } from "@/server/lib/openai";
import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { promisify } from "util";
import { createCanvas, loadImage, registerFont } from "canvas";
import { exec } from "child_process";

registerFont(path.join(process.cwd(), "selawkb.ttf"), {
  family: "Selawik",
});

const execAsync = promisify(exec);

const dummySgements = [
  {
    visual: "A vast night sky filled with twinkling stars.",
    narration:
      "Once upon a time, in a sky full of twinkling stars, there was a little star who dreamed of shining the brightest.",
  },
  {
    visual:
      "The little star trying to shine brighter but looking a bit dimmer compared to the other stars.",
    narration:
      "Every night, the little star tried its best, but it was always a little dimmer than the others.",
  },
  {
    visual: "The little star meeting a wise old moon.",
    narration:
      "One night, the little star met a wise old moon who shared a secret.",
  },
];

export const generateRouter = createTRPCRouter({
  createStory: publicProcedure
    .input(z.object({ idea: z.string().min(10).max(200) }))
    .mutation(async ({ input }) => {
      const scriptText = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that writes children's stories as paragraphs.",
          },
          {
            role: "user",
            content: `Write a children's story for a 30 seconds video based on the following idea: ${input.idea}`,
          },
        ],
        max_tokens: 200,
      });

      return scriptText.choices[0]?.message.content ?? "Something went wrong";
    }),

  createSegments: publicProcedure
    .input(z.object({ story: z.string().min(10).max(1000) }))
    .mutation(async ({ input }) => {
      const segments = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that breaks down a story into segments for a video. Each segment is a JSON object with a visual and a narration property. The visual is used to generate an image for the schene and the narration is used to generate a voiceover for the video. Output the segments as a JSON array.",
          },
          {
            role: "user",
            content: `Break down the following story into segments: ${input.story}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const jsonStr = segments.choices[0]?.message.content ?? "{}";
      let jsonObj;
      try {
        jsonObj = JSON.parse(jsonStr);
      } catch {
        throw new Error("Invalid response");
      }

      if (!jsonObj.segments) {
        throw new Error("Segments not found in the response");
      }

      return jsonObj.segments as { visual: string; narration: string }[];
    }),

  createVideo: publicProcedure
    .input(
      z.object({
        segments: z.array(
          z.object({
            visual: z.string().min(10).max(120),
            narration: z.string().min(10).max(200),
          }),
        ),
      }),
    )
    .mutation(async ({ input: { segments } }) => {
      const jobId = randomUUID();
      try {
        await mkdir(path.join(process.cwd(), "gen", jobId));
      } catch {}

      await generateSegmentClips(segments, jobId);
    }),
});

const generateSegmentClips = async (
  segments: { visual: string; narration: string }[],
  jobId: string,
) => {
  const canvasDir = path.join(process.cwd(), "gen", jobId, "canvas");
  const audioDir = path.join(process.cwd(), "gen", jobId, "audio");

  try {
    await mkdir(canvasDir);
    await mkdir(audioDir);
  } catch {}

  let i = 1;
  for (const segment of segments) {
    const imageRes = await openai.images.generate({
      prompt: `Context: ${segment.visual} | Instructions: for a kids story. DO NOT INCLUDE TEXT IN THE IMAGE`,
      model: "dall-e-3",
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = imageRes.data[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL");
    }

    // Generate a frame with caption
    const inputImage = await fetch(imageUrl).then((res) => res.arrayBuffer());
    const frameBuffer = await generateFrameWithCaption(
      Buffer.from(inputImage),
      segment.narration,
    );

    // Save frame
    await writeFile(path.join(canvasDir, `${i}.png`), frameBuffer);

    // generate and save audio
    const audioRes = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: segment.narration,
    });

    const audioBuffer = Buffer.from(await audioRes.arrayBuffer());
    await writeFile(path.join(audioDir, `${i}.mp3`), audioBuffer);

    i++;
  }

  await createOutputVideo(jobId, segments.length);

  return { status: true };
};

const generateFrameWithCaption = async (
  inputImage: Buffer,
  caption: string,
) => {
  const canvasWidth = 1280;
  const canvasHeight = 720;
  const fontSize = 45;
  const lineHeight = fontSize * 1.2;

  const image = await loadImage(inputImage);

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // Calculate the scaling factor to zoom and crop the image
  const scale = Math.max(
    canvasWidth / image.width,
    canvasHeight / image.height,
  );
  const scaledWidth = image.width * scale;
  const scaledHeight = image.height * scale;

  const xOffset = (canvasWidth - scaledWidth) / 2;
  const yOffset = (canvasHeight - scaledHeight) / 2;

  // Draw the image with zoom and crop
  ctx.drawImage(image, xOffset, yOffset, scaledWidth, scaledHeight);

  // Set up text styling
  ctx.font = `${fontSize}px Selawik`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.lineWidth = 4; // Width of the text border

  // Calculate maximum text width
  const maxTextWidth = canvasWidth * 0.8;

  // Break narration text into multiple lines if needed
  const words = caption.split(" ");
  let line = "";
  const lines = [];

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxTextWidth) {
      lines.push(line);
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  // Draw each line of text with stroke and fill
  const textYPosition = canvasHeight - lines.length * lineHeight - 30;
  lines.forEach((line, index) => {
    const yPosition = textYPosition + index * lineHeight;

    // Draw the stroke (border) first for better visibility
    ctx.strokeStyle = "black"; // Color of the text border
    ctx.strokeText(line.trim(), canvasWidth / 2, yPosition);

    // Draw the main text on top
    ctx.fillStyle = "white";
    ctx.fillText(line.trim(), canvasWidth / 2, yPosition);
  });

  // Save the image
  const buffer = canvas.toBuffer("image/png");
  return buffer;
};

const createOutputVideo = async (jobId: string, segmentCount: number) => {
  const canvasDir = path.join(process.cwd(), "gen", jobId, "canvas");
  const audioDir = path.join(process.cwd(), "gen", jobId, "audio");
  const outputDir = path.join(process.cwd(), "gen", jobId, "output");
  const outputVideo = path.join(outputDir, "output.mp4");

  try {
    await mkdir(outputDir);
  } catch {}

  // Generate individual MP4 files for each segment
  for (let i = 1; i <= segmentCount; i++) {
    const inputImage = path.join(canvasDir, `${i}.png`);
    const inputAudio = path.join(audioDir, `${i}.mp3`);
    const outputSegment = path.join(outputDir, `segment_${i}.mp4`);

    // Get audio duration
    const { stdout: durationOutput } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputAudio}"`,
    );
    const segmentDuration = parseFloat(durationOutput.trim());

    // Calculate fade out start time
    const fadeOutStart = segmentDuration - 0.5;

    // Add fade in/out effects without reducing duration
    await execAsync(
      `ffmpeg -loop 1 -i "${inputImage}" -i "${inputAudio}" -filter_complex ` +
        `"[0:v]fade=t=in:st=0:d=0.5,fade=t=out:st=${fadeOutStart}:d=0.5[v]; ` +
        `[1:a]afade=t=in:st=0:d=0.5,afade=t=out:st=${fadeOutStart}:d=0.5[a]" ` +
        `-map "[v]" -map "[a]" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -t ${segmentDuration} "${outputSegment}"`,
    );
  }

  // Combine all segment MP4 files into a single output video
  const inputList = path.join(outputDir, "input.txt");
  const inputListContent = Array.from(
    { length: segmentCount },
    (_, i) => `file 'segment_${i + 1}.mp4'`,
  ).join("\n");

  await writeFile(inputList, inputListContent);

  await execAsync(
    `ffmpeg -f concat -safe 0 -i "${inputList}" -c copy "${outputVideo}"`,
  );

  // Clean up temporary files
  for (let i = 1; i <= segmentCount; i++) {
    await unlink(path.join(outputDir, `segment_${i}.mp4`));
  }

  await unlink(inputList);
};
