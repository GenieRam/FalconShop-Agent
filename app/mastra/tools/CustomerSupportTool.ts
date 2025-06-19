import { createTool } from "@mastra/core";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getReturnPolicy() {
  const policy = await prisma.policy.findFirst({ where: { type: "returns" } });
  return policy?.content || "No return policy found.";
}

async function getShippingInfo() {
  const policy = await prisma.policy.findFirst({ where: { type: "shipping" } });
  return policy?.content || "No shipping info found.";
}

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
