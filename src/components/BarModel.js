'use client';

export default function BarModel({ data }) {
  // If no data is provided, show a placeholder "empty rack"
  if (!data || data.length === 0) {
    return (
      <div className="h-32 w-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-300 font-bold uppercase tracking-widest text-xs">
        Waiting for model data...
      </div>
    );
  }

  const chartWidth = 500; // Base width for scaling
  const barHeight = 40;
  const gap = 20;
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full py-4 flex flex-col items-center">
      <svg 
        viewBox={`0 0 ${chartWidth + 120} ${(barHeight + gap) * data.length}`} 
        className="w-full max-w-xl h-auto"
      >
        {data.map((item, index) => {
          // Calculate proportional width: (value / max) * available space
          const scaledWidth = (item.value / maxValue) * chartWidth;
          const yPos = index * (barHeight + gap);

          return (
            <g key={index} className="transition-all duration-1000 ease-out">
              {/* Label (Ali, Baba, etc.) */}
              <text 
                x="0" 
                y={yPos + 25} 
                className="fill-slate-400 text-[14px] font-bold uppercase tracking-tighter"
              >
                {item.label}
              </text>

              {/* The Bar */}
              <rect
                x="80"
                y={yPos}
                width={scaledWidth}
                height={barHeight}
                rx="8" // Rounded corners for that premium feel
                className={`${item.color || 'fill-blue-600'} shadow-sm transition-all duration-700`}
              />

              {/* The Value Label inside or beside the bar */}
              <text 
                x={80 + scaledWidth + 10} 
                y={yPos + 25} 
                className="fill-slate-900 text-[14px] font-black"
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}