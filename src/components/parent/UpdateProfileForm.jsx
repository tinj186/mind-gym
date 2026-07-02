"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpdateProfileForm({ defaultName = '', defaultEmail = '' }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: defaultName, email: defaultEmail });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      
      setStatus('success');
      setMessage('Your profile has been successfully updated.');
      router.refresh(); // Refresh to update session data if possible
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="bg-white p-8 border border-indigo-100 rounded-[2.5rem] shadow-sm mb-8">
      <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tight mb-6 flex items-center gap-3">
        <span className="w-10 h-10 bg-indigo-50 flex items-center justify-center rounded-xl text-indigo-600">👤</span>
        Personal Information
      </h2>
      
      {status === 'success' && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100 flex items-center gap-3">
          <span>✓</span> {message}
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold border border-rose-100 flex items-center gap-3">
          <span>⚠️</span> {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-widest mb-2">Full Name</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-4 font-medium outline-none transition-all"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-widest mb-2">Email Address</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-4 font-medium outline-none transition-all"
          />
          <p className="text-xs text-slate-400 font-medium mt-2">Note: Changing your email will update your login credentials.</p>
        </div>

        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="mt-4 bg-indigo-900 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-800 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
