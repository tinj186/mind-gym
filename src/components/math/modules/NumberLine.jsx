'use client';

import React from 'react';

export default function NumberLine({ data }) {
  if (!data) return null;

  const min = Number(data.min ?? 0);
  const max = Number(data.max ?? 100);
  const markedValue = data.markedValue !== undefined && data.markedValue !== null ? Number(data.markedValue) : null;
  const range = max - min;
  if (range <= 0) return null;

  const minLabel = data.minLabel ?? min.toLocaleString();
  const maxLabel = data.maxLabel ?? max.toLocaleString();
  const midValue = data.midValue !== undefined ? Number(data.midValue) : min + (range / 2);
  const midLabel = data.midLabel ?? midValue.toLocaleString();
  const markedLabel = data.markedLabel ?? (markedValue !== null ? markedValue.toLocaleString() : '');

  // Calculate percentage for marked value (clamped between 0 and 100)
  const markedPct = markedValue !== null ? Math.min(100, Math.max(0, ((markedValue - min) / range) * 100)) : null;
  const midPct = ((midValue - min) / range) * 100;

  // Generate 10 subdivision tick marks
  const tickCount = 10;
  const ticks = [];
  for (let i = 0; i <= tickCount; i++) {
    ticks.push((i / tickCount) * 100);
  }

  return (
    <div className="my-8 w-full max-w-2xl mx-auto p-6 sm:p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-200 select-none shadow-sm">
      <div className="relative pt-12 pb-8 px-6 sm:px-10">
        {/* Floating Marker for Target Value */}
        {markedPct !== null && (
          <div
            className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all duration-300 z-30"
            style={{ left: `${markedPct}%` }}
          >
            <div className="px-3 py-1 bg-amber-400 text-slate-900 border-2 border-slate-900 font-black text-sm sm:text-base rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] whitespace-nowrap animate-bounce">
              {markedLabel}
            </div>
            {/* Arrow pointing down */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-900 -mt-[1px]" />
            {/* Pin dot on the line */}
            <div className="w-3.5 h-3.5 bg-amber-400 border-2 border-slate-900 rounded-full mt-0.5" />
          </div>
        )}

        {/* The Number Line Track */}
        <div className="relative w-full h-3 bg-slate-300 rounded-full flex items-center">
          {/* Active Highlight Fill to marked point (optional aesthetic) */}
          {markedPct !== null && (
            <div
              className="absolute left-0 h-full bg-blue-200 rounded-full pointer-events-none"
              style={{ width: `${markedPct}%` }}
            />
          )}

          {/* Subdivision Ticks */}
          {ticks.map((pct, idx) => {
            const isEndpoint = idx === 0 || idx === tickCount;
            const isMid = Math.abs(pct - midPct) < 0.1;
            const height = isEndpoint ? 'h-6 sm:h-7' : isMid ? 'h-5 sm:h-6' : 'h-3';
            const width = isEndpoint ? 'w-1 sm:w-1.5' : isMid ? 'w-1' : 'w-0.5';
            const bg = isEndpoint ? 'bg-slate-900' : isMid ? 'bg-blue-600' : 'bg-slate-400';

            return (
              <div
                key={idx}
                className={`absolute ${width} ${height} ${bg} rounded-full -translate-x-1/2`}
                style={{ left: `${pct}%` }}
              />
            );
          })}
        </div>

        {/* Labels below the line */}
        <div className="relative w-full mt-4 h-6">
          {/* Min Label */}
          <div className="absolute left-0 -translate-x-1/2 text-center">
            <span className="text-xs sm:text-sm font-black text-slate-800 whitespace-nowrap">
              {minLabel}
            </span>
          </div>

          {/* Midpoint Label */}
          <div
            className="absolute -translate-x-1/2 text-center"
            style={{ left: `${midPct}%` }}
          >
            <span className="text-[11px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 whitespace-nowrap">
              {midLabel}
            </span>
          </div>

          {/* Max Label */}
          <div className="absolute right-0 translate-x-1/2 text-center">
            <span className="text-xs sm:text-sm font-black text-slate-800 whitespace-nowrap">
              {maxLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
