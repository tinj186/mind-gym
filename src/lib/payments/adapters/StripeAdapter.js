import Stripe from 'stripe';
import { PaymentGateway } from '../gateway';

export class StripeAdapter extends PaymentGateway {
  constructor() {
    super();
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("STRIPE_SECRET_KEY is missing from environment variables.");
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession({ userId, redirectUrl }) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is missing from environment variables.");
    }
    
    // We expect a STRIPE_PRICE_ID for the recurring subscription
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      throw new Error("STRIPE_PRICE_ID is missing from environment variables.");
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'], // PayNow is not supported for subscriptions
      mode: 'subscription',
      allow_promotion_codes: true, // Enable coupon codes on the checkout page
      subscription_data: {
        trial_period_days: 7
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: userId,
      success_url: `${redirectUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${redirectUrl}?error=checkout_cancelled`,
    });

    return session.url;
  }

  verifyWebhookSignature(rawBody, signature) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is missing. Cannot verify webhook!");
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
      return event;
    } catch (err) {
      console.error("Stripe Webhook Signature Verification Failed:", err.message);
      return null;
    }
  }

  async verifySession(sessionId) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      if (session && (session.payment_status === 'paid' || session.payment_status === 'no_payment_required')) {
        return {
          isPaid: true,
          userId: session.client_reference_id,
          stripeCustomerId: session.customer
        };
      }
      return { isPaid: false };
    } catch (err) {
      console.error("Stripe session verification failed:", err);
      return { isPaid: false };
    }
  }
}
