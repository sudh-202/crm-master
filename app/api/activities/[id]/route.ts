import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const activity = await prisma.activity.update({
      where: { id: params.id },
      data,
      include: { contact: true, deal: true },
    });
    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.activity.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: params.id },
      include: { contact: true, deal: true },
    });
    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
