import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { HitPayAdapter } from '@/lib/payments/adapters/HitPayAdapter';
import { prisma } from '@/lib/db';

async function generateCheckout(req, isRedirect = false) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      if (isRedirect) {
        return NextResponse.redirect(new URL('/login?callbackUrl=/api/checkout/hitpay', req.url));
      }
      return NextResponse.json({ error: "Please log in or sign up to unlock unlimited access." }, { status: 401 });
    }

    const userId = session.user.id;
    const adapter = new HitPayAdapter();

    const amount = 29.90;
    const currency = 'SGD';
    
    let host = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    try {
      if (req.nextUrl && req.nextUrl.origin) {
        host = req.nextUrl.origin;
      } else if (process.env.VERCEL_URL) {
        host = `https://${process.env.VERCEL_URL}`;
      }
    } catch (e) {}
    
    const redirectUrl = `${host}/hub?payment=success`;
    const webhookUrl = `${host}/api/webhooks/payment`;

    const checkoutUrl = await adapter.createCheckoutSession({
      userId,
      amount,
      currency,
      redirectUrl,
      webhookUrl
    });

    if (isRedirect) {
      return NextResponse.redirect(checkoutUrl);
    }
    return NextResponse.json({ url: checkoutUrl }, { status: 200 });
  } catch (error) {
    console.error("Checkout Generation Error:", error);
    if (isRedirect) {
      return NextResponse.redirect(new URL('/hub?error=checkout_failed', req.url));
    }
    return NextResponse.json({ error: error.message || "Failed to generate checkout." }, { status: 500 });
  }
}

export async function POST(req) {
  return generateCheckout(req, false);
}

export async function GET(req) {
  return generateCheckout(req, true);
}
