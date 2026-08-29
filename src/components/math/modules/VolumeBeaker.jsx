import React from 'react';

export default function VolumeBeaker({ data, hideCardStyles = false }) {
  const containerStyle = hideCardStyles
    ? "w-full bg-transparent p-0 border-0 shadow-none"
    : "w-full max-w-2xl mx-auto p-6 bg-white rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]";

  const {
    value = 3,
    maxScale = 5,
    unit = 'l',
    color = '#3b82f6', // blue-500
    intervals = 1,
    labelInterval,
    label,
  } = data || {};

  const headroom = 40; // Empty space above the top scale line
  const beakerWidth = 160;
  const beakerHeight = 240 + headroom;
  
  const liquidMaxHeight = beakerHeight - headroom - 4; // 236px height for the scale
  const fillPercentage = Math.min(1, Math.max(0, value / maxScale));
  // Add 2px so the liquid top edge exactly covers the center-aligned 4px tick line
  const fillHeight = fillPercentage > 0 ? (fillPercentage * liquidMaxHeight) + 2 : 0;

  // Generate tick marks
  const numTicks = Math.floor(maxScale / intervals);
  const ticks = [];
  for (let i = 1; i <= numTicks; i++) {
    const tickValue = i * intervals;
    const yPos = liquidMaxHeight - (tickValue / maxScale) * liquidMaxHeight;
    ticks.push({ value: tickValue, y: yPos });
  }

  return (
    <div className={`${containerStyle} flex flex-col items-center justify-center py-12`}>
      <div className="relative" style={{ width: `${beakerWidth + 80}px`, height: `${beakerHeight + 40}px` }}>
        
        {/* Beaker Body */}
        <div 
          className="absolute border-4 border-t-0 border-slate-800 rounded-b-xl overflow-hidden bg-white/50 backdrop-blur-sm"
          style={{ width: `${beakerWidth}px`, height: `${beakerHeight}px`, bottom: '20px', left: '40px' }}
        >
          {/* Liquid */}
          <div 
            className="absolute bottom-0 w-full transition-all duration-700"
            style={{ height: `${fillHeight}px`, backgroundColor: color, opacity: 0.8 }}
          />
          {/* Liquid surface line removed for exact mathematical precision */}
        </div>

        {/* Beaker Lips */}
        <div 
          className="absolute border-t-4 border-l-4 border-r-4 border-slate-800 rounded-t-lg bg-white/20"
          style={{ width: `${beakerWidth + 16}px`, height: '16px', bottom: `${beakerHeight + 20}px`, left: `${40 - 8}px` }}
        />

        {/* Tick Marks - positioned to align exactly with the liquid's coordinate space */}
        <div 
          className="absolute pointer-events-none"
          style={{ 
            top: `${20 + headroom}px`, // pushed down by headroom
            left: '40px', // matches the beaker left edge exactly
            width: `${beakerWidth}px`, 
            height: `${liquidMaxHeight}px` 
          }}
        >
          {ticks.map((tick, i) => {
            const yPos = liquidMaxHeight - (tick.value / maxScale) * liquidMaxHeight;
            const showLabel = labelInterval ? tick.value % labelInterval === 0 : true;
            return (
              <div key={i} className="absolute flex items-center" style={{ top: `${yPos}px`, left: '0', transform: 'translateY(-50%)' }}>
                <div className={`${showLabel ? 'w-10' : 'w-6'} h-1 bg-slate-800 rounded-r-full z-10`} />
                {showLabel && (
                  <div className="ml-1 text-sm font-bold text-slate-800 drop-shadow-md bg-white/60 px-1 rounded">
                    {tick.value}{unit}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
      
      {label && (
        <div className="mt-8 text-xl font-bold text-slate-800 bg-white/80 px-6 py-2 rounded-xl shadow-sm border-2 border-slate-200">
          {label}
        </div>
      )}
    </div>
  );
}
