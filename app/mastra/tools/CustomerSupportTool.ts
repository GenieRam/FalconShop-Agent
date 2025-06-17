import { createTool } from "@mastra/core";
import { z } from "zod";

async function getReturnPolicy() { /* ... */ }
async function getShippingInfo() { /* ... */ }

export const CustomerSupportTool = createTool({
  id: "CustomerSupportTool",
  description: "Provides help with customer support topics like return policies and shipping information.",
  inputSchema: z.object({
    topic: z.enum(["returns", "shipping"]),
  }),
  execute: async ({ context }) => {
    switch (context.topic) {
      case 'returns':
        return await getReturnPolicy();
      case 'shipping':
        return await getShippingInfo();
      default:
        throw new Error('Unknown support topic.');
    }
  },
});