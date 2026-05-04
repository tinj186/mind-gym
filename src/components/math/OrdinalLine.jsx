'use client';

import React from 'react';

export default function OrdinalLine({ data, isQuestion }) {
  if (!data || !data.items || !Array.isArray(data.items)) return null;

  const { items, direction = 'left' } = data;
  const totalItems = items.length;
  const ordinalSymbols = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

  // Aggressive scaling logic: Determine font size and gaps based on item count
  const itemSizeClass = totalItems > 10 
    ? 'text-[10px] md:text-xs' 
    : totalItems > 7 
      ? 'text-base md:text-lg' 
      : 'text-2xl md:text-4xl';

  const gapClass = totalItems > 10 ? 'gap-1 md:gap-2' : 'gap-3 md:gap-5';

  return (
    <div className="my-8 w-full p-4 md:p-8 bg-white rounded-[2rem] border-2 border-slate-100 flex flex-col items-center justify-center select-none min-h-[140px]">
      {/* Flex-wrap replaces the scroll area. Items will now break into multiple rows if they exceed the container width, 
          keeping everything visible and centered without horizontal scrolling. */}
      <div className="w-full py-4">
        <div className={`flex flex-row flex-wrap items-center justify-center ${gapClass} px-2 md:px-8`}>
          {/* Only show "Left" marker at the start of the first row */}
          <div className="flex flex-col items-center self-start mt-1">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Left</span>
            </div>
          </div>

          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center px-1">
              <span className={`${itemSizeClass} transition-all duration-300 hover:scale-110 drop-shadow-sm`}>
                {item}
              </span>
              {/* Explicit position labels help track the queue when rows wrap. 
                  We hide these during the Question phase so the student has to count themselves. */}
              {!isQuestion && (
                <span className="text-[8px] font-black text-blue-400 mt-1 uppercase tracking-tighter">{ordinalSymbols[i]}</span>
              )}
            </div>
          ))}

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Right</span>
            </div>
          </div>
        </div>
      </div>
      {/* Instruction text driven by the direction logic */}
      <p className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
        {direction === 'right' ? '← Count from the Right Side' : 'Count from the Left Side →'}
      </p>
    </div>
  );
}