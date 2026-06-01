import React from 'react';

export default function BaseTenBlocks({ data }) {
  if (!data) return null;
  const modelData = typeof data === 'string' ? JSON.parse(data) : data;
  const hundreds = parseInt(modelData.hundreds) || 0;
  const tens = parseInt(modelData.tens) || 0;
  const ones = parseInt(modelData.ones) || 0;

  return (
    <div className="my-8 w-full p-4 md:p-8 bg-white rounded-[2rem] border-2 border-slate-100 flex flex-col items-center justify-center select-none min-h-[160px]">
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 w-full">
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

      {hundreds > 0 && (tens > 0 || ones > 0) && <div className="hidden md:block h-24 w-px bg-slate-100 mx-2" />}

      {/* TENS (Rods) */}
      {(tens > 0 || (ones > 0 && hundreds === 0)) && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Tens</span>
          {tens > 0 ? (
            <div className="flex gap-2">
              {Array.from({ length: tens }).map((_, i) => (
                <div key={i} className="w-4 h-32 bg-emerald-400 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <div key={j} className="flex-1 border-b border-emerald-500/50 last:border-0" />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center italic text-[10px] text-slate-300 font-bold uppercase tracking-widest">No Tens</div>
          )}
        </div>
      )}

      {tens >= 0 && ones > 0 && <div className="hidden md:block h-24 w-px bg-slate-100 mx-2" />}

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

      <p className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
        Count the blocks to find the total value
      </p>
    </div>
  );
}