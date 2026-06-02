'use client';

import React from 'react';

export default function PlaceValueChart({ data }) {
  if (!data) return null;

  // Handle potential stringified JSON from AI and normalize values
  const model = typeof data === 'string' ? JSON.parse(data) : data;
  const hundreds = model.hundreds !== undefined ? model.hundreds : null;
  const tens = model.tens !== undefined ? model.tens : 0;
  const ones = model.ones !== undefined ? model.ones : 0;
  
  const hasHundreds = hundreds !== null;
  const colsClass = hasHundreds ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div className="my-8 max-w-sm mx-auto overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] select-none transition-transform hover:scale-[1.02]">
      {/* Pedagogical Headers */}
      <div className={`grid ${colsClass} divide-x-4 divide-slate-900 border-b-4 border-slate-900 bg-slate-50`}>
        {hasHundreds && (
          <div className="py-3 text-center text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Hundreds</div>
        )}
        <div className="py-3 text-center text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Tens</div>
        <div className="py-3 text-center text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Ones</div>
      </div>

      {/* Digit Display */}
      <div className={`grid ${colsClass} divide-x-4 divide-slate-900`}>
        {hasHundreds && (
          <div className="py-10 text-center text-6xl font-black text-slate-900 leading-none tabular-nums">{hundreds}</div>
        )}
        <div className="py-10 text-center text-6xl font-black text-slate-900 leading-none tabular-nums">{tens}</div>
        <div className="py-10 text-center text-6xl font-black text-slate-900 leading-none tabular-nums">{ones}</div>
      </div>
    </div>
  );
}