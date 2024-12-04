import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      include: { contact: true }
    });
    return NextResponse.json(deals);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const deal = await prisma.deal.create({
      data,
      include: { contact: true }
    });
    return NextResponse.json(deal);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
  }
}
