'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SummaryContent() {
  const searchParams = useSearchParams();
  const isCorrect = searchParams.get('isCorrect') === 'true';
  const hint = searchParams.get('hint');
  const isLogicCorrect = searchParams.get('logic') === 'true';
  const correctAnswer = searchParams.get('correctAnswer');
  const solution = searchParams.get('solution');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 text-center space-y-8">
        <div className="relative inline-block">
          <div className="text-6xl mb-4">{isCorrect ? '🧠' : '⚠️'}</div>
          <div className={`absolute -top-2 -right-2 text-white text-[10px] font-black p-1 rounded-full px-2 shadow-sm ${
            isCorrect && isLogicCorrect ? 'bg-green-500' : isCorrect ? 'bg-amber-500' : 'bg-red-500'
          }`}>
            {isCorrect && isLogicCorrect ? '100%' : isCorrect ? '80%' : '0%'}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className={`text-3xl font-black tracking-tighter uppercase ${
            isCorrect ? 'text-slate-900' : 'text-red-600'
          }`}>
            {isCorrect 
              ? (<>Rep <span className="text-blue-600">Complete</span></>)
              : "Rep Failed"}
          </h1>
          <p className="text-slate-400 font-medium text-sm">
            {hint || "Synaptic pathways successfully conditioned."}
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
            {isCorrect ? 'Logic Diagnosis' : 'Target Metric'}
          </span>
          <div className="text-2xl font-black text-slate-900">
            {isCorrect ? (isLogicCorrect ? 'PERFECT LOGIC' : 'BAD FORM') : `ANSWER: ${correctAnswer}`}
          </div>
        </div>

        {!isCorrect && solution && (
          <div className="text-left space-y-3 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Proper Solution</h4>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {solution}
            </p>
          </div>
        )}

        <Link href="/">
          <button className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
            isCorrect ? 'bg-slate-900 hover:bg-blue-600 text-white' : 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50'
          }`}>
            {isCorrect ? 'Back to Training Ground' : 'Try Another Rep'}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function SummaryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-black text-slate-200">LOADING METRICS...</div>
    }>
      <SummaryContent />
    </Suspense>
  );
}