import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const SENDER_EMAIL = 'The Learn Reps <no-reply@thelearnreps.com>';

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

    // Determine the destination email based on the ticket type
    const toEmail = type === 'SUBSCRIBER' ? 'support@thelearnreps.com' : 'hello@thelearnreps.com';
    const emailSubject = type === 'SUBSCRIBER' 
      ? `[Technical Support] New ticket from ${name}`
      : `[General Enquiry] New message from ${name}`;

    // Send the email to the admin inbox
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: toEmail,
      replyTo: email, // This allows the admin to just hit "Reply" and email the user back directly
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563EB;">New ${type === 'SUBSCRIBER' ? 'Support Ticket' : 'Enquiry'}</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Type:</strong> ${type}</p>
          ${userId ? `<p><strong>User ID:</strong> ${userId}</p>` : ''}
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 15px; border-radius: 8px;">${message}</p>
          <br />
          <p style="color: #6B7280; font-size: 12px;">This email was automatically generated from your website contact form. To reply to the user, simply hit reply on this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, ticketId: ticket.id });
  } catch (error) {
    console.error('Support Ticket Error:', error);
    return NextResponse.json({ error: 'Failed to submit support ticket.' }, { status: 500 });
  }
}
