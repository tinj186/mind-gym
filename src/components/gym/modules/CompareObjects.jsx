'use client';

import React from 'react';

export default function CompareObjects({ data }) {
  if (!data || !data.sets) return null;

  return (
    <div className="my-8 flex flex-wrap items-center justify-center gap-8 select-none">
      {data.sets.map((set, i) => {
        // Support both raw icons and structured objects for consistency with OrdinalLine
        const icon = typeof set.icon === 'object' ? set.icon.icon : set.icon;
        const label = set.label || (typeof set.icon === 'object' ? set.icon.label : null);

        return (
          <div key={i} className="flex flex-col items-center gap-4">
            <div className="w-48 min-h-[160px] p-6 bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-wrap gap-2 justify-center items-center content-center transition-transform hover:scale-105">
              {Array.from({ length: Math.max(0, Math.min(50, parseInt(set.count) || 0)) }).map((_, j) => (
                <span key={j} className="text-3xl grayscale-0 drop-shadow-sm">
                  {icon}
                </span>
              ))}
            </div>
            <div className="px-6 py-2 bg-slate-900 rounded-2xl shadow-lg border-2 border-slate-800">
              <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                {label ? `Group ${label}` : `Group ${i + 1}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}