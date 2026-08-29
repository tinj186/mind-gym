'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CurlyBracket = () => (
  <svg width="100%" height="100%" viewBox="0 0 30 100" preserveAspectRatio="none" className="text-slate-300">
    <path d="M 5 0 C 15 0, 15 5, 15 15 L 15 40 C 15 45, 20 50, 25 50 C 20 50, 15 55, 15 60 L 15 85 C 15 95, 15 100, 5 100" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
  </svg>
);

function UnitSegments({ value, segments, children }) {
  if (typeof value === 'string' && value.startsWith('?:')) {
    const label = value.split(':')[1] || '?';
    return (
      <div className="absolute inset-0 flex items-center justify-between text-white/90 text-xl font-black pointer-events-none">
        <div className="flex h-full">
          <div className="w-24 border-r-2 border-white/50 flex items-center justify-center pointer-events-auto">
            {children || label}
          </div>
          <div className="w-24 border-r-2 border-white/50 flex items-center justify-center">{label}</div>
        </div>
        <div className="text-white tracking-widest text-3xl -mt-2">...</div>
        <div className="flex h-full">
          <div className="w-24 border-l-2 border-white/50 flex items-center justify-center">{label}</div>
        </div>
      </div>
    );
  }

  const num = segments !== undefined ? parseInt(segments) : parseInt(value);
  if (isNaN(num) || num <= 0 || num > 20) return (
    <>{children}</>
  );

  return (
    <>
      <div className="absolute inset-0 flex pointer-events-none z-20">
        {[...Array(num)].map((_, i) => (
          <div key={i} className="flex-1 border-r-4 border-white/60 last:border-r-0 shadow-[1px_0_0_rgba(0,0,0,0.1)]" />
        ))}
      </div>
      {children}
    </>
  );
}

export default function BarModelWorkspace({ modelData, onClose, initialState }) {
  // Use modelData.modelType OR modelData.type
  const type = modelData.modelType || modelData.type;
  
  // State for user inputs
  const [inputs, setInputs] = useState(initialState || {});

  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const renderPartWhole = () => {
    const knownSum = modelData.parts.reduce((sum, p) => sum + (parseFloat(p.layoutSize || p.value || p) || 0), 0);
    const hasUnknownWhole = isNaN(parseFloat(modelData.whole));
    const unknownCount = modelData.parts.filter(p => isNaN(parseFloat(p.layoutSize || p.value || p))).length;
    
    let remainingForUnknown = 0;
    let calculatedWhole = parseFloat(modelData.whole);
    
    if (hasUnknownWhole) {
       const knownCount = modelData.parts.length - unknownCount;
       const avgKnown = knownCount > 0 ? (knownSum / knownCount) : 1;
       remainingForUnknown = unknownCount > 0 ? (unknownCount * avgKnown) : 0;
       calculatedWhole = knownSum + remainingForUnknown || modelData.parts.length;
    } else {
       remainingForUnknown = Math.max(0, calculatedWhole - knownSum);
    }
    
    const fallbackPartVal = unknownCount > 0 ? (remainingForUnknown / unknownCount) : 0;

    return (
      <div className="my-12 p-8 bg-slate-50 rounded-[3rem] border-4 border-slate-100 space-y-8 shadow-inner">
        <h3 className="text-xl font-black text-slate-800 text-center mb-8 uppercase tracking-widest">Part-Whole Model</h3>
        
        <div className="relative max-w-3xl mx-auto flex items-center gap-6">
          {/* Bar Label Input */}
          <input
            type="text"
            value={inputs['bar_label'] ?? modelData.barLabel ?? ''}
            onChange={(e) => handleInputChange('bar_label', e.target.value)}
            placeholder="Label"
            className="w-40 text-right text-sm font-black uppercase text-slate-500 bg-transparent border-b-2 border-slate-200 focus:outline-none focus:border-blue-400 placeholder:text-slate-300 transition-colors"
          />
          
          <div className="flex-1 relative">
            {/* The Bar */}
            <div className="flex h-20 w-full rounded-2xl overflow-hidden border-4 border-slate-200 shadow-lg bg-white relative z-10">
              {modelData.parts.map((part, idx) => {
                const partValue = part.value !== undefined ? part.value : part;
                const partLayoutVal = parseFloat(part.layoutSize || partValue) || fallbackPartVal;
                const width = (partLayoutVal / calculatedWhole) * 100;
                const inputKey = `part_${idx}`;
                
                return (
                  <div
                    key={idx}
                    style={{ width: `${width}%` }}
                    className={`relative flex items-center justify-center border-r-4 last:border-r-0 border-slate-200 ${
                      part.bgClass || (idx % 2 === 0 ? 'bg-blue-500 text-white' : 'bg-blue-400 text-white')
                    }`}
                  >
                    <UnitSegments value={typeof partValue === 'string' && partValue.startsWith('?:') ? `?:${inputs[inputKey] || ''}` : partValue} segments={part.segments}>
                      <input
                        type="text"
                        value={inputs[inputKey] || ''}
                        onChange={(e) => handleInputChange(inputKey, e.target.value)}
                        placeholder={partValue === "?" ? "?" : ""}
                        className="w-full h-full text-center text-xl font-black bg-transparent border-none focus:outline-none focus:bg-black/10 text-inherit placeholder:text-inherit/50 caret-current cursor-text"
                      />
                    </UnitSegments>
                  </div>
                );
              })}
            </div>
            
            {/* The Whole Bracket */}
            <div className="mt-4 flex flex-col items-center">
              <div className="w-full h-6 border-x-4 border-b-4 border-slate-300 rounded-b-2xl"></div>
              <div className="bg-white px-4 py-2 rounded-full border-4 border-slate-200 shadow-sm -mt-6 z-20">
                {/* Interactive Input for Whole */}
                <input
                  type="text"
                  value={inputs['whole'] || ''}
                  onChange={(e) => handleInputChange('whole', e.target.value)}
                  placeholder={modelData.whole === "?" ? "?" : ""}
                  className="w-32 h-10 text-center text-lg font-black bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderComparison = () => {
    const hasSegments = modelData.bar1?.segments || modelData.bar2?.segments;
    
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

    const v1 = getLayoutValue(modelData.bar1);
    const v2 = getLayoutValue(modelData.bar2);
    const maxVal = Math.max(v1, v2, 1);

    return (
      <div className="relative my-12 p-8 bg-slate-50 rounded-[3rem] border-4 border-slate-100 space-y-8 shadow-inner">
        <h3 className="text-xl font-black text-slate-800 text-center mb-8 uppercase tracking-widest">Comparison Model</h3>
        
        <div className="relative my-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex w-full items-start">
            <div className="flex-1 space-y-4 min-w-[200px]">
              {[modelData.bar1, modelData.bar2].map((bar, idx) => {
                if (!bar) return null;
                const layoutVal = getLayoutValue(bar);
                const width = (layoutVal / maxVal) * 100;
                const inputKey = `bar_${idx}`;
                
                return (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-6">
                      <span className="w-24 text-sm font-black text-slate-400 uppercase text-right truncate">
                        {bar.name}
                      </span>
                      <div className="flex-1 h-16 bg-white rounded-2xl border-4 border-slate-200 overflow-hidden flex relative z-10">
                        <div
                          style={{ width: `${width}%` }}
                          className={`relative h-full flex items-center justify-center px-2 shadow-sm ${
                            idx === 0 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                        >
                          <UnitSegments value={bar.segments || bar.value} />
                          
                          {/* Interactive Input for Bar */}
                          {(!bar.segments || parseInt(bar.segments) <= 1) && (
                            <input
                              type="text"
                              value={inputs[inputKey] || ''}
                              onChange={(e) => handleInputChange(inputKey, e.target.value)}
                              placeholder=""
                              className="min-w-[40px] w-full max-w-[6rem] h-10 text-center text-lg font-black bg-white/90 border-2 border-slate-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-400 z-20 text-slate-900 shadow-sm placeholder:text-slate-300"
                            />
                          )}
                        </div>
                      
                        {/* Difference Box (if this is the shorter bar) */}
                        {width < 100 && (
                          <div 
                            style={{ width: `${100 - width}%` }}
                            className="h-full flex items-center justify-center bg-slate-50/50 border-l-4 border-dashed border-slate-300 px-2"
                          >
                            <input
                              type="text"
                              value={inputs['diff'] || ''}
                              onChange={(e) => handleInputChange('diff', e.target.value)}
                              placeholder=""
                              className="min-w-[40px] w-full max-w-[6rem] h-10 text-center text-sm font-black bg-white border-2 border-slate-300 text-slate-600 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm placeholder:text-slate-300"
                            />
                          </div>
                        )}
                      </div>
                  </div>
                  
                  {/* Bracket Input for multi-segment bars */}
                  {bar.segments && parseInt(bar.segments) > 1 && (
                    <div className="flex items-center gap-6 mt-1 mb-6 relative z-0">
                      <span className="w-24"></span>
                      <div className="flex-1 flex">
                        <div style={{ width: `${width}%` }} className="flex flex-col items-center">
                          <div className="w-[calc(100%-16px)] h-6 border-x-4 border-b-4 border-slate-300 opacity-60 rounded-b-xl"></div>
                          <div className="bg-slate-50 px-2 -mt-5 z-10">
                            <input
                              type="text"
                              value={inputs[inputKey] || ''}
                              onChange={(e) => handleInputChange(inputKey, e.target.value)}
                              placeholder=""
                              className="w-20 h-8 text-center text-sm font-black bg-white border-2 border-slate-400 rounded-lg focus:outline-none focus:border-blue-400 text-slate-900 shadow-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>

            {/* Total Bracket for Comparison */}
            {modelData.whole !== undefined && (
              <div className="w-[180px] flex-shrink-0 flex items-center ml-4 h-[6rem]">
                <div className="w-10 h-full py-0.5 pointer-events-none">
                  <CurlyBracket />
                </div>
                <div className="ml-1 flex flex-col items-start z-20">
                  <input
                    type="text"
                    value={inputs['whole'] || ''}
                    onChange={(e) => handleInputChange('whole', e.target.value)}
                    placeholder=""
                    className="w-28 h-12 text-center text-xl font-black bg-white border-2 border-slate-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 text-slate-900 shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-black text-slate-900">Bar Model Workspace</h2>
        <p className="text-slate-500 font-bold mt-2">Fill in the blanks to solve the problem.</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {type === 'PART_WHOLE' ? renderPartWhole() : null}
        {type === 'COMPARISON' ? renderComparison() : null}
        {!type && <p className="text-center text-slate-400 mt-12">No bar model data available.</p>}
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => onClose(inputs)}
          className="px-12 py-4 bg-green-500 text-white font-black rounded-full shadow-[0_8px_0_0_rgba(21,128,61,1)] hover:translate-y-1 hover:shadow-[0_4px_0_0_rgba(21,128,61,1)] active:translate-y-2 active:shadow-none transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
}
