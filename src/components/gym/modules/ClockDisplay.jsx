import React from 'react';

export default function ClockDisplay({ data, hideCardStyles = false }) {
  if (!data) return null;

  const { hour = 12, minute = 0, displayType = 'analog' } = data;

  // 📐 Precise Angular Rotations
  const minuteAngle = minute * 6; // 360 degrees / 60 minutes = 6 degrees per min
  const hourAngle = (hour % 12) * 30 + minute * 0.5; // 30 degrees per hour + 0.5 degrees per elapsed minute

  // Helper to place clock numbers 1-12 accurately around the circle radius
  const getNumberCoordinates = (num, radius = 70) => {
    const angle = ((num * 30 - 90) * Math.PI) / 180; // Shift by 90 to start at top center
    const x = 100 + radius * Math.cos(angle);
    const y = 100 + radius * Math.sin(angle);
    return { x, y };
  };

  const showAnalog = displayType === 'analog' || displayType === 'both';
  const showDigital = displayType === 'digital' || displayType === 'both';

  // Format digital numbers to always use double digits (e.g., "05:30")
  const formatDigital = (h, m) => {
    const paddedHour = String(h).padStart(2, '0');
    const paddedMinute = String(m).padStart(2, '0');
    return `${paddedHour}:${paddedMinute}`;
  };

  const containerStyle = hideCardStyles
    ? "w-full flex flex-col items-center justify-center space-y-4 bg-transparent p-0 border-0 shadow-none"
    : "w-full max-w-md mx-auto p-6 bg-white rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center justify-center space-y-6";

  return (
    <div className={containerStyle}>
      
      {/* 🕒 1. ANALOG ENGINE */}
      {showAnalog && (
        <div className="w-64 h-64 relative select-none">
          <svg 
            viewBox="0 0 200 200" 
            className="w-full h-full drop-shadow-[4px_4px_0px_rgba(15,23,42,0.1)]"
          >
            {/* Clock Outer Rim */}
            <circle 
              cx="100" 
              cy="100" 
              r="94" 
              className="fill-slate-50 stroke-slate-900 stroke-[4]" 
            />
            
            {/* Hour Numbers 1-12 */}
            {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
              const { x, y } = getNumberCoordinates(num);
              return (
                <text
                  key={num}
                  x={x}
                  y={y + 4} // Visual vertical center centering adjustment
                  textAnchor="middle"
                  className="font-black text-[15px] fill-slate-800 font-sans tracking-tight"
                >
                  {num}
                </text>
              );
            })}

            {/* 🔴 HOUR HAND (Shorter, Thicker) */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="52"
              className="stroke-slate-900 stroke-[6]"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 100 100)`}
            />

            {/* 🔵 MINUTE HAND (Longer, Sleeker) */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="32"
              className="stroke-slate-700 stroke-[4]"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 100 100)`}
            />

            {/* Center Pin Cap */}
            <circle 
              cx="100" 
              cy="100" 
              r="6" 
              className="fill-red-500 stroke-slate-900 stroke-[2]" 
            />
          </svg>
        </div>
      )}

      {/* 📟 2. DIGITAL ENGINE */}
      {showDigital && (
        <div className="px-6 py-3 bg-slate-900 border-4 border-slate-950 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
          <span className="font-mono text-3xl font-bold tracking-widest text-emerald-400 select-none">
            {formatDigital(hour, minute)}
          </span>
        </div>
      )}
    </div>
  );
}