'use client';

import React from 'react';

export default function OrdinalLine({ data }) {
  if (!data || !data.items || !Array.isArray(data.items)) return null;

  const { items } = data;

  return (
    <div className="my-8 p-6 bg-white rounded-[2rem] border-2 border-slate-100 flex flex-col items-center justify-center select-none overflow-x-auto">
      <div className="flex flex-row flex-nowrap items-center justify-center gap-6 whitespace-nowrap min-w-max px-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Left</span>
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center px-2">
            <span className="text-6xl transition-transform hover:scale-110">
              {item}
            </span>
          </div>
        ))}
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Right</span>
      </div>
      <p className="mt-4 text-sm text-slate-500 italic">Count from left or right to find the position.</p>
    </div>
  );
}