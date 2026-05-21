import React from 'react';

export default function OrdinalLine({ data }) {
  const elements = data?.elements || [];
  
  return (
    <div className="w-full max-w-3xl mx-auto overflow-x-auto p-8">
      <div className="flex items-end min-w-max gap-4 border-b-8 border-slate-900 pb-4 relative">
        {/* The Starting Flag */}
        <div className="absolute left-0 bottom-4 w-2 h-16 bg-red-500 border-2 border-slate-900" />
        <span className="absolute -left-4 bottom-24 text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-2 py-1 rounded">START</span>

        {elements.map((el, idx) => (
          <div key={idx} className="flex flex-col items-center gap-4 w-24">
            <span className="text-5xl drop-shadow-lg hover:-translate-y-2 transition-transform">
              {el.icon || '🏃'}
            </span>
            <div className="bg-white border-2 border-slate-900 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <span className="text-xs font-black uppercase text-slate-700">{el.name || `${idx + 1}st`}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}