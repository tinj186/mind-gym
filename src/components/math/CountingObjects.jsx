'use client';

import React from 'react';

export default function CountingObjects({ data, isQuestion }) {
  if (!data || !data.groups) return null;

  const { icons = [], groups, crossOut = 0 } = data;
  
  // Flatten icons to apply cross-out logic sequentially from the end
  const allIcons = groups.flatMap((count, gIdx) => 
    Array(count).fill(0).map((_, i) => ({ 
      groupIndex: gIdx,
      icon: icons[gIdx] || icons[0] || data.icon 
    }))
  );

  const totalItems = allIcons.length;

  if (isQuestion) {
    return (
      <div className="my-8 p-10 bg-white rounded-[2rem] border-2 border-slate-100 flex flex-wrap gap-4 justify-center items-center">
        {allIcons.map((item, i) => (
          <div key={i} className="text-4xl select-none grayscale-0">
            {item.icon}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="my-6 p-6 bg-white rounded-3xl border-2 border-slate-100 flex flex-wrap gap-8 justify-center items-center">
      {groups.map((count, gIdx) => (
        <div 
          key={gIdx} 
          className="relative flex flex-wrap gap-2 max-w-[200px] justify-center p-6 rounded-3xl bg-blue-50/30 border-4 border-dashed border-blue-400 transition-transform hover:scale-105 shadow-sm"
        >
          {Array(count).fill(0).map((_, i) => {
            // Calculate global index to see if this specific icon is crossed out
            const globalIdx = groups.slice(0, gIdx).reduce((a, b) => a + b, 0) + i;
            const isCrossedOut = globalIdx >= (totalItems - crossOut);
            const currentIcon = icons[gIdx] || icons[0] || data.icon;

            return (
              <div key={i} className="relative text-3xl select-none grayscale-0">
                {currentIcon}
                {isCrossedOut && (
                  <div className="absolute inset-0 flex items-center justify-center text-red-500 font-black text-4xl drop-shadow-sm">✕</div>
                )}
              </div>
            );
          })}
          <div className="absolute -top-3 -left-3 bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
            SET {gIdx + 1}
          </div>
        </div>
      ))}
    </div>
  );
}