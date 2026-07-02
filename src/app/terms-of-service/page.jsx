export const metadata = {
  title: 'Terms of Service | The Learn Reps'
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using our website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Intellectual Property Rights</h2>
          <p>
            Other than the content you own, under these Terms, The Learn Reps and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for purposes of viewing the material contained on this Website and utilizing the educational tools as intended.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Restrictions</h2>
          <p>
            You are specifically restricted from all of the following:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Publishing any Website material in any other media without attribution.</li>
            <li>Selling, sublicensing and/or otherwise commercializing any Website material.</li>
            <li>Using this Website in any way that is or may be damaging to this Website.</li>
            <li>Using this Website contrary to applicable laws and regulations.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Subscriptions and Payments</h2>
          <p>
            Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis depending on the type of subscription plan you select. All pricing is displayed transparently and we guarantee there are no hidden fees associated with our standard plans.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Governing Law & Jurisdiction</h2>
          <p>
            These Terms will be governed by and interpreted in accordance with the laws of Singapore, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Singapore for the resolution of any disputes.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="font-bold text-blue-600 mt-2">hello@thelearnreps.com</p>
        </div>
      </div>
    </div>
  );
}
