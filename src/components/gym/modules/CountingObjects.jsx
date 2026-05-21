import React from 'react';

export default function CountingObjects({ data, setIsToolOpen }) {
  const countingItems = (data.items || data.icon_array || data.groups?.flatMap(count => 
    Array(count).fill(data.icons?.[0] || '⭐')
  )) || [];
  
  // Performance Guard: Reduce emoji size if count is high (> 20) to prevent layout thrashing
  const countingSizeClass = countingItems.length > 50 ? 'text-2xl' : countingItems.length > 20 ? 'text-3xl' : 'text-5xl';

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-3">
        {countingItems.map((item, idx) => (
          <span key={idx} className={`${countingSizeClass} drop-shadow-sm`}>{item}</span>
        ))}
      </div>
      <button 
        onClick={() => setIsToolOpen?.(true)}
        className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
      >
        ✨ Open Grouping Tool to Help
      </button>
    </div>
  );
}