'use client';

import React from 'react';

export default function NumberLine({ data }) {
  if (!data) return null;

  const min = Number(data.min ?? data.startValue ?? 0);
  const max = Number(data.max ?? data.endValue ?? 100);
  const range = max - min;
  if (range <= 0) return null;

  const tickCount = Number(data.numIntervals ?? 10);
  const step = range / tickCount;

  // Determine target / marked value
  let markedValue = null;
  if (data.targetPoint !== undefined && data.targetPoint !== null) {
    if (typeof data.targetPoint === 'number' && data.targetPoint <= tickCount) {
      markedValue = min + data.targetPoint * step;
    } else {
      markedValue = Number(data.targetPoint);
    }
  } else if (data.markedValue !== undefined && data.markedValue !== null) {
    markedValue = Number(data.markedValue);
  }

  const markedLabel = data.markedLabel ?? (data.targetPoint !== undefined ? "?" : (markedValue !== null ? markedValue.toLocaleString() : ''));
  const markedPct = markedValue !== null ? Math.min(100, Math.max(0, ((markedValue - min) / range) * 100)) : null;

  // Build ticks and labels
  const ticks = [];
  for (let i = 0; i <= tickCount; i++) {
    const val = min + i * step;
    const pct = (i / tickCount) * 100;
    
    let label = null;
    if (data.labeledPoints && Array.isArray(data.labeledPoints)) {
      const match = data.labeledPoints.find(lp => {
        if (typeof lp === 'number') return lp === i || lp === val;
        if (typeof lp === 'object' && lp !== null) {
          return lp.index === i || lp.value === val;
        }
        return false;
      });
      if (match !== undefined) {
        label = typeof match === 'object' && match?.label ? match.label : val.toLocaleString();
      }
    } else {
      if (i === 0) label = data.minLabel ?? min.toLocaleString();
      else if (i === tickCount) label = data.maxLabel ?? max.toLocaleString();
      else if (tickCount % 2 === 0 && i === tickCount / 2 && data.midLabel) label = data.midLabel;
    }

    ticks.push({ index: i, pct, value: val, label });
  }

  return (
    <div className="my-8 w-full max-w-2xl mx-auto p-6 sm:p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-200 select-none shadow-sm">
      <div className="relative pt-16 pb-8 px-6 sm:px-10">
        {/* The Number Line Track */}
        <div className="relative w-full h-3 bg-slate-300 rounded-full flex items-center">
          {/* Active Highlight Fill to marked point */}
          {markedPct !== null && (
            <div
              className="absolute left-0 h-full bg-blue-200 rounded-full pointer-events-none"
              style={{ width: `${markedPct}%` }}
            />
          )}

          {/* Floating Marker for Target Value (positioned relative to the track) */}
          {markedPct !== null && (
            <div
              className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none z-30 transition-all duration-300"
              style={{ left: `${markedPct}%`, bottom: 'calc(50% - 7px)' }}
            >
              <div className="px-3 py-1 bg-amber-400 text-slate-900 border-2 border-slate-900 font-black text-sm sm:text-base rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] whitespace-nowrap animate-bounce pointer-events-auto">
                {markedLabel}
              </div>
              {/* Arrow pointing down */}
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-900 -mt-[1px]" />
              {/* Pin dot centered directly on the line */}
              <div className="w-3.5 h-3.5 bg-amber-400 border-2 border-slate-900 rounded-full mt-0.5" />
            </div>
          )}

          {/* Subdivision Ticks */}
          {ticks.map((t) => {
            const isEndpoint = t.index === 0 || t.index === tickCount;
            const isMid = tickCount % 2 === 0 && t.index === tickCount / 2;
            const height = isEndpoint ? 'h-6 sm:h-7' : isMid ? 'h-5 sm:h-6' : 'h-3';
            const width = isEndpoint ? 'w-1 sm:w-1.5' : isMid ? 'w-1' : 'w-0.5';
            const bg = isEndpoint ? 'bg-slate-900' : isMid ? 'bg-blue-600' : 'bg-slate-400';

            return (
              <div
                key={t.index}
                className={`absolute ${width} ${height} ${bg} rounded-full -translate-x-1/2`}
                style={{ left: `${t.pct}%` }}
              />
            );
          })}
        </div>

        {/* Labels below the line */}
        <div className="relative w-full mt-4 h-6">
          {ticks.filter(t => t.label).map((t) => {
            const isEndpoint = t.index === 0 || t.index === tickCount;
            const isMid = tickCount % 2 === 0 && t.index === tickCount / 2;

            return (
              <div
                key={t.index}
                className="absolute -translate-x-1/2 text-center"
                style={{ left: `${t.pct}%` }}
              >
                <span className={`${
                  isEndpoint 
                    ? 'text-xs sm:text-sm font-black text-slate-800' 
                    : isMid 
                    ? 'text-[11px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200' 
                    : 'text-[11px] sm:text-xs font-bold text-slate-700 bg-white/80 px-1.5 py-0.5 rounded shadow-sm'
                } whitespace-nowrap`}>
                  {t.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
