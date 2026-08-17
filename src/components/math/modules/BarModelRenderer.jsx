'use client';

import React from 'react';

const CurlyBracket = () => (
  <svg width="100%" height="100%" viewBox="0 0 30 100" preserveAspectRatio="none" className="text-slate-300">
    <path d="M 5 0 C 15 0, 15 5, 15 15 L 15 40 C 15 45, 20 50, 25 50 C 20 50, 15 55, 15 60 L 15 85 C 15 95, 15 100, 5 100" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
  </svg>
);

function UnitSegments({ value, segments }) {
  if (typeof value === 'string' && value.startsWith('?:')) {
    const label = value.split(':')[1] || '?';
    return (
      <div className="absolute inset-0 flex items-center justify-between text-white/90 text-xl font-black pointer-events-none">
        <div className="flex h-full">
          <div className="w-16 border-r-2 border-white/50 flex items-center justify-center">{label}</div>
          <div className="w-16 border-r-2 border-white/50 flex items-center justify-center">{label}</div>
        </div>
        <div className="text-white tracking-widest text-3xl -mt-2">...</div>
        <div className="flex h-full">
          <div className="w-16 border-l-2 border-white/50 flex items-center justify-center">{label}</div>
        </div>
      </div>
    );
  }

  const num = segments !== undefined ? parseInt(segments) : parseInt(value);
  if (isNaN(num) || num <= 0 || num > 20) return null;

  return (
    <div className="absolute inset-0 flex pointer-events-none z-20">
      {[...Array(num)].map((_, i) => (
        <div key={i} className="flex-1 border-r-4 border-white/60 last:border-r-0 shadow-[1px_0_0_rgba(0,0,0,0.1)]" />
      ))}
    </div>
  );
}

export default function BarModelRenderer({ data, setIsToolOpen, toolState = {} }) {
  if (!data) return null;
  const model = typeof data === 'string' ? JSON.parse(data) : data;

  const modelsToRender = Array.isArray(model) ? model : (model.models ? model.models : [model]);

  let content = (
    <div className="space-y-6">
      {modelsToRender.map((m, index) => {
        if (m.modelType === 'PART_WHOLE' || m.type === 'PART_WHOLE') {
    const knownSum = m.parts.reduce((sum, p) => sum + (parseFloat(p.layoutSize || p.value || p) || 0), 0);
    const hasUnknownWhole = isNaN(parseFloat(m.whole));
    const unknownCount = m.parts.filter(p => isNaN(parseFloat(p.layoutSize || p.value || p))).length;
    
    let remainingForUnknown = 0;
    let calculatedWhole = parseFloat(m.whole);
    
    if (hasUnknownWhole) {
       const knownCount = m.parts.length - unknownCount;
       const avgKnown = knownCount > 0 ? (knownSum / knownCount) : 1;
       remainingForUnknown = unknownCount > 0 ? (unknownCount * avgKnown) : 0;
       calculatedWhole = knownSum + remainingForUnknown || m.parts.length;
    } else {
       remainingForUnknown = Math.max(0, calculatedWhole - knownSum);
    }
    
    const fallbackPartVal = unknownCount > 0 ? (remainingForUnknown / unknownCount) : 0;

        return (
          <div key={index} className="my-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
        <div className="flex items-center gap-4">
          {(toolState['bar_label'] || m.barLabel) && (
            <span className="w-32 text-right text-xs font-black text-slate-400 uppercase leading-tight">
              {toolState['bar_label'] || m.barLabel}
            </span>
          )}
          <div className="flex-1 relative mt-8">
            {/* Top Brackets */}
            <div className="absolute -top-6 left-0 w-full h-4 flex">
              {m.topBrackets ? (
                m.topBrackets.map((tb, idx) => {
                  const width = (tb.size / calculatedWhole) * 100;
                  if (tb.label) {
                    return (
                      <div key={`tb-${idx}`} style={{ width: `${width}%` }} className="relative flex flex-col items-center justify-end h-full">
                        <span className="text-sm font-black text-slate-600 bg-slate-50 px-2 absolute -top-4 z-10">{tb.label}</span>
                        <div className="w-[calc(100%-8px)] h-2 border-x-2 border-t-2 border-slate-400 opacity-60 rounded-t-md"></div>
                      </div>
                    );
                  }
                  return <div key={`tb-${idx}`} style={{ width: `${width}%` }} />;
                })
              ) : (
                m.parts.map((part, idx) => {
                  const partValue = (typeof part === 'object' && part !== null) ? (part.value !== undefined ? part.value : "") : part;
                  const partLayoutVal = parseFloat(part.layoutSize || partValue) || fallbackPartVal;
                  const width = (partLayoutVal / calculatedWhole) * 100;
                  
                  if (part.segments && parseInt(part.segments) > 1 && partValue && partValue !== "?") {
                    return (
                      <div key={`bracket-${idx}`} style={{ width: `${width}%` }} className="relative flex flex-col items-center justify-end h-full">
                        <span className="text-sm font-black text-slate-600 bg-slate-50 px-2 absolute -top-4">{partValue}</span>
                        <div className="w-[calc(100%-8px)] h-2 border-x-2 border-t-2 border-slate-400 opacity-60 rounded-t-md"></div>
                      </div>
                    );
                  }
                  return <div key={`bracket-${idx}`} style={{ width: `${width}%` }} />;
                })
              )}
            </div>
            
            <div className="flex h-12 w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              {m.parts.map((part, idx) => {
                const partValue = (typeof part === 'object' && part !== null) ? (part.value !== undefined ? part.value : "") : part;
                const partLayoutVal = parseFloat(part.layoutSize || partValue) || fallbackPartVal;
                const width = (partLayoutVal / calculatedWhole) * 100;
                const inputKey = `part_${idx}`;
                const userVal = toolState[inputKey];
                const showTopBracket = part.segments && parseInt(part.segments) > 1 && partValue && partValue !== "?";
                
                return (
                  <div
                    key={idx}
                    style={{ width: `${width}%` }}
                    className={`relative flex items-center justify-center border-r last:border-r-0 border-slate-200 text-sm font-black ${
                      part.bgClass || (idx % 2 === 0 ? 'bg-blue-500 text-white' : 'bg-blue-400 text-white')
                    }`}
                  >
                    <UnitSegments value={typeof partValue === 'string' && partValue.startsWith('?:') ? `?:${userVal || partValue.split(':')[1] || '?'}` : partValue} segments={part.segments} />
                    {!(typeof partValue === 'string' && partValue.startsWith('?:')) && !showTopBracket && (
                      userVal ? <span className="text-yellow-200 px-2 drop-shadow-md text-lg">{userVal}</span> : (partValue === "?" ? "?" : <span className="text-white drop-shadow-sm">{partValue}</span>)
                    )}
                  </div>
                );
              })}
            </div>
            {!m.hideTotal && (
              <div className="mt-2 flex flex-col items-center">
                <div className="w-full h-3 border-x-2 border-b-2 border-slate-300 rounded-b-xl"></div>
                <span className="text-sm font-black text-slate-500 uppercase mt-2 tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  Total: {toolState['whole'] ? <span className="text-indigo-600">{toolState['whole']}</span> : (m.whole === "?" ? "?" : <span className="text-indigo-600">{m.whole}</span>)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

      if (m.modelType === 'COMPARISON' || m.type === 'COMPARISON') {
        const hasSegments = m.bar1?.segments || m.bar2?.segments;
    
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

        const v1 = getLayoutValue(m.bar1);
        const v2 = getLayoutValue(m.bar2);
    const maxVal = Math.max(v1, v2, 1);

        return (
          <div key={index} className="relative my-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex w-full items-start">
          <div className="flex-1 space-y-4 min-w-[200px]">
              {[m.bar1, m.bar2].map((bar, idx) => {
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
                <div className="flex items-center gap-4 mt-1 mb-6 relative z-0">
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
          {m.whole !== undefined && (
            <div className="w-[180px] flex-shrink-0 flex items-center ml-4 h-[9.5rem]">
              <div className="w-10 h-full py-1 pointer-events-none">
                <CurlyBracket />
              </div>
              <div className="ml-1 flex flex-col items-start pointer-events-auto">
                <span className="text-sm font-black text-slate-500 uppercase mt-2 tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  Total: {toolState['whole'] ? <span className="text-indigo-600">{toolState['whole']}</span> : (m.whole === "?" ? "?" : <span className="text-indigo-600">{m.whole}</span>)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
})}
</div>
);

  if (!content) return null;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full max-w-4xl mx-auto">
        {content}
      </div>
      {setIsToolOpen && !modelsToRender.some(m => m.isStatic) && (
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