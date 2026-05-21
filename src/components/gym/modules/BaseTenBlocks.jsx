import React from 'react';

export default function BaseTenBlocks({ data }) {
  const hundreds = data?.hundreds || 0;
  const tens = data?.tens || 0;
  const ones = data?.ones || 0;

  return (
    <div className="flex flex-wrap justify-center gap-12 p-8 bg-sky-50 rounded-[2rem] border-2 border-sky-100">
      
      {/* HUNDREDS (Flats) */}
      {hundreds > 0 && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">Hundreds</span>
          <div className="flex gap-2 flex-wrap max-w-[250px]">
            {Array.from({ length: hundreds }).map((_, i) => (
              <div key={i} className="w-20 h-20 bg-blue-500 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] grid grid-cols-10 grid-rows-10">
                {Array.from({ length: 100 }).map((_, j) => (
                  <div key={j} className="border-[0.5px] border-blue-600/50" />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TENS (Rods) */}
      {tens > 0 && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Tens</span>
          <div className="flex gap-2">
            {Array.from({ length: tens }).map((_, i) => (
              <div key={i} className="w-4 h-32 bg-emerald-400 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
                {Array.from({ length: 10 }).map((_, j) => (
                  <div key={j} className="flex-1 border-b border-emerald-500/50 last:border-0" />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ONES (Units) */}
      {ones > 0 && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Ones</span>
          <div className="flex flex-wrap gap-2 max-w-[100px]">
            {Array.from({ length: ones }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]" />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}