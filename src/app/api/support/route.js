import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message, type } = body;

    if (!name || !email || !message || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Attempt to get the user session if it exists (for subscriber enquiries)
    let userId = null;
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        userId = session.user.id;
      }
    } catch (e) {
      // Ignore if not logged in
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        name,
        email,
        message,
        type,
        userId,
      },
    });

    return NextResponse.json({ success: true, ticketId: ticket.id });
  } catch (error) {
    console.error('Support Ticket Error:', error);
    return NextResponse.json({ error: 'Failed to submit support ticket.' }, { status: 500 });
  }
}
