import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { HitPayAdapter } from '@/lib/payments/adapters/HitPayAdapter';

export async function POST(req) {
  try {
    // HitPay sends form data (application/x-www-form-urlencoded)
    const formData = await req.formData();
    const payloadData = Object.fromEntries(formData.entries());
    
    const adapter = new HitPayAdapter();

    // Verify the payload using our adapter
    // Note: HitPay's actual HMAC verification requires sorting keys. 
    // For now, we trust the adapter to handle the specific logic.
    const isValid = await adapter.verifyWebhookSignature(payloadData, payloadData.hmac);

    if (!isValid) {
      console.error("Payment Webhook: Invalid signature detected!");
      return NextResponse.json({ error: "Unauthorized payload" }, { status: 401 });
    }

    // Process the payment status
    const { status, reference_number } = payloadData;

    if (status === 'completed') {
      // Extract userId from reference_number (Format: sub_USERID_TIMESTAMP)
      // e.g. "sub_clxk123abc_1700000000" -> "clxk123abc"
      const parts = reference_number?.split('_') || [];
      if (parts.length >= 2 && parts[0] === 'sub') {
        const userId = parts[1];

        // Safely upgrade the user in Supabase
        await prisma.user.update({
          where: { id: userId },
          data: { subscriptionStatus: 'ACTIVE' }
        });

        console.log(`Successfully upgraded User ${userId} to ACTIVE subscription!`);
      }
    }

    // Always return 200 OK to the payment gateway so it stops retrying
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Payment Webhook Processing Error:", error);
    // Still return 200 to prevent infinite retry loops from the gateway, unless it's a critical server failure
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
