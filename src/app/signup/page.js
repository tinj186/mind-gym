'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Create the user via our custom API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // 2. Clear form and show success message
      setSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
      setConsent(false);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!consent) return;
    const params = new URLSearchParams(window.location.search);
    const callback = params.get('callbackUrl') || '/hub';
    signIn('google', { callbackUrl: callback });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/assets/img/login-bg.png)' }}
    >
      <div className="w-full max-w-md space-y-8 bg-white/40 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl border border-white/30">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
            Learn<span className="text-blue-600">Reps</span>
          </h1>
          <p className="mt-2 text-slate-700 font-bold uppercase text-xs tracking-widest">
            Create your Free Account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium text-center border border-green-200">
            Account created successfully! Please check your email to verify your account before logging in.
          </div>
        )}

          <button 
            onClick={handleGoogleLogin}
            disabled={!consent}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-4 rounded-2xl border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Sign up with Google
          </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-slate-800 font-medium">or register with email</span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            type="text" 
            name="name"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-900"
          />
          <input 
            type="email" 
            name="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-900"
          />
          <input 
            type="password" 
            name="password"
            placeholder="Create Password (min 8 characters)"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-900"
          />
          <div className="flex items-start gap-3 mt-4">
            <input
              type="checkbox"
              id="consent"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="consent" className="text-sm text-slate-800 font-medium text-left">
              I consent to the collection and use of my personal data for the purpose of creating and managing my account, in accordance with the <Link href="/privacy-policy" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link>.
            </label>
          </div>
          <button 
            type="submit"
            disabled={isLoading || !consent}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-800 font-medium text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
