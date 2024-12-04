import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: { contact: true },
    });
    return NextResponse.json(deal);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.deal.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: { contact: true },
    });
    return NextResponse.json(deal);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deal' }, { status: 500 });
  }
}
