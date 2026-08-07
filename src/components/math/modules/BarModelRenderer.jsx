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

export default function BarModelRenderer({ data, setIsToolOpen, toolState = {} }) {
  if (!data) return null;
  const model = typeof data === 'string' ? JSON.parse(data) : data;

  let content = null;
  
  if (model.modelType === 'PART_WHOLE' || model.type === 'PART_WHOLE') {
    const knownSum = model.parts.reduce((sum, p) => sum + (parseFloat(p) || 0), 0);
    const hasUnknownWhole = isNaN(parseFloat(model.whole));
    const calculatedWhole = hasUnknownWhole ? (knownSum || model.parts.length) : parseFloat(model.whole);
    const unknownCount = model.parts.filter(p => isNaN(parseFloat(p))).length;
    const remainingForUnknown = Math.max(0, calculatedWhole - knownSum);
    const fallbackPartVal = unknownCount > 0 ? (remainingForUnknown / unknownCount) : 0;

    content = (
      <div className="my-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
        <div className="flex items-center gap-4">
          {(toolState['bar_label'] || model.barLabel) && (
            <span className="w-32 text-right text-xs font-black text-slate-400 uppercase leading-tight">
              {toolState['bar_label'] || model.barLabel}
            </span>
          )}
          <div className="flex-1 relative">
            <div className="flex h-12 w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              {model.parts.map((part, idx) => {
                const partVal = parseFloat(part) || fallbackPartVal;
                const width = (partVal / calculatedWhole) * 100;
                const inputKey = `part_${idx}`;
                const userVal = toolState[inputKey];
                
                return (
                  <div
                    key={idx}
                    style={{ width: `${width}%` }}
                    className={`relative flex items-center justify-center border-r last:border-r-0 border-slate-200 text-sm font-black ${
                      idx % 2 === 0 ? 'bg-blue-500 text-white' : 'bg-blue-400 text-white'
                    }`}
                  >
                    <UnitSegments value={part} />
                    {userVal ? <span className="text-yellow-200 px-2 drop-shadow-md text-lg">{userVal}</span> : (part === "?" ? "?" : <span className="text-white drop-shadow-sm">{part}</span>)}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex flex-col items-center">
              <div className="w-full h-3 border-x-2 border-b-2 border-slate-300 rounded-b-xl"></div>
              <span className="text-sm font-black text-slate-500 uppercase mt-2 tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                Total: {toolState['whole'] ? <span className="text-indigo-600">{toolState['whole']}</span> : (model.whole === "?" ? "?" : <span className="text-indigo-600">{model.whole}</span>)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (model.modelType === 'COMPARISON' || model.type === 'COMPARISON') {
    const v1 = parseFloat(model.bar1?.value) || 0;
    const v2 = parseFloat(model.bar2?.value) || 0;
    const maxVal = Math.max(v1, v2, 1);

    content = (
      <div className="my-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
        {[model.bar1, model.bar2].map((bar, idx) => {
          if (!bar) return null;
          const inputKey = `bar_${idx}`;
          const userVal = toolState[inputKey];
          
          return (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-16 text-xs font-black text-slate-400 uppercase truncate text-right">
                {bar.name}
              </span>
              <div className="flex-1 h-10 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-inner flex">
                <div
                  style={{ width: `${(parseFloat(bar.value) / maxVal) * 100}%` }}
                  className={`relative h-full flex items-center justify-end px-4 text-sm font-black text-white ${
                    idx === 0 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                >
                  <UnitSegments value={bar.value} />
                  {userVal ? <span className="text-yellow-200 px-2 drop-shadow-md text-lg">{userVal}</span> : (bar.value === "?" ? "?" : <span className="text-white drop-shadow-sm">{bar.value}</span>)}
                </div>
                
                {/* Difference Box (if this is the shorter bar) */}
                {parseFloat(bar.value) < maxVal && (
                  <div 
                    style={{ width: `${100 - ((parseFloat(bar.value) / maxVal) * 100)}%` }}
                    className="h-full flex items-center justify-center bg-slate-50/50 border-l-2 border-dashed border-slate-300"
                  >
                    <span className="text-sm font-black text-slate-500">
                      {toolState['diff'] ? <span className="text-indigo-600">{toolState['diff']}</span> : '?'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-xl mx-auto">
        {content}
      </div>
      {setIsToolOpen && !model.isStatic && (
        <button 
          onClick={() => setIsToolOpen(true)}
          className="px-8 py-3 bg-indigo-600 text-white text-sm font-black uppercase rounded-full shadow-[0_4px_0_0_rgba(67,56,202,1)] hover:translate-y-1 hover:shadow-[0_2px_0_0_rgba(67,56,202,1)] active:translate-y-2 active:shadow-none transition-all"
        >
          ✨ Open Bar Model Tool
        </button>
      )}
    </div>
  );
}