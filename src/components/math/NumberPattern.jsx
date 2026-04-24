'use client';

import React from 'react';

export default function NumberPattern({ data, isQuestion }) {
  if (!data || !data.sequence) return null;

  const { sequence, rule } = data;

  return (
    <div className="my-8 flex flex-wrap items-center justify-center gap-2 p-6 bg-white rounded-[2rem] border-2 border-slate-50 select-none">
      {sequence.map((item, i) => (
        <React.Fragment key={i}>
          {/* Number Node */}
          <div className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2 font-black text-lg transition-all shadow-sm ${
            item === '?' 
              ? 'bg-blue-50 border-blue-200 text-blue-600 animate-pulse' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {item}
          </div>

          {/* Rule Jump (Don't show after the last number) */}
          {i < sequence.length - 1 && (
            <div className="flex flex-col items-center px-1">
              {!isQuestion && (
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter bg-blue-50 px-1.5 py-0.5 rounded-md mb-1">{rule}</span>
              )}
              <div className="w-8 h-px bg-slate-200 relative">
                <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-4 border-transparent border-l-slate-200" />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}