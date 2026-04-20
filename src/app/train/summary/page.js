'use client';

import Link from 'next/link';

export default function SummaryPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 text-center space-y-8">
        <div className="relative inline-block">
          <div className="text-6xl mb-4">🧠</div>
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-black p-1 rounded-full px-2">
            100%
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
            Rep <span className="text-blue-600">Complete</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm">
            Synaptic pathways successfully conditioned.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Performance Metric</span>
          <div className="text-2xl font-black text-slate-900">PRECISION ACCURACY</div>
        </div>

        <Link href="/">
          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95">
            Back to Training Ground
          </button>
        </Link>
      </div>
    </div>
  );
}