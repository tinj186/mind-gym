"use client";

import { useRouter } from 'next/navigation';

export default function CheckoutButton() {
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/checkout/stripe', { method: 'POST' });
      const data = await res.json();
      
      if (res.status === 401) {
        // User not logged in
        router.push('/login?callbackUrl=/api/checkout/stripe');
        return;
      }
      
      if (!res.ok) throw new Error(data.error);
      
      // Redirect to Stripe
      window.location.href = data.url;
    } catch (err) {
      alert("Checkout failed: " + err.message);
    }
  };

  return (
    <button 
      onClick={handleCheckout}
      className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
    >
      Get Annual Pass
    </button>
  );
}
