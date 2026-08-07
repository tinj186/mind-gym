'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

export default function BarModelWorkspace({ modelData, onClose, initialState }) {
  // Use modelData.modelType OR modelData.type
  const type = modelData.modelType || modelData.type;
  
  // State for user inputs
  const [inputs, setInputs] = useState(initialState || {});

  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const renderPartWhole = () => {
    const knownSum = modelData.parts.reduce((sum, p) => sum + (parseFloat(p) || 0), 0);
    const hasUnknownWhole = isNaN(parseFloat(modelData.whole));
    const calculatedWhole = hasUnknownWhole ? (knownSum || modelData.parts.length) : parseFloat(modelData.whole);
    const unknownCount = modelData.parts.filter(p => isNaN(parseFloat(p))).length;
    const remainingForUnknown = Math.max(0, calculatedWhole - knownSum);
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
                const partVal = parseFloat(part) || fallbackPartVal;
                const width = (partVal / calculatedWhole) * 100;
                const inputKey = `part_${idx}`;
                
                return (
                  <div
                    key={idx}
                    style={{ width: `${width}%` }}
                    className={`relative flex items-center justify-center border-r-4 last:border-r-0 border-slate-200 ${
                      idx % 2 === 0 ? 'bg-blue-500' : 'bg-blue-400'
                    }`}
                  >
                    <UnitSegments value={part} />
                    
                    {/* Interactive Input for Part */}
                    <input
                      type="text"
                      value={inputs[inputKey] || ''}
                      onChange={(e) => handleInputChange(inputKey, e.target.value)}
                      placeholder=""
                      className="w-24 h-12 text-center text-xl font-black bg-white/90 border-2 border-slate-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-400 z-20 text-slate-900 shadow-sm placeholder:text-slate-300"
                    />
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
                  placeholder=""
                  className="w-32 h-10 text-center text-lg font-black bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderComparison = () => {
    const v1 = parseFloat(modelData.bar1?.value) || 0;
    const v2 = parseFloat(modelData.bar2?.value) || 0;
    const maxVal = Math.max(v1, v2, 1);

    return (
      <div className="my-12 p-8 bg-slate-50 rounded-[3rem] border-4 border-slate-100 space-y-8 shadow-inner">
        <h3 className="text-xl font-black text-slate-800 text-center mb-8 uppercase tracking-widest">Comparison Model</h3>
        
        <div className="max-w-2xl mx-auto space-y-6">
          {[modelData.bar1, modelData.bar2].map((bar, idx) => {
            if (!bar) return null;
            const width = (parseFloat(bar.value) / maxVal) * 100;
            const inputKey = `bar_${idx}`;
            
            return (
              <div key={idx} className="flex items-center gap-6">
                <span className="w-24 text-sm font-black text-slate-400 uppercase text-right truncate">
                  {bar.name}
                </span>
                <div className="flex-1 h-16 bg-white rounded-2xl border-4 border-slate-200 overflow-hidden flex">
                  <div
                    style={{ width: `${width}%` }}
                    className={`relative h-full flex items-center justify-end px-4 shadow-sm ${
                      idx === 0 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                  >
                    <UnitSegments value={bar.value} />
                    
                    {/* Interactive Input for Bar */}
                    <input
                      type="text"
                      value={inputs[inputKey] || ''}
                      onChange={(e) => handleInputChange(inputKey, e.target.value)}
                      placeholder=""
                      className="w-24 h-10 text-center text-lg font-black bg-white/90 border-2 border-slate-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-400 z-20 text-slate-900 shadow-sm placeholder:text-slate-300"
                    />
                  </div>
                  
                  {/* Difference Box (if this is the shorter bar) */}
                  {width < 100 && (
                    <div 
                      style={{ width: `${100 - width}%` }}
                      className="h-full flex items-center justify-center bg-slate-50/50 border-l-4 border-dashed border-slate-300"
                    >
                      <input
                        type="text"
                        value={inputs['diff'] || ''}
                        onChange={(e) => handleInputChange('diff', e.target.value)}
                        placeholder=""
                        className="w-24 h-10 text-center text-sm font-black bg-white border-2 border-slate-300 text-slate-600 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm placeholder:text-slate-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
