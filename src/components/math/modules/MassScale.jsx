import React from 'react';

export default function MassScale({ data, hideCardStyles = false }) {
  const containerStyle = hideCardStyles
    ? "w-full bg-transparent p-0 border-0 shadow-none"
    : "w-full max-w-2xl mx-auto p-6 bg-white rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]";

  const {
    value = 400,
    maxScale = 1000,
    unit = 'g',
    intervals = 100,
    labelInterval,
    objectEmoji = '🍎',
  } = data || {};

  const cx = 150;
  const cy = 150;
  const radius = 90;
  
  // Calculate pointer angle
  // Map 0 to maxScale onto angle -135 to +135
  const valueClamped = Math.max(0, Math.min(value, maxScale));
  const pointerAngle = -135 + (valueClamped / maxScale) * 270;

  // Generate ticks
  const numTicks = Math.floor(maxScale / intervals);
  const ticks = [];
  for (let i = 0; i <= numTicks; i++) {
    const tickValue = i * intervals;
    const angle = -135 + (tickValue / maxScale) * 270;
    ticks.push({ value: tickValue, angle });
  }

  return (
    <div className={`${containerStyle} flex flex-col items-center justify-center py-12`}>
      <div className="relative flex flex-col items-center" style={{ width: '300px' }}>
        
        {/* Object being weighed */}
        <div className="z-10 flex flex-col justify-end items-center mb-2" style={{ height: '80px' }}>
           <span className="text-6xl drop-shadow-md">{objectEmoji}</span>
        </div>

        {/* Scale Top Plate */}
        <div className="w-48 h-6 bg-slate-300 border-4 border-slate-800 rounded-lg z-10 shadow-sm" />
        
        {/* Scale Support Neck */}
        <div className="w-16 h-8 bg-slate-800 z-0 -mt-2" />

        {/* Main Scale Body */}
        <div 
          className="w-full bg-slate-100 border-4 border-slate-800 rounded-3xl relative flex items-center justify-center shadow-inner overflow-hidden"
          style={{ height: '300px' }}
        >
          
          <svg width="300" height="300" className="absolute top-0 left-0">
            {/* Outer Bezel */}
            <circle cx={cx} cy={cy} r={radius + 20} fill="#f8fafc" stroke="#1e293b" strokeWidth="8" />
            <circle cx={cx} cy={cy} r={radius + 16} fill="#ffffff" />
            
            {/* Tick Marks and Labels */}
            {ticks.map((tick, i) => {
              const rad = (tick.angle - 90) * (Math.PI / 180);
              const x1 = cx + (radius - 5) * Math.cos(rad);
              const y1 = cy + (radius - 5) * Math.sin(rad);
              const x2 = cx + radius * Math.cos(rad);
              const y2 = cy + radius * Math.sin(rad);
              
              const labelRad = (tick.angle - 90) * (Math.PI / 180);
              const lx = cx + (radius - 22) * Math.cos(labelRad);
              const ly = cy + (radius - 22) * Math.sin(labelRad);

              const shouldLabel = labelInterval ? (tick.value % labelInterval === 0) : true;
              const isMajorTick = shouldLabel;

              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e293b" strokeWidth={isMajorTick ? "3" : "1.5"} />
                  {shouldLabel && (
                    <text 
                      x={lx} 
                      y={ly} 
                      fill="#334155" 
                      fontSize="12" 
                      fontWeight="bold" 
                      textAnchor="middle" 
                      dominantBaseline="central"
                    >
                      {tick.value}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Unit Label */}
            <text x={cx} y={cy + 40} fill="#64748b" fontSize="16" fontWeight="bold" textAnchor="middle">
              {unit}
            </text>

            {/* Pointer */}
            <g transform={`rotate(${pointerAngle}, ${cx}, ${cy})`}>
              <polygon points={`${cx - 4},${cy + 15} ${cx + 4},${cy + 15} ${cx},${cy - radius + 5}`} fill="#ef4444" />
              <circle cx={cx} cy={cy} r="8" fill="#1e293b" />
            </g>
          </svg>

          {/* Optional: Add a base/feet */}
        </div>
        
        {/* Scale Base/Feet */}
        <div className="w-56 h-6 flex justify-between px-4 -mt-2 z-0">
          <div className="w-8 h-6 bg-slate-800 rounded-b-lg" />
          <div className="w-8 h-6 bg-slate-800 rounded-b-lg" />
        </div>

      </div>
    </div>
  );
}
