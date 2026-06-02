'use client';

import React from 'react';

function UnitSegments({ value }) {
  const num = parseInt(value);
  if (isNaN(num) || num <= 0 || num > 20) return null;

  return (
    <div className="absolute inset-0 flex">
      {[...Array(num)].map((_, i) => (
        <div key={i} className="flex-1 border-r border-white/20 last:border-r-0" />
      ))}
    </div>
  );
}

export default function BarModelRenderer({ data }) {
  if (!data) return null;
  const model = typeof data === 'string' ? JSON.parse(data) : data;

  if (model.type === 'PART_WHOLE') {
    const wholeVal = parseFloat(model.whole) || 1;
    return (
      <div className="my-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
        <div className="relative">
          <div className="flex h-10 w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            {model.parts.map((part, idx) => {
              const partVal = parseFloat(part) || (wholeVal / model.parts.length);
              const width = (partVal / wholeVal) * 100;
              return (
                <div
                  key={idx}
                  style={{ width: `${width}%` }}
                  className={`relative flex items-center justify-center border-r last:border-r-0 border-slate-200 text-[10px] font-black ${
                    idx % 2 === 0 ? 'bg-blue-500 text-white' : 'bg-blue-400 text-white'
                  }`}
                >
                  <UnitSegments value={part} />
                  {part}
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex flex-col items-center">
            <div className="w-full h-2 border-x border-b border-slate-300 rounded-b-lg"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">
              Total: {model.whole}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (model.type === 'COMPARISON') {
    const v1 = parseFloat(model.bar1?.value) || 0;
    const v2 = parseFloat(model.bar2?.value) || 0;
    const maxVal = Math.max(v1, v2, 1);

    return (
      <div className="my-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
        {[model.bar1, model.bar2].map((bar, idx) => bar && (
          <div key={idx} className="flex items-center gap-4">
            <span className="w-16 text-[10px] font-black text-slate-400 uppercase truncate">
              {bar.name}
            </span>
            <div className="flex-1 h-8 bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div
                style={{ width: `${(parseFloat(bar.value) / maxVal) * 100}%` }}
                className={`relative h-full flex items-center justify-end px-3 text-[10px] font-black text-white ${
                  idx === 0 ? 'bg-blue-500' : 'bg-amber-500'
                }`}
              >
                <UnitSegments value={bar.value} />
                {bar.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}