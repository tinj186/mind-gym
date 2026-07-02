"use client";

import { useState } from 'react';

export default function SupportForm({ defaultName, defaultEmail }) {
  const [formData, setFormData] = useState({ 
    name: defaultName || '', 
    email: defaultEmail || '', 
    message: '' 
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'SUBSCRIBER' }),
      });

      if (!res.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ ...formData, message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 p-12 rounded-[2.5rem] border border-emerald-100 text-center">
        <span className="text-6xl block mb-4">✅</span>
        <h3 className="text-2xl font-black text-emerald-900 mb-2">Ticket Submitted</h3>
        <p className="text-emerald-700 font-medium">Our technical support team has received your ticket and will email you shortly.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-8 px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Submit Another Ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-indigo-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-bold text-indigo-950 uppercase tracking-widest mb-2">Your Name</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-4 font-medium outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-indigo-950 uppercase tracking-widest mb-2">Email Address</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-4 font-medium outline-none transition-all"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <label className="block text-xs font-bold text-indigo-950 uppercase tracking-widest mb-2">How can we help?</label>
        <textarea 
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-4 font-medium outline-none transition-all resize-none"
          placeholder="Describe your issue or question in detail..."
        ></textarea>
      </div>

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
          Something went wrong. Please try again later.
        </div>
      )}

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="bg-indigo-600 text-white font-black py-4 px-8 rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Ticket'}
      </button>
    </form>
  );
}
