"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SupportWidget({ defaultName = '', defaultEmail = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: defaultName || 'Subscriber', 
          email: defaultEmail || 'subscriber@example.com', 
          message: formData.message, 
          type: 'SUBSCRIBER' 
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ message: '' });
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 bg-violet-600 text-white shadow-xl px-5 py-3 rounded-full font-bold text-sm hover:bg-violet-700 hover:-translate-y-1 transition-transform z-50 flex items-center gap-2 print:hidden group"
        >
          <span className="text-xl">💬</span> 
          <span className="hidden md:inline group-hover:inline-block transition-all">Help & Support</span>
        </button>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-indigo-950/40 backdrop-blur-sm p-4 sm:p-6 print:hidden">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-indigo-100 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
            
            <div className="bg-indigo-50/50 p-6 border-b border-indigo-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-indigo-950">Subscriber Support</h3>
                <p className="text-xs font-bold text-indigo-900/60 uppercase tracking-widest mt-1">Priority Channel</p>
              </div>
              <div className="flex gap-2">
                <Link 
                  href="/parent/settings" 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition-colors text-sm"
                  title="Account Settings"
                >
                  ⚙️
                </Link>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {status === 'success' ? (
                <div className="text-center py-8">
                  <span className="text-5xl block mb-4">📬</span>
                  <h4 className="text-xl font-black text-indigo-950 mb-2">Message Sent!</h4>
                  <p className="text-sm font-medium text-indigo-900/60">Our support team will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-widest mb-2">How can we help?</label>
                    <textarea 
                      required
                      autoFocus
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ message: e.target.value })}
                      className="w-full bg-indigo-50/50 border border-indigo-100 text-indigo-950 text-sm rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 block p-4 font-medium outline-none transition-all resize-none"
                      placeholder="Describe the issue or ask a question..."
                    ></textarea>
                  </div>

                  {status === 'error' && (
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full bg-violet-600 text-white font-black py-3 px-6 rounded-xl hover:bg-violet-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
