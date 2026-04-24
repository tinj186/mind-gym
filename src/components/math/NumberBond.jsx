'use client';

import React from 'react';

export default function NumberBond({ data }) {
  if (!data) return null;
  const { whole, part1, part2 } = data;

  const renderCircle = (val, label) => (
    <div className="flex flex-col items-center">
      <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-black transition-all shadow-sm ${
        val === '?' 
          ? 'bg-blue-50 border-blue-400 text-blue-600 animate-pulse' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {val}
      </div>
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">{label}</span>
    </div>
  );

  return (
    <div className="my-8 p-12 bg-white rounded-[2rem] border-2 border-slate-50 flex flex-col items-center justify-center select-none">
      <div className="relative w-64 h-64">
        {/* Whole (Top Center) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          {renderCircle(whole, "Whole")}
        </div>

        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <line x1="50%" y1="20%" x2="25%" y2="80%" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
          <line x1="50%" y1="20%" x2="75%" y2="80%" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        </svg>

        {/* Part 1 (Bottom Left) */}
        <div className="absolute bottom-0 left-0 z-10">
          {renderCircle(part1, "Part")}
        </div>

        {/* Part 2 (Bottom Right) */}
        <div className="absolute bottom-0 right-0 z-10">
          {renderCircle(part2, "Part")}
        </div>
      </div>
    </div>
  );
}