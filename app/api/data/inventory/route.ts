import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const items = await prisma.inventoryItem.findMany();
  return NextResponse.json(items);
}
