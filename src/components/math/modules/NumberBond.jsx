import React from 'react';

export default function NumberBond({ data }) {
  if (!data) return null;
  
  const whole = data.whole !== undefined ? data.whole : '?';
  
  // Support both new 'parts' array and legacy 'part1'/'part2' schemas
  const parts = data.parts || [
    data.part1 !== undefined ? data.part1 : '?',
    data.part2 !== undefined ? data.part2 : '?'
  ];

  return (
    <div className="relative w-full max-w-sm mx-auto p-12 flex flex-col items-center select-none">
      {/* SVG Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full z-0" style={{ top: '10%' }}>
        <line x1="50%" y1="25%" x2="25%" y2="65%" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        <line x1="50%" y1="25%" x2="75%" y2="65%" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
      </svg>

      {/* Whole (Top Circle) */}
      <div className="w-24 h-24 bg-rose-400 rounded-full border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex justify-center items-center z-10 mb-12">
        <span className="text-3xl font-black text-white">{whole}</span>
      </div>

      {/* Parts (Bottom Circles) */}
      <div className="flex justify-between w-full px-8">
        {parts.map((part, idx) => (
          <div key={idx} className="w-20 h-20 bg-sky-400 rounded-full border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex justify-center items-center z-10 mt-4">
            <span className="text-2xl font-black text-white">{part}</span>
          </div>
        ))}
      </div>
    </div>
  );
}