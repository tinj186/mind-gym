import React from 'react';

export default function SquareGridShape({ data }) {
  if (!data) return null;
  const { gridSize = { cols: 10, rows: 10 }, figures = [], unitLabel = "1 square unit" } = data;
  const { cols, rows } = gridSize;

  const cellSize = 30; // 30px per cell
  const padding = 30; // for labels
  const bottomPadding = 60; // Extra room for legend
  const width = cols * cellSize + padding * 2;
  const height = rows * cellSize + padding + bottomPadding;

  // Helpers to draw shaded squares
  const renderSquare = (x, y, type, color) => {
    const px = x * cellSize + padding;
    const py = y * cellSize + padding;
    const stroke = "#0f172a";
    const strokeWidth = "2";
    
    if (type === 'half-tl') {
      return <polygon points={`${px},${py} ${px+cellSize},${py} ${px},${py+cellSize}`} fill={color} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />;
    }
    if (type === 'half-tr') {
      return <polygon points={`${px},${py} ${px+cellSize},${py} ${px+cellSize},${py+cellSize}`} fill={color} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />;
    }
    if (type === 'half-bl') {
      return <polygon points={`${px},${py} ${px},${py+cellSize} ${px+cellSize},${py+cellSize}`} fill={color} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />;
    }
    if (type === 'half-br') {
      return <polygon points={`${px+cellSize},${py} ${px+cellSize},${py+cellSize} ${px},${py+cellSize}`} fill={color} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />;
    }
    // Default full
    return <rect x={px} y={py} width={cellSize} height={cellSize} fill={color} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />;
  };

  // Pastel colors for different figures
  const colors = ["#bfdbfe", "#fbcfe8", "#bbf7d0", "#fef08a", "#e9d5ff"];

  const sideLabel = unitLabel.replace('²', '').replace(' square unit', ' unit');

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl flex flex-col items-center justify-center p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900 overflow-x-auto">
      <svg width={width} height={height} className="block max-w-full h-auto" viewBox={`0 0 ${width} ${height}`}>
        {/* Background Grid lines */}
        <g className="grid-lines stroke-slate-300">
          {Array.from({ length: cols + 1 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * cellSize + padding} y1={padding} x2={i * cellSize + padding} y2={rows * cellSize + padding} strokeWidth="1" />
          ))}
          {Array.from({ length: rows + 1 }).map((_, i) => (
            <line key={`h-${i}`} x1={padding} y1={i * cellSize + padding} x2={cols * cellSize + padding} y2={i * cellSize + padding} strokeWidth="1" />
          ))}
        </g>
        
        {/* Render Shaded Figures */}
        {figures.map((fig, fIdx) => (
          <g key={fIdx}>
            {(() => {
              const squares = [...(fig.shadedSquares || []), ...(fig.halfShadedSquares || [])];
              return squares.map((sq, sIdx) => {
                let x, y, type;
                if (Array.isArray(sq)) {
                  [x, y] = sq;
                  type = 'full';
                } else {
                  ({ x, y, type = 'full' } = sq);
                  
                  // Map verbose type names to short ones
                  if (type === 'top-left') type = 'half-tl';
                  if (type === 'top-right') type = 'half-tr';
                  if (type === 'bottom-left') type = 'half-bl';
                  if (type === 'bottom-right') type = 'half-br';
                }
                // Skip if out of bounds
                if (x < 0 || x >= cols || y < 0 || y >= rows) return null;
                
                const color = fig.color || colors[fIdx % colors.length];
                return (
                  <g key={sIdx}>
                    {renderSquare(x, y, type, color)}
                  </g>
                );
              });
            })()}
            
            {/* Optional text label for the figure */}
            {fig.label && fig.labelPos && (
              <g>
                {/* White outline for readability over grid lines */}
                <text 
                  x={fig.labelPos.x * cellSize + padding} 
                  y={fig.labelPos.y * cellSize + padding} 
                  fill="none" 
                  stroke="white"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  fontSize="16" 
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {fig.label}
                </text>
                {/* Main text */}
                <text 
                  x={fig.labelPos.x * cellSize + padding} 
                  y={fig.labelPos.y * cellSize + padding} 
                  fill="#0f172a" 
                  fontSize="16" 
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="drop-shadow-sm"
                >
                  {fig.label}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Legend / Unit scale */}
        <g transform={`translate(${padding}, ${rows * cellSize + padding + 20})`}>
          <rect x="0" y="0" width={24} height={24} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2,2" />
          {unitLabel.includes('²') ? (
            <text x={32} y={16} fill="#64748b" fontSize="13" fontWeight="600">
              = {unitLabel}
            </text>
          ) : (
            <>
              <text x={12} y="-6" fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">
                {sideLabel}
              </text>
              <text x={28} y={16} fill="#64748b" fontSize="12" fontWeight="600">
                {sideLabel}
              </text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
