'use client';

import React from 'react';

export default function EqualGroups({ data, isQuestion }) {
  if (!data) return null;
  const { groups, itemsPerGroup, icon } = data;
  const totalItems = groups * itemsPerGroup;

  if (isQuestion) {
    return (
      <div className="my-8 p-10 bg-white rounded-[2rem] border-2 border-slate-100 flex flex-wrap gap-4 justify-center items-center">
        {Array(totalItems).fill(0).map((_, i) => (
          <span key={i} className="text-4xl grayscale-0 select-none">
            {icon}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="my-6 flex flex-wrap gap-10 justify-center">
      {Array(groups).fill(0).map((_, i) => (
        <div 
          key={i} 
          className="relative min-w-[140px] min-h-[140px] rounded-[2rem] border-4 border-dashed border-blue-400 flex flex-wrap items-center justify-center p-8 bg-blue-50/30 gap-2 transition-transform hover:scale-105"
        >
          {Array(itemsPerGroup).fill(0).map((_, j) => (
            <span key={j} className="text-3xl grayscale-0 select-none">
              {icon}
            </span>
          ))}
          <div className="absolute -top-3 -left-3 bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
            GROUP {i + 1}
          </div>
        </div>
      ))}
    </div>
  );
}