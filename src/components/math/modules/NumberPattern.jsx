'use client';

import React from 'react';

export default function NumberPattern({ data, attempts }) {
  // Hyper-resilient schema check: support both 'sequence' and 'items' keys
  const sequence = data?.sequence || data?.items || [];
  const rule = data?.rule || '';
  const hideVisual = data?.hideVisual === true;
  const isQuestion = attempts === 0;

  if (hideVisual || sequence.length === 0) return null;

  return (
    <div className="my-8 flex flex-wrap items-center justify-center gap-4 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-200 select-none">
      {sequence.map((num, idx) => (
        <React.Fragment key={idx}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all ${num === '?' || num === '' ? 'bg-slate-200 animate-pulse' : 'bg-white'}`}>
            <span className="text-2xl font-black text-slate-900">
              {num === '?' ? '' : num}
            </span>
          </div>
          {idx < sequence.length - 1 && (
            <div className="flex flex-col items-center gap-1">
              {!isQuestion && rule && (
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg animate-in zoom-in-50">
                  {rule}
                </span>
              )}
              <div className="text-slate-300 font-black text-3xl leading-none px-1">➔</div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}