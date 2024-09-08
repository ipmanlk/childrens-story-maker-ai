import { openai } from "@/server/lib/openai";
import { writeFile } from "fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

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

const audioDir = path.join(process.cwd(), "gen", "audio");
const imageDir = path.join(process.cwd(), "gen", "images");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let i = 1;
  for (const segment of dummySgements) {
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

    const audioRes = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: segment.narration,
    });

    const image = await fetch(imageUrl).then((res) => res.arrayBuffer());

    // save image to file
    await writeFile(path.join(imageDir, `${i}.png`), Buffer.from(image));

    // save audio to file
    const buffer = Buffer.from(await audioRes.arrayBuffer());
    await writeFile(path.join(audioDir, `${i}.mp3`), buffer);

    i++;
  }

  res.status(200).json({ success: true });
}
