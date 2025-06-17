import { z } from "zod";
import { init } from "@mastra/inngest";
import { inngest } from "../inngest";
import { EcommerceAgent } from "../agents/ecommerce-agent";

import { ProductDiscoveryTool } from "../tools/ProductDiscoveryTool";
import { OrderManagementTool } from "../tools/OrderManagementTool";
import { CustomerSupportTool } from "../tools/CustomerSupportTool";
import { PersonalizationTool } from "../tools/PersonalizationTool";
import { ShoppingCartCheckoutTool } from "../tools/ShoppingCartCheckoutTool";
import { InventoryFulfillmentTool } from "../tools/InventoryFulfillmentTool";

const { createWorkflow, createStep } = init(inngest);

const toolSelectorSchema = z.object({
    ProductDiscoveryTool: z.boolean(),
    OrderManagementTool: z.boolean(),
    CustomerSupportTool: z.boolean(),
    PersonalizationTool: z.boolean(),
    ShoppingCartCheckoutTool: z.boolean(),
    InventoryFulfillmentTool: z.boolean(),
});

const toolSelectorStep = createStep({
  id: "ToolSelector",
  inputSchema: z.object({ userQuery: z.string() }),
  outputSchema: toolSelectorSchema,
  execute: async ({ inputData }) => {
    const { object } = await EcommerceAgent.generate(
        [{ role: "user", content: inputData.userQuery }],
        {
            output: toolSelectorSchema,
            instructions: `
                Based on the user's query, you must decide which of the available tools are required.
                Your output MUST be a JSON object with a boolean value for each of the available tool keys.
            `,
        }
    );
    return object;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createToolRunnerStep = (tool: any) => createStep({
  id: tool.id,
  inputSchema: toolSelectorSchema,
  outputSchema: z.object({ result: z.string().or(z.null()) }),
  execute: async ({ getInitData }) => {
    const { userQuery } = getInitData();
    const toolResult = await tool.execute({ context: { input: userQuery } });
    return { result: toolResult };
  }
});

const runProductDiscovery = createToolRunnerStep(ProductDiscoveryTool);
const runOrderManagement = createToolRunnerStep(OrderManagementTool);
const runCustomerSupport = createToolRunnerStep(CustomerSupportTool);
const runPersonalization = createToolRunnerStep(PersonalizationTool);
const runShoppingCartCheckout = createToolRunnerStep(ShoppingCartCheckoutTool);
const runInventoryFulfillment = createToolRunnerStep(InventoryFulfillmentTool);

const synthesisInputSchema = z.object({
    ProductDiscoveryTool: z.object({ result: z.string().or(z.null()) }).optional(),
    OrderManagementTool: z.object({ result: z.string().or(z.null()) }).optional(),
    CustomerSupportTool: z.object({ result: z.string().or(z.null()) }).optional(),
    PersonalizationTool: z.object({ result: z.string().or(z.null()) }).optional(),
    ShoppingCartCheckoutTool: z.object({ result: z.string().or(z.null()) }).optional(),
    InventoryFulfillmentTool: z.object({ result: z.string().or(z.null()) }).optional(),
}).passthrough();


const synthesizeResults = createStep({
    id: "SynthesizeResults",
    inputSchema: synthesisInputSchema,
    outputSchema: z.object({ finalResponse: z.string() }),
    execute: async ({ inputData, getInitData }) => {
        const { userQuery } = getInitData();
        const { text } = await EcommerceAgent.generate([
            {
                role: "user",
                content: `Original Query: "${userQuery}". Tool Results: ${JSON.stringify(inputData)}. Synthesize these results into a final answer.`
            }
        ]);
        return { finalResponse: text };
    }
});

export const DynamicToolExecutionWorkflow = createWorkflow({
  id: "DynamicToolExecutionWorkflow",
  description: "Selects tools, runs them in parallel, and synthesizes the results.",
  inputSchema: z.object({
    userQuery: z.string(),
  }),
  outputSchema: z.object({
    finalResponse: z.string(),
  }),
})
  .then(toolSelectorStep)
  .branch([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [ (ctx: any) => ctx.getStepResult(toolSelectorStep).output.ProductDiscoveryTool, runProductDiscovery ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [ (ctx: any) => ctx.getStepResult(toolSelectorStep).output.OrderManagementTool, runOrderManagement ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [ (ctx: any) => ctx.getStepResult(toolSelectorStep).output.CustomerSupportTool, runCustomerSupport ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [ (ctx: any) => ctx.getStepResult(toolSelectorStep).output.PersonalizationTool, runPersonalization ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [ (ctx: any) => ctx.getStepResult(toolSelectorStep).output.ShoppingCartCheckoutTool, runShoppingCartCheckout ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [ (ctx: any) => ctx.getStepResult(toolSelectorStep).output.InventoryFulfillmentTool, runInventoryFulfillment ],
  ])
  .then(synthesizeResults)
  .commit();