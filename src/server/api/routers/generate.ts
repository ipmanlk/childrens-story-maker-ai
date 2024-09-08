import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { openai } from "@/server/lib/openai";

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
});
