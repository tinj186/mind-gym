'use client';

import React from 'react';

export default function PlaceValueChart({ data }) {
  if (!data) return null;

  // Handle potential stringified JSON from AI and normalize values
  const model = typeof data === 'string' ? JSON.parse(data) : data;
  const tenThousands = model.tenThousands !== undefined ? model.tenThousands : (model.ten_thousands !== undefined ? model.ten_thousands : null);
  const thousands = model.thousands !== undefined ? model.thousands : null;
  const hundreds = model.hundreds !== undefined ? model.hundreds : null;
  const tens = model.tens !== undefined ? model.tens : 0;
  const ones = model.ones !== undefined ? model.ones : 0;

  const showDigits = model.showDigits === true;
  const isBlocks = model.displayMode === 'blocks';
  
  const hasTenThousands = tenThousands !== null;
  const hasThousands = thousands !== null || hasTenThousands;
  const hasHundreds = hundreds !== null || hasThousands;
  const colsClass = hasTenThousands ? 'grid-cols-5' : hasThousands ? 'grid-cols-4' : hasHundreds ? 'grid-cols-3' : 'grid-cols-2';
  const maxWidthClass = hasTenThousands ? 'max-w-2xl' : hasThousands ? 'max-w-xl' : 'max-w-md';

  const columns = [];
  if (hasTenThousands) {
    columns.push({
      key: 'tth',
      title: 'Ten Thousands',
      shortTitle: 'Ten Th',
      count: Number(tenThousands) || 0,
      label: '10 000',
      bgColor: 'bg-violet-600',
      textColor: 'text-white',
      borderColor: 'border-violet-900',
      headerBg: 'bg-violet-50 text-violet-900'
    });
  }
  if (hasThousands) {
    columns.push({
      key: 'th',
      title: 'Thousands',
      shortTitle: 'Th',
      count: Number(thousands) || 0,
      label: '1000',
      bgColor: 'bg-indigo-600',
      textColor: 'text-white',
      borderColor: 'border-indigo-900',
      headerBg: 'bg-indigo-50 text-indigo-900'
    });
  }
  if (hasHundreds) {
    columns.push({
      key: 'h',
      title: 'Hundreds',
      shortTitle: 'H',
      count: Number(hundreds) || 0,
      label: '100',
      bgColor: 'bg-sky-500',
      textColor: 'text-white',
      borderColor: 'border-sky-900',
      headerBg: 'bg-sky-50 text-sky-900'
    });
  }
  columns.push({
    key: 't',
    title: 'Tens',
    shortTitle: 'T',
    count: Number(tens) || 0,
    label: '10',
    bgColor: 'bg-emerald-500',
    textColor: 'text-white',
    borderColor: 'border-emerald-900',
    headerBg: 'bg-emerald-50 text-emerald-900'
  });
  columns.push({
    key: 'o',
    title: 'Ones',
    shortTitle: 'O',
    count: Number(ones) || 0,
    label: '1',
    bgColor: 'bg-amber-400',
    textColor: 'text-slate-900',
    borderColor: 'border-amber-800',
    headerBg: 'bg-amber-50 text-amber-900'
  });

  const discShapeClass = isBlocks ? 'rounded-lg' : 'rounded-full';

  return (
    <div className={`my-8 ${maxWidthClass} mx-auto overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] select-none transition-transform hover:scale-[1.01]`}>
      {/* Pedagogical Headers */}
      <div className={`grid ${colsClass} divide-x-4 divide-slate-900 border-b-4 border-slate-900`}>
        {columns.map(col => (
          <div key={col.key} className={`py-3 px-1 text-center font-black uppercase tracking-[0.1em] ${col.headerBg}`}>
            <span className="hidden sm:inline text-[10px] md:text-[11px]">{col.title}</span>
            <span className="inline sm:hidden text-[9px]">{col.shortTitle}</span>
          </div>
        ))}
      </div>

      {/* Discs / Blocks Display */}
      <div className={`grid ${colsClass} divide-x-4 divide-slate-900 bg-slate-50/50 min-h-[160px] sm:min-h-[200px]`}>
        {columns.map(col => (
          <div key={col.key} className="p-2 sm:p-3 flex flex-wrap content-start justify-center gap-1.5 sm:gap-2">
            {col.count > 0 ? (
              Array.from({ length: col.count }).map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${discShapeClass} ${col.bgColor} ${col.textColor} border-2 ${col.borderColor} shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center transition-transform hover:scale-110 cursor-pointer`}
                  title={`${col.title} disc (${col.label})`}
                >
                  <span className="text-[8px] sm:text-[10px] font-black tracking-tighter leading-none">
                    {col.label}
                  </span>
                </div>
              ))
            ) : (
              <div className="h-full w-full min-h-[120px] sm:min-h-[160px] flex items-center justify-center">
                <span className="text-slate-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest italic select-none">
                  0
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Optional Digits Reveal / Footers (only if explicitly enabled) */}
      {showDigits && (
        <div className={`grid ${colsClass} divide-x-4 divide-slate-900 border-t-4 border-slate-900 bg-slate-100`}>
          {columns.map(col => (
            <div key={col.key} className="py-3 text-center text-2xl sm:text-4xl font-black text-slate-900 tabular-nums">
              {col.count}
            </div>
          ))}
        </div>
      )}

      {/* Helper Footer Caption */}
      <div className="py-2.5 px-4 bg-slate-900 text-center">
        <p className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          {isBlocks ? 'Count the place value blocks in each column' : 'Count the place value discs in each column'}
        </p>
      </div>
    </div>
  );
}