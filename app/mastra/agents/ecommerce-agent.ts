import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";
import { CustomerSupportTool } from "../tools/CustomerSupportTool";

export const EcommerceAgent = new Agent({
  name: "Ecommerce Agent",
  instructions: `
    You are an AI agent for an e-commerce platform. Your tasks include:
    - Assisting with product discovery based on user preferences.
    - Managing order statuses and updates.
    - Providing customer support with relevant information.
    - Generating personalized product recommendations.
    - Processing shopping and checkout requests.
    - Handling inventory fulfillment updates.
    Respond concisely and accurately based on the user's request.
    Use the CustomerSupportTool when users ask about:
  - returns (e.g. "I want to return this", "refund", "send back", "return policy")
  - shipping (e.g. "how long to deliver", "delivery time", "shipping info")


  `,
  model: google("gemini-2.0-flash"),
  tools: {
    customerSupport: CustomerSupportTool
  },
    
});
