import React from 'react';

export default function NumberCards({ data }) {
  // Support DIGIT_CARD_SORTER 'digits' array, 'items' object array, and legacy 'numbers' array
  const rawItems = (data?.digits && Array.isArray(data.digits))
    ? data.digits.map(d => ({ value: d.toString() }))
    : (data?.items || data?.numbers || []);

  const items = rawItems.map(item => {
    if (typeof item === 'object' && item !== null) return item;
    return { value: item };
  });

  const layout = data?.layout || 'horizontal';
  const condition = data?.condition;

  return (
    <div className="flex flex-col items-center gap-3">
      {condition && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border-2 border-indigo-200 rounded-full text-indigo-700 font-black text-xs uppercase tracking-wider">
          <span>Target:</span>
          <span className="font-extrabold text-indigo-900">{condition.toUpperCase()}</span>
        </div>
      )}
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
          {item.type === 'fraction' ? (
            <div className="flex flex-col items-center justify-center font-black text-slate-900">
              <span className="text-4xl leading-none px-2">{item.num}</span>
              <div className="h-1 w-full bg-slate-900 my-1 rounded"></div>
              <span className="text-4xl leading-none px-2">{item.denom}</span>
            </div>
          ) : (
            <span className="text-4xl font-black text-slate-900">
              {item.value || item.lengthUnits}
            </span>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}