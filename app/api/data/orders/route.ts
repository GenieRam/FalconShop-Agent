import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const orders = await prisma.order.findMany();
  return NextResponse.json(orders);
}
