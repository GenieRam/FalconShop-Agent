import { Mastra } from "@mastra/core";
import { EcommerceAgent } from "./agents/ecommerce-agent";

export const mastra = new Mastra({
  workflows: {},
  agents: { EcommerceAgent },
});
