'use client';

import React from 'react';

const CurlyBracket = () => (
  <svg width="100%" height="100%" viewBox="0 0 30 100" preserveAspectRatio="none" className="text-slate-300">
    <path d="M 5 0 C 15 0, 15 5, 15 15 L 15 40 C 15 45, 20 50, 25 50 C 20 50, 15 55, 15 60 L 15 85 C 15 95, 15 100, 5 100" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
  </svg>
);

function UnitSegments({ value }) {
  if (typeof value === 'string' && value.startsWith('?:')) {
    const label = value.split(':')[1] || '?';
    return (
      <div className="absolute inset-0 flex items-center justify-between text-white/90 text-lg font-black pointer-events-none">
        <div className="flex h-full w-[50%]">
          <div className="w-[50%] border-r-2 border-white/30 flex items-center justify-center">{label}</div>
          <div className="w-[50%] border-r-2 border-white/30 flex items-center justify-center">{label}</div>
        </div>
        <div className="text-white/60 tracking-widest text-2xl -mt-2">...</div>
        <div className="flex h-full w-[25%]">
          <div className="w-full border-l-2 border-white/30 flex items-center justify-center">{label}</div>
        </div>
      </div>
    );
  }

  const num = parseInt(value);
  if (isNaN(num) || num <= 0 || num > 20) return null;

  return (
    <div className="absolute inset-0 flex pointer-events-none">
      {[...Array(num)].map((_, i) => (
        <div key={i} className="flex-1 border-r-[3px] border-white/50 last:border-r-0" />
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
    const unknownCount = model.parts.filter(p => isNaN(parseFloat(p))).length;
    
    let remainingForUnknown = 0;
    let calculatedWhole = parseFloat(model.whole);
    
    if (hasUnknownWhole) {
       const knownCount = model.parts.length - unknownCount;
       const avgKnown = knownCount > 0 ? (knownSum / knownCount) : 1;
       remainingForUnknown = unknownCount > 0 ? (unknownCount * avgKnown) : 0;
       calculatedWhole = knownSum + remainingForUnknown || model.parts.length;
    } else {
       remainingForUnknown = Math.max(0, calculatedWhole - knownSum);
    }
    
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

  if (model.modelType === 'COMPARISON') {
    const hasSegments = model.bar1?.segments || model.bar2?.segments;
    
    const getLayoutValue = (bar) => {
        if (!bar) return 0;
        if (bar.layoutSize) return parseFloat(bar.layoutSize);
        if (hasSegments) {
            return parseFloat(bar.segments) || 1;
        } else {
            const val = parseFloat(bar.value);
            return isNaN(val) ? 1 : val;
        }
    };

    const v1 = getLayoutValue(model.bar1);
    const v2 = getLayoutValue(model.bar2);
    const maxVal = Math.max(v1, v2, 1);

    content = (
      <div className="relative my-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative pr-48">
          <div className="space-y-4">
            {[model.bar1, model.bar2].map((bar, idx) => {
          if (!bar) return null;
          const inputKey = `bar_${idx}`;
          const userVal = toolState[inputKey];
          
          return (
            <div key={idx} className="flex flex-col">
              <div className="flex items-center gap-4">
                <span className="w-16 text-xs font-black text-slate-400 uppercase truncate text-right">
                  {bar.name}
                </span>
                <div className="flex-1 h-10 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-inner flex relative z-10">
                  <div
                    style={{ width: `${(getLayoutValue(bar) / maxVal) * 100}%` }}
                    className={`relative h-full flex items-center justify-end px-4 text-sm font-black text-white ${
                      idx === 0 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                  >
                    <UnitSegments value={bar.segments || bar.value} />
                    {(!bar.segments || parseInt(bar.segments) <= 1) && (
                      userVal ? <span className="text-yellow-200 px-2 drop-shadow-md text-lg">{userVal}</span> : (bar.value === "?" ? "?" : <span className="text-white drop-shadow-sm">{bar.value}</span>)
                    )}
                  </div>
                  
                  {/* Difference Box (if this is the shorter bar) */}
                  {getLayoutValue(bar) < maxVal && (
                    <div 
                      style={{ width: `${100 - ((getLayoutValue(bar) / maxVal) * 100)}%` }}
                      className="h-full flex items-center justify-center bg-slate-50/50 border-l-2 border-dashed border-slate-300"
                    >
                      <span className="text-sm font-black text-slate-500">
                        {toolState['diff'] ? <span className="text-indigo-600">{toolState['diff']}</span> : '?'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bracket Below */}
              {bar.segments && parseInt(bar.segments) > 1 && (
                <div className="flex items-center gap-4 mt-1 relative z-0">
                  <span className="w-16"></span>
                  <div className="flex-1 flex">
                    <div style={{ width: `${(getLayoutValue(bar) / maxVal) * 100}%` }} className="flex flex-col items-center">
                      <div className="w-[calc(100%-8px)] h-4 border-x-2 border-b-2 border-slate-400 opacity-60 rounded-b-md"></div>
                      <span className="text-sm font-black text-slate-600 bg-slate-50 px-2 -mt-3 z-10">{userVal || bar.value}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
            })}
          </div>
          
          {/* Total Bracket for Comparison */}
          {model.whole !== undefined && (
            <div className="absolute top-0 right-0 h-full flex flex-col pointer-events-none pr-6">
              <div className="flex items-center h-[6rem]">
                <div className="w-12 h-full py-0.5">
                  <CurlyBracket />
                </div>
                <div className="ml-1 flex flex-col items-start pointer-events-auto">
                  <span className="text-sm font-black text-slate-500 uppercase mt-2 tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                    Total: {toolState['whole'] ? <span className="text-indigo-600">{toolState['whole']}</span> : (model.whole === "?" ? "?" : <span className="text-indigo-600">{model.whole}</span>)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
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