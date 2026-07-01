import { PaymentGateway } from '../gateway';
import crypto from 'crypto';

export class HitPayAdapter extends PaymentGateway {
  constructor() {
    super();
    this.apiKey = process.env.HITPAY_API_KEY;
    this.salt = process.env.HITPAY_SALT;
    
    // Auto-detect Live vs Sandbox based on the key prefix
    this.apiUrl = this.apiKey?.startsWith('liv_') 
      ? 'https://api.hit-pay.com/v1' 
      : 'https://api.sandbox.hit-pay.com/v1';
  }

  async createCheckoutSession({ userId, amount, currency, redirectUrl, webhookUrl }) {
    if (!this.apiKey) {
      throw new Error("HITPAY_API_KEY is missing from environment variables.");
    }

    const response = await fetch(`${this.apiUrl}/payment-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-BUSINESS-API-KEY': this.apiKey,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        reference_number: `sub_${userId}_${Date.now()}`,
        redirect_url: redirectUrl,
        webhook: webhookUrl || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/webhooks/payment`,
        purpose: "LearnReps Annual Pass"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("HitPay Checkout Error:", data);
      throw new Error("Failed to generate HitPay checkout link.");
    }

    // Return the secure URL to redirect the user to
    return data.url;
  }

  async verifyWebhookSignature(payload, signature) {
    if (!this.salt) {
      console.error("HITPAY_SALT is missing. Cannot verify webhook!");
      return false;
    }

    // HitPay Webhook Verification Strategy (HMAC SHA256)
    try {
      // 1. Clone payload and remove the hmac key
      const data = { ...payload };
      delete data.hmac;

      // 2. Sort the keys alphabetically
      const keys = Object.keys(data).sort();

      // 3. Concatenate the values of all POST parameters
      let valuesStr = "";
      for (const key of keys) {
        valuesStr += data[key];
      }

      // 4. Generate HMAC-SHA256 signature using the salt
      const hmac = crypto.createHmac('sha256', this.salt);
      hmac.update(valuesStr);
      const generatedSignature = hmac.digest('hex');

      // 5. Compare signatures
      return generatedSignature === signature;
    } catch (e) {
      console.error("HitPay Webhook Verification Failed:", e);
      return false;
    }
  }
}
