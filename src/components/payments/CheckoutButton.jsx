"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutButton() {
  const router = useRouter();
  const [consent, setConsent] = useState(false);

  const handleCheckout = async () => {
    if (!consent) return;
    try {
      const res = await fetch('/api/checkout/hitpay', { method: 'POST' });
      const data = await res.json();
      
      if (res.status === 401) {
        // User not logged in, redirect to login with callback to the new GET checkout route
        router.push('/login?callbackUrl=/api/checkout/hitpay');
        return;
      }
      
      if (!res.ok) throw new Error(data.error);
      
      // Redirect to HitPay
      window.location.href = data.url;
    } catch (err) {
      alert("Checkout failed: " + err.message);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-6">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="checkout-consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="checkout-consent" className="text-xs text-slate-500 text-left">
          I consent to the collection and use of my personal data for the purpose of processing this transaction and managing my subscription, in accordance with the <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
        </label>
      </div>
      <button 
        onClick={handleCheckout}
        disabled={!consent}
        className="w-full px-5 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Get Annual Pass
      </button>
    </div>
  );
}
