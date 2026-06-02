'use client';

import React from 'react';

export default function OrdinalLine({ data }) {
  // Support 'elements' (legacy), 'items' (new standard), or a direct array for maximum compatibility
  const rawElements = data?.elements || data?.items || (Array.isArray(data) ? data : []);
  
  if (!rawElements || rawElements.length === 0) {
    return null;
  }

  const { direction = 'left' } = data;
  const totalItems = rawElements.length;
  
  // Calculate content density to auto-resize emojis based on container items
  const totalIconsLength = rawElements.reduce((acc, el) => {
    const icon = typeof el === 'object' ? (el.icon || '') : String(el || '');
    return acc + [...icon].length;
  }, 0);

  // Responsive scaling: Shrink icons if there are many items or long containers
  let itemSizeClass = 'text-6xl';
  if (totalIconsLength > 15 || totalItems > 8) itemSizeClass = 'text-3xl';
  else if (totalIconsLength > 10 || totalItems > 6) itemSizeClass = 'text-4xl';
  else if (totalIconsLength > 6 || totalItems > 4) itemSizeClass = 'text-5xl';
  
  const gapClass = totalItems > 8 ? 'gap-2' : 'gap-6';

  return (
    <div className="my-8 w-full p-4 md:p-8 bg-white rounded-[2rem] border-2 border-slate-100 flex flex-col items-center justify-center select-none min-h-[140px]">
      <div className="w-full py-4">
        <div className={`flex flex-row flex-wrap items-center justify-center ${gapClass} px-2 md:px-8`}>
          {/* Left Indicator */}
          <div className="flex flex-col items-center gap-2 self-stretch py-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Left</span>
            <div className="w-1 flex-1 bg-slate-200 rounded-full min-h-[60px]" />
          </div>

          {rawElements.map((el, idx) => {
            if (!el) return null;
            
            const isEmoji = typeof el === 'string' && [...el].length <= 2;
            const icon = typeof el === 'object' ? (el.icon || '🏃') : (isEmoji ? el : '🏃');
            const label = typeof el === 'object' ? el.label : null;

            return (
              <div key={idx} className="flex flex-col items-center px-1">
                <span className={`${itemSizeClass} transition-all duration-300 hover:scale-110 drop-shadow-sm`}>
                  {icon}
                </span>
                {label && (
                  <span className="mt-2 text-[10px] font-black uppercase text-slate-500 tracking-wider text-center break-words w-full select-none">
                    {label}
                  </span>
                )}
              </div>
            );
          })}

          {/* Right Indicator */}
          <div className="flex flex-col items-center gap-2 self-stretch py-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Right</span>
            <div className="w-1 flex-1 bg-slate-200 rounded-full min-h-[60px]" />
          </div>
        </div>
      </div>
      <p className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
        {direction === 'right' ? '← Count from the Right Side' : 'Count from the Left Side →'}
      </p>
    </div>
  );
}