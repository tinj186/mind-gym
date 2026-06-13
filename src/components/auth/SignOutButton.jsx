'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="px-6 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
    >
      Sign Out
    </button>
  );
}
