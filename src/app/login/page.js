'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    console.log('Login Client Hydrated');
  }, []);

  const handleLogin = (e) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    const accessCode = process.env.NEXT_PUBLIC_APP_ACCESS_CODE || 'gym-2026';

    if (normalizedEmail === 'student@mathmindgym.com' && normalizedPassword === accessCode) {
      // Always prevent default if we are handling the redirect via JS
      if (e) e.preventDefault();
      console.log('✅ Access Granted (Client). Navigating...');
      
      // router.push is more reliable for SPAs in Safari than window.location.href
      router.push('/');
    } else {
      console.log('❌ Access Denied (Client).');
      // If JS is active, we should prevent the server action from firing on a known failure
      if (e) e.preventDefault();
      alert('Invalid Access Code.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
            Mind<span className="text-blue-600">Gym</span>
          </h1>
          <p className="mt-2 text-slate-400 font-medium uppercase text-xs tracking-widest">
            Precision Engineering for the Mind
          </p>
        </div>

        <form 
          action={loginAction}
          onSubmit={handleLogin}
          className="space-y-4"
          autoComplete="off"
        >
          <input 
            type="email" 
            name="email"
            placeholder="student@mathmindgym.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all"
          />
          <input 
            type="password" 
            name="password"
            placeholder="Enter Access Code"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all"
          />
          <button 
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95"
          >
            Enter the Gym
          </button>
        </form>
      </div>
    </div>
  );
}