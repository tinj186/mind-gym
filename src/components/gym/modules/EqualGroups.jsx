import React from 'react';

export default function EqualGroups({ data }) {
  const numGroups = data?.groups || 2;
  const itemsPerGroup = data?.itemsPerGroup || 3;
  const icon = data?.icon || '🍎';

  return (
    <div className="flex flex-wrap justify-center gap-8 p-6">
      {Array.from({ length: numGroups }).map((_, gIdx) => (
        <div 
          key={gIdx} 
          className="bg-amber-50 p-6 rounded-[2rem] border-4 border-amber-400 shadow-[6px_6px_0px_0px_rgba(251,191,36,0.5)] flex flex-wrap justify-center items-center gap-2 max-w-[200px]"
        >
          {Array.from({ length: itemsPerGroup }).map((_, iIdx) => (
            <span key={iIdx} className="text-4xl drop-shadow-sm hover:scale-110 transition-transform">
              {icon}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}