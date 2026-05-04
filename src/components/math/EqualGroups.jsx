'use client';

import React from 'react';

export default function EqualGroups({ data, isQuestion }) {
  if (!data) return null;

  // Support both legacy blueprints (groups/itemsPerGroup) and new Zod-compliant blueprints (groupCount/items)
  const groups = parseInt(data.groups || data.groupCount || 0);
  
  let itemsPerGroup = parseInt(data.itemsPerGroup || 0);
  if (itemsPerGroup === 0 && Array.isArray(data.items) && data.items.length > 0) {
    itemsPerGroup = parseInt(data.items[0]?.count || 0);
  }

  // Safely extract totalItems from the blueprint, or fallback to math
  let totalItems = parseInt(data.totalItems || (groups * itemsPerGroup) || 0);
  
  // Fix for division: If totalItems is provided but itemsPerGroup is just a placeholder (1), calculate the real items per group for the solution diagram
  if (data.totalItems && itemsPerGroup === 1 && groups > 0) {
    itemsPerGroup = totalItems / groups;
  }

  const icon = data.icon || (Array.isArray(data.items) && typeof data.items[0] === 'string' ? data.items[0] : '❓');
  const safeTotal = !isNaN(totalItems) && totalItems >= 0 ? Math.floor(totalItems) : 0;
  const safeGroups = !isNaN(groups) && groups >= 0 ? Math.floor(groups) : 0;
  const safeItemsPerGroup = !isNaN(itemsPerGroup) && itemsPerGroup >= 0 ? Math.floor(itemsPerGroup) : 0;

  if (isQuestion) {
    return (
      <div className="my-8 p-10 bg-white rounded-[2rem] border-2 border-slate-100 flex flex-wrap gap-4 justify-center items-center">
        {Array.from({ length: safeTotal }).map((_, i) => (
          <span key={i} className="text-4xl grayscale-0 select-none">
            {icon}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="my-6 flex flex-wrap gap-10 justify-center">
      {Array.from({ length: safeGroups }).map((_, i) => (
        <div 
          key={i} 
          className="relative min-w-[140px] min-h-[140px] rounded-[2rem] border-4 border-dashed border-blue-400 flex flex-wrap items-center justify-center p-8 bg-blue-50/30 gap-2 transition-transform hover:scale-105"
        >
          {Array.from({ length: safeItemsPerGroup }).map((_, j) => (
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