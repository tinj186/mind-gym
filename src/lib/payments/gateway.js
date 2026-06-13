/**
 * PaymentGateway Interface
 * 
 * This is the core "Payment Agnostic" layer. It does not care if we use Stripe,
 * HitPay, or PayPal. It simply standardizes how our Next.js backend asks for
 * a checkout URL or verifies a webhook signature.
 */
export class PaymentGateway {
  /**
   * Generates a secure checkout session URL for the user to pay.
   * @param {Object} options
   * @param {string} options.userId - The ID of the user buying the subscription.
   * @param {number} options.amount - The total amount in the local currency (e.g. 29.90).
   * @param {string} options.currency - The currency code (e.g. 'SGD').
   * @param {string} options.redirectUrl - Where to send them after successful payment.
   * @returns {Promise<string>} The URL to redirect the user to.
   */
  async createCheckoutSession({ userId, amount, currency, redirectUrl }) {
    throw new Error('Method not implemented.');
  }

  /**
   * Verifies the cryptographic signature of an incoming webhook to ensure it is authentic.
   * @param {string} payload - The raw request body from the payment provider.
   * @param {string} signature - The signature header sent by the payment provider.
   * @returns {Promise<boolean>} True if valid, False if hacked/invalid.
   */
  async verifyWebhookSignature(payload, signature) {
    throw new Error('Method not implemented.');
  }
}
