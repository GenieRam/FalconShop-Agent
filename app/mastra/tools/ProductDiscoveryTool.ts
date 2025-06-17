import { createTool } from "@mastra/core";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function searchProducts(query: string, category?: string, minPrice?: number, maxPrice?: number) {
  console.log("Connecting to Application Backend...");
  console.log(`Searching for products with query: ${query}`);
  const mockProducts = [
    { id: 'prd_1', name: 'Quantum Laptop', price: 1500, category: 'Electronics' },
    { id: 'prd_2', name: 'Ergo Keyboard', price: 120, category: 'Accessories' },
    { id: 'prd_3', name: '4K Monitor', price: 800, category: 'Electronics' },
  ];
  return JSON.stringify(mockProducts);
}

export const ProductDiscoveryTool = createTool({
  id: "ProductDiscoveryTool",
  description: "Searches and retrieves products from the catalog based on queries, filters like category, and price range.",
  inputSchema: z.object({
    query: z.string(),
    category: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
  }),
  execute: async ({ context }) => {
    return await searchProducts(context.query, context.category, context.minPrice, context.maxPrice);
  },
});