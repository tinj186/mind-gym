'use client';

import React from 'react';

export default function PlaceValueChart({ data }) {
  if (!data) return null;

  // Handle potential stringified JSON from AI
  const model = typeof data === 'string' ? JSON.parse(data) : data;
  const hasHundreds = model.hundreds !== undefined && model.hundreds !== null;
  const colsClass = hasHundreds ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div className="my-6 max-w-sm mx-auto overflow-hidden rounded-xl border-2 border-slate-900 bg-white shadow-sm">
      {/* Headers */}
      <div className={`grid ${colsClass} divide-x-2 divide-slate-900 border-b-2 border-slate-900 bg-slate-100`}>
        {hasHundreds && <div className="py-2 text-center text-[10px] font-black uppercase text-slate-900 tracking-widest">Hundreds</div>}
        <div className="py-2 text-center text-[10px] font-black uppercase text-slate-900 tracking-widest">Tens</div>
        <div className="py-2 text-center text-[10px] font-black uppercase text-slate-900 tracking-widest">Ones</div>
      </div>
      {/* Digits */}
      <div className={`grid ${colsClass} divide-x-2 divide-slate-900`}>
        {hasHundreds && <div className="py-8 text-center text-5xl font-black text-slate-900 leading-none">{model.hundreds}</div>}
        <div className="py-8 text-center text-5xl font-black text-slate-900 leading-none">{model.tens}</div>
        <div className="py-8 text-center text-5xl font-black text-slate-900 leading-none">{model.ones}</div>
      </div>
    </div>
  );
}