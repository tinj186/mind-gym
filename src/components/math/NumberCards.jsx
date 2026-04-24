'use client';

import React from 'react';

export default function NumberCards({ data }) {
  if (!data || !data.numbers) return null;
  const numbers = Array.isArray(data.numbers) ? data.numbers : [];

  return (
    <div className="my-8 flex flex-row flex-wrap items-center justify-center gap-6 select-none">
      {numbers.map((num, i) => (
        <div key={i} className="w-24 h-32 bg-white rounded-2xl shadow-md border-2 border-slate-100 flex items-center justify-center transition-transform hover:scale-105">
          <span className="text-4xl font-black text-slate-800 tracking-tighter">
            {num}
          </span>
        </div>
      ))}
    </div>
  );
}