import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { openai } from "@/server/lib/openai";

export const generateRouter = createTRPCRouter({
  createStory: publicProcedure
    .input(z.object({ idea: z.string().min(10).max(200) }))
    .mutation(async ({ input }) => {
      console.log("Generating script...");
      console.log(input.idea);

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
});
