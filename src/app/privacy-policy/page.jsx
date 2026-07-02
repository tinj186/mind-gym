export const metadata = {
  title: 'Privacy Policy | The Learn Reps'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Introduction</h2>
          <p>
            The Learn Reps ("we," "our," or "us") respects your privacy and is committed to protecting your personal data in compliance with the Personal Data Protection Act (PDPA) of Singapore. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Collection of Personal Data</h2>
          <p>
            We may collect personal data from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. The types of personal data we may collect include, but are not limited to, your name, email address, mailing address, and phone number.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Use of Personal Data</h2>
          <p>
            Any of the information we collect from you may be used in the following ways:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
            <li>To improve our website in order to better serve you.</li>
            <li>To allow us to better service you in responding to your customer service requests.</li>
            <li>To quickly process your transactions.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Disclosure of Personal Data</h2>
          <p>
            We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Access and Correction</h2>
          <p>
            You may request access to, or correction of, your personal data that is in our possession or under our control. Please utilize the Settings panel in your dashboard or contact our Data Protection Officer for assistance.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Contact Us</h2>
          <p>
            If there are any questions regarding this privacy policy or if you wish to withdraw consent to our use of your data, you may contact our Data Protection Officer (DPO) at:
          </p>
          <p className="font-bold text-blue-600 mt-2">dpo@thelearnreps.com</p>
        </div>
      </div>
    </div>
  );
}
