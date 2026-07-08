import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { StripeAdapter } from '@/lib/payments/adapters/StripeAdapter';
import { sendSubscriptionWelcomeEmail } from '@/lib/email';

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    const adapter = new StripeAdapter();
    const event = adapter.verifyWebhookSignature(rawBody, signature);

    if (!event) {
      return NextResponse.json({ error: "Unauthorized payload" }, { status: 400 });
    }

    console.log(`[Stripe Webhook] Received Event: ${event.type}`);

    // Handle checkout session completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const stripeCustomerId = session.customer;

      if (userId) {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { 
            subscriptionStatus: 'ACTIVE',
            stripeCustomerId: stripeCustomerId
          }
        });
        console.log(`Successfully upgraded User ${userId} to ACTIVE subscription!`);
        
        // Send the welcome email
        if (updatedUser && updatedUser.email) {
          try {
            await sendSubscriptionWelcomeEmail(updatedUser.email, updatedUser.name);
            console.log(`Welcome email sent successfully to ${updatedUser.email}`);
          } catch (emailError) {
            console.error(`Failed to send welcome email to ${updatedUser.email}:`, emailError);
          }
        }
      } else {
        console.warn(`[Stripe Webhook] checkout.session.completed missing client_reference_id for session ${session.id}`);
      }
    }

    // Handle subscription updates/cancellations
    if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const stripeCustomerId = subscription.customer;
      
      const statusMap = {
        'active': 'ACTIVE',
        'past_due': 'PAST_DUE',
        'unpaid': 'PAST_DUE',
        'canceled': 'CANCELED',
        'incomplete': 'INACTIVE',
        'incomplete_expired': 'INACTIVE',
        'trialing': 'ACTIVE'
      };

      const newStatus = statusMap[subscription.status] || 'INACTIVE';

      // Find user by stripeCustomerId
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId }
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { subscriptionStatus: newStatus }
        });
        console.log(`Updated User ${user.id} subscriptionStatus to ${newStatus}`);
      } else {
        console.warn(`[Stripe Webhook] No user found for stripeCustomerId: ${stripeCustomerId}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe Webhook Processing Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
