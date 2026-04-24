'use client';

import React from 'react';

export default function BaseTenBlocks({ data }) {
  if (!data) return null;
  // Handle potential stringified JSON from AI
  const modelData = typeof data === 'string' ? JSON.parse(data) : data;
  const tens = parseInt(modelData.tens) || 0;
  const ones = parseInt(modelData.ones) || 0;

  return (
    <div className="my-8 p-8 bg-white rounded-[2rem] border-2 border-slate-100 flex flex-row items-center justify-center gap-12 select-none">
      {/* Tens Group (Left side) */}
      <div className="flex flex-row gap-2">
        {Array.from({ length: tens }).map((_, i) => (
          <div 
            key={`ten-${i}`} 
            className="w-6 h-32 bg-blue-500 rounded-sm shadow-sm border border-blue-600 flex flex-col overflow-hidden"
          >
            {/* 10 internal segments to represent individual cubes in the stick */}
            {[...Array(10)].map((_, j) => (
              <div key={j} className="flex-1 border-b border-blue-600/30 last:border-b-0" />
            ))}
          </div>
        ))}
        {tens === 0 && (
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] self-center">No Tens</div>
        )}
      </div>

      {/* Subtle Divider */}
      <div className="h-24 w-px bg-slate-200" />

      {/* Ones Group (Right side) */}
      <div className="flex flex-wrap gap-2 max-w-[120px] justify-start content-center">
        {Array.from({ length: ones }).map((_, i) => (
          <div key={`one-${i}`} className="w-6 h-6 bg-blue-400 rounded-sm shadow-sm border border-blue-500" />
        ))}
        {ones === 0 && (
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] self-center">No Ones</div>
        )}
      </div>
    </div>
  );
}