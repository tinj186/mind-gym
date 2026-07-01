import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { HitPayAdapter } from '@/lib/payments/adapters/HitPayAdapter';
import { prisma } from '@/lib/db';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // If the user isn't logged in, they must log in to buy the subscription.
    // The landing page will prompt them to sign up first, or we can pass a URL to login.
    if (!session || !session.user) {
      return NextResponse.json({ error: "Please log in or sign up to unlock unlimited access." }, { status: 401 });
    }

    const userId = session.user.id;
    const adapter = new HitPayAdapter();

    // The subscription price is S$29.90
    const amount = 29.90;
    const currency = 'SGD';
    
    // Determine host dynamically (crucial for Vercel preview environments)
    let host = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    try {
      if (req.nextUrl && req.nextUrl.origin) {
        host = req.nextUrl.origin;
      } else if (process.env.VERCEL_URL) {
        host = `https://${process.env.VERCEL_URL}`;
      }
    } catch (e) {
      // Fallback
    }
    
    // Where HitPay should send them after they pay
    const redirectUrl = `${host}/hub?payment=success`;
    const webhookUrl = `${host}/api/webhooks/payment`;

    // Generate the secure checkout URL
    const checkoutUrl = await adapter.createCheckoutSession({
      userId,
      amount,
      currency,
      redirectUrl,
      webhookUrl
    });

    return NextResponse.json({ url: checkoutUrl }, { status: 200 });
  } catch (error) {
    console.error("Checkout Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate checkout." }, { status: 500 });
  }
}
