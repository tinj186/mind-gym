export const metadata = {
  title: 'Refund Policy | The Learn Reps'
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-8">Refund Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. 30-Day Money-Back Guarantee</h2>
          <p>
            We stand behind our product and your satisfaction with it is important to us. Because our product is a digital good delivered via Internet download, we generally offer no refunds except under our explicit 30-day money-back guarantee.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Conditions for Refund</h2>
          <p>
            If you change your mind about your purchase and you have not downloaded our product or heavily utilized the core AI generation engine, we will happily issue you a refund upon your request within 30 days of your original purchase.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Consumer Protection (Fair Trading) Act</h2>
          <p>
            In compliance with the Consumer Protection (Fair Trading) Act (CPFTA) of Singapore, we are committed to fair and transparent business practices. All our prices are displayed upfront with no hidden fees, and we ensure that our product descriptions accurately reflect the service provided. 
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Process for Requesting a Refund</h2>
          <p>
            To request a refund, please submit a support ticket through your account dashboard or contact our support team directly. We aim to process all valid refund requests within 5-7 business days.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about our Returns and Refunds Policy, please contact us at:
          </p>
          <p className="font-bold text-blue-600 mt-2">support@thelearnreps.com</p>
        </div>
      </div>
    </div>
  );
}
