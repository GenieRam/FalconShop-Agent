import { createTool } from "@mastra/core";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getRecommendations(userId: string) { /* ... */ }

export const PersonalizationTool = createTool({
  id: "PersonalizationTool",
  description: "Provides personalized product recommendations for a user based on their history.",
  inputSchema: z.object({
    userId: z.string(),
  }),
  execute: async ({ context }) => {
    return await getRecommendations(context.userId);
  },
});