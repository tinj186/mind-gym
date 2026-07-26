import React from 'react';

export default function TimeLine({ data, hideCardStyles = false }) {
  if (!data || !data.points || data.points.length === 0) return null;

  const points = data.points;
  const jumps = data.jumps || [];

  const containerStyle = hideCardStyles
    ? "w-full flex flex-col items-center justify-center bg-transparent p-0 border-0 shadow-none py-8 overflow-x-hidden"
    : "my-8 w-full p-4 md:p-8 bg-white rounded-[2rem] border-2 border-slate-100 flex flex-col items-center justify-center select-none py-12 overflow-x-hidden";

  return (
    <div className={containerStyle}>
      <div className="w-full max-w-3xl px-8 md:px-16 py-12">
        <div className="flex flex-col w-full">
          
          {/* Jumps Layer (Arcs & Labels) */}
          <div className="relative w-full h-16 md:h-20 mb-1 pointer-events-none z-10">
            {jumps.map((jump, jIdx) => {
               const numPoints = points.length;
               if (numPoints < 2) return null;
               
               const startPct = (jump.startIndex / (numPoints - 1)) * 100;
               const endPct = (jump.endIndex / (numPoints - 1)) * 100;
               const width = endPct - startPct;
               
               return (
                 <div 
                   key={jIdx} 
                   className="absolute bottom-0 flex flex-col items-center justify-end"
                   style={{ left: `${startPct}%`, width: `${width}%` }}
                 >
                   <span className="text-xs sm:text-sm md:text-base font-bold text-blue-600 mb-1 bg-white/80 px-2 rounded-full shadow-sm whitespace-nowrap">
                     {jump.label}
                   </span>
                   <div className="relative w-full px-2 sm:px-4 h-8 md:h-12">
                      {/* The Arc */}
                      <div className="w-full h-full border-t-2 border-l-2 border-r-2 border-blue-400 rounded-t-full" />
                      {/* Arrow head */}
                      <div className="absolute -bottom-[1px] right-[6px] sm:right-[14px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-blue-400 transform rotate-[-25deg]" />
                   </div>
                 </div>
               )
            })}
          </div>

          {/* Main Line and Ticks Layer */}
          <div className="relative w-full flex items-center">
            {/* The continuous horizontal line */}
            <div className="w-full h-1 bg-slate-300 rounded-full" />
            
            {/* Ticks */}
            {points.map((pt, idx) => {
              const numPoints = points.length;
              const leftPct = (idx / (numPoints - 1)) * 100;
              return (
                <div 
                  key={idx} 
                  className="absolute flex flex-col items-center justify-center z-20"
                  style={{ left: `${leftPct}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-1 h-6 bg-slate-600 rounded-full" />
                </div>
              );
            })}
          </div>

          {/* Labels Layer */}
          <div className="relative w-full h-8 mt-2">
            {points.map((pt, idx) => {
              const numPoints = points.length;
              const leftPct = (idx / (numPoints - 1)) * 100;
              return (
                <div 
                  key={idx} 
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${leftPct}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="font-black text-slate-700 text-sm sm:text-base md:text-lg whitespace-nowrap">
                    {pt.label}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
