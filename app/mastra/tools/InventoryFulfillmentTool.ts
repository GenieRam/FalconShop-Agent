import { createTool } from "@mastra/core";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function checkStock(productId: string) { /* ... */ }

export const InventoryFulfillmentTool = createTool({
  id: "InventoryFulfillmentTool",
  description: "Checks the stock level and availability of a specific product.",
  inputSchema: z.object({
    productId: z.string(),
  }),
  execute: async ({ context }) => {
    return await checkStock(context.productId);
  },
});