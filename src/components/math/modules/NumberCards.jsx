import React from 'react';

export default function NumberCards({ data }) {
  // Support both new 'items' object array and legacy 'numbers' value array
  const rawItems = data?.items || data?.numbers || [];
  const items = rawItems.map(item => {
    if (typeof item === 'object' && item !== null) return item;
    return { value: item };
  });

  const layout = data?.layout || 'horizontal';

  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'} justify-center gap-6 p-6`}>
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className="bg-white min-w-[120px] p-6 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-[8px_12px_0px_0px_rgba(15,23,42,1)] transition-all"
          style={{ backgroundColor: item.color || '#ffffff' }}
        >
          {item.label && (
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">
              {item.label}
            </span>
          )}
          <span className="text-4xl font-black text-slate-900">
            {item.value || item.lengthUnits}
          </span>
        </div>
      ))}
    </div>
  );
}