import { EcommerceAgent } from "@/app/mastra/agents/ecommerce-agent";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const result = await EcommerceAgent.generate([
    { role: 'user', content: message }
  ]);

  return NextResponse.json({ interpretation: result.text });
}
