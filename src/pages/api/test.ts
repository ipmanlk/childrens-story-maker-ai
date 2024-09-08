import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { createCanvas, loadImage, registerFont } from "canvas";
import { readdir, writeFile } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs"; // Added import for fs

const execAsync = promisify(exec);

registerFont(path.join(process.cwd(), "selawkb.ttf"), {
  family: "Selawik",
});

const dummySegments = [
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

const imageDir = path.join(process.cwd(), "gen", "images");
const canvasDir = path.join(process.cwd(), "gen", "canvas");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // const canvasWidth = 1280;
  // const canvasHeight = 720;
  // const fontSize = 45;
  // const lineHeight = fontSize * 1.2;

  // for (let i = 0; i < dummySegments.length; i++) {
  //   const segment = dummySegments[i];
  //   const image = await loadImage(path.join(imageDir, `${i + 1}.png`));

  //   const canvas = createCanvas(canvasWidth, canvasHeight);
  //   const ctx = canvas.getContext("2d");

  //   // Calculate the scaling factor to zoom and crop the image
  //   const scale = Math.max(
  //     canvasWidth / image.width,
  //     canvasHeight / image.height,
  //   );
  //   const scaledWidth = image.width * scale;
  //   const scaledHeight = image.height * scale;

  //   const xOffset = (canvasWidth - scaledWidth) / 2;
  //   const yOffset = (canvasHeight - scaledHeight) / 2;

  //   // Draw the image with zoom and crop
  //   ctx.drawImage(image, xOffset, yOffset, scaledWidth, scaledHeight);

  //   // Set up text styling
  //   ctx.font = `${fontSize}px Selawik`;
  //   ctx.fillStyle = "white";
  //   ctx.textAlign = "center";
  //   ctx.lineWidth = 4; // Width of the text border

  //   // Calculate maximum text width
  //   const maxTextWidth = canvasWidth * 0.8;

  //   // Break narration text into multiple lines if needed
  //   const words = segment.narration.split(" ");
  //   let line = "";
  //   const lines = [];

  //   for (const word of words) {
  //     const testLine = line + word + " ";
  //     const metrics = ctx.measureText(testLine);
  //     const testWidth = metrics.width;

  //     if (testWidth > maxTextWidth) {
  //       lines.push(line);
  //       line = word + " ";
  //     } else {
  //       line = testLine;
  //     }
  //   }
  //   lines.push(line);

  //   // Draw each line of text with stroke and fill
  //   const textYPosition = canvasHeight - lines.length * lineHeight - 30;
  //   lines.forEach((line, index) => {
  //     const yPosition = textYPosition + index * lineHeight;

  //     // Draw the stroke (border) first for better visibility
  //     ctx.strokeStyle = "black"; // Color of the text border
  //     ctx.strokeText(line.trim(), canvasWidth / 2, yPosition);

  //     // Draw the main text on top
  //     ctx.fillStyle = "white";
  //     ctx.fillText(line.trim(), canvasWidth / 2, yPosition);
  //   });

  //   // Save the image
  //   const buffer = canvas.toBuffer("image/png");
  //   await writeFile(path.join(canvasDir, `${i + 1}.png`), buffer);
  // }

  // After generating all canvas images
  await generateVideo();

  res.status(200).json({ success: true });
}

async function generateVideo() {
  const audioDir = path.join(process.cwd(), "gen", "audio");
  const outputDir = path.join(process.cwd(), "gen", "output");
  const outputVideo = path.join(outputDir, "output.mp4");

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get the number of segments
  const files = await readdir(audioDir);
  const segmentCount = files.length;

  // Generate individual MP4 files for each segment
  for (let i = 1; i <= segmentCount; i++) {
    const inputImage = path.join(canvasDir, `${i}.png`);
    const inputAudio = path.join(audioDir, `${i}.mp3`);
    const outputSegment = path.join(outputDir, `segment_${i}.mp4`);

    // Get audio duration
    const { stdout: durationOutput } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputAudio}"`
    );
    const segmentDuration = parseFloat(durationOutput.trim());

    // Calculate fade out start time
    const fadeOutStart = segmentDuration - 0.5;

    // Add fade in/out effects without reducing duration
    await execAsync(
      `ffmpeg -loop 1 -i "${inputImage}" -i "${inputAudio}" -filter_complex ` +
      `"[0:v]fade=t=in:st=0:d=0.5,fade=t=out:st=${fadeOutStart}:d=0.5[v]; ` +
      `[1:a]afade=t=in:st=0:d=0.5,afade=t=out:st=${fadeOutStart}:d=0.5[a]" ` +
      `-map "[v]" -map "[a]" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -t ${segmentDuration} "${outputSegment}"`
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
    fs.unlinkSync(path.join(outputDir, `segment_${i}.mp4`));
  }
  fs.unlinkSync(inputList);

  console.log("Video generation complete!");
}
