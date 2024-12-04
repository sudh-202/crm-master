import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await request.json();
    
    console.log('Updating contact:', { id, data });
    
    // Validate status if it's being updated
    if (data.status !== undefined) {
      const validStatuses = ['active', 'inactive', 'lead', 'customer', 'prospect'];
      if (!validStatuses.includes(data.status)) {
        return NextResponse.json(
          { error: `Invalid status value. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Check if contact exists
    const existingContact = await prisma.contact.findUnique({
      where: { id }
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Update the contact
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await prisma.contact.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const contact = await prisma.contact.findUnique({
      where: { id }
    });

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}
