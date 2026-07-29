import React from 'react';
import Link from 'next/link';

export default function MentalCalculationPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col p-12">
      <div className="mb-12">
        <span className="text-[12px] font-black text-amber-500 uppercase tracking-[0.3em] block mb-4">RESTRICTED ACCESS</span>
        <h1 className="text-5xl font-black text-white tracking-tighter">
          Mental Calculation Gym
        </h1>
        <p className="text-slate-400 font-medium max-w-2xl mt-4">
          Welcome to the secret training ground. Prepare to push your cognitive limits with high-speed repetitive exercises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/math/mental-calculation/single-digit-addition">
          <div className="group bg-slate-800 border-2 border-slate-700 hover:border-amber-500 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-1">
            <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
              ⚡️
            </div>
            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-amber-500 transition-colors">
              Single Digit Addition
            </h2>
            <p className="text-slate-400 font-medium">
              High-speed addition of numbers 1-9. Track your average speed and set new all-time records.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
