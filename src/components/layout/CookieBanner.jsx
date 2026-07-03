"use client";

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setIsVisible(false);
    // Here we would typically initialize tracking scripts or push to dataLayer
    // e.g., window.initializeAnalytics();
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookie-consent', 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 p-4 md:p-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-slate-300 text-sm">
          <h3 className="text-white font-bold mb-2">Cookie Consent</h3>
          <p>
            We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept all", you consent to our use of cookies. Read more in our <a href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</a>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={handleRejectAll}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Reject all
          </button>
          <button 
            onClick={handleAcceptAll}
            className="px-6 py-2 text-sm font-bold text-slate-900 bg-white rounded-lg hover:bg-slate-200 transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
