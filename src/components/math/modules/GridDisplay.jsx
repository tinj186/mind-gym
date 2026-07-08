import React from 'react';

export default function GridDisplay({ data }) {
  if (!data) return null;

  const { gridType = 'SQUARE', gridSize = { cols: 10, rows: 10 }, referenceLines = [], workspaceLines = [] } = data;
  const { cols, rows } = gridSize;

  const cellSize = 30; // 30px per cell
  const padding = 20; // Padding to prevent clipping on edges
  const width = cols * cellSize + padding * 2;
  const height = rows * cellSize + padding * 2;

  return (
    <div className="flex justify-center items-center w-full my-6 select-none overflow-x-auto">
      <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden">
        <svg width={width} height={height} className="block bg-slate-50" viewBox={`0 0 ${width} ${height}`}>
          
          {/* Grid Background */}
          {gridType === 'SQUARE' ? (
            <g className="grid-lines stroke-slate-200 pointer-events-none">
              {Array.from({ length: cols + 1 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * cellSize + padding} y1={padding} x2={i * cellSize + padding} y2={height - padding} strokeWidth="1.5" />
              ))}
              {Array.from({ length: rows + 1 }).map((_, i) => (
                <line key={`h-${i}`} x1={padding} y1={i * cellSize + padding} x2={width - padding} y2={i * cellSize + padding} strokeWidth="1.5" />
              ))}
            </g>
          ) : (
            <g className="grid-dots fill-slate-300 pointer-events-none">
              {Array.from({ length: rows + 1 }).map((_, r) => (
                Array.from({ length: cols + 1 }).map((_, c) => (
                  <circle key={`dot-${r}-${c}`} cx={c * cellSize + padding} cy={r * cellSize + padding} r="3" />
                ))
              ))}
            </g>
          )}

          {/* Reference Lines (Target shape/lines) */}
          <g className="reference-lines stroke-slate-900 stroke-[4px]" strokeLinecap="round" strokeLinejoin="round">
            {referenceLines.map((line, idx) => (
              <g key={`ref-${idx}`}>
                <line 
                  x1={line.start[0] * cellSize + padding} 
                  y1={line.start[1] * cellSize + padding} 
                  x2={line.end[0] * cellSize + padding} 
                  y2={line.end[1] * cellSize + padding} 
                  stroke={line.color || undefined}
                  strokeDasharray={line.dashed ? "6 6" : undefined}
                />
                {line.label && (
                  <text 
                    x={((line.start[0] + line.end[0]) / 2) * cellSize + padding} 
                    y={((line.start[1] + line.end[1]) / 2) * cellSize + padding - 10}
                    textAnchor="middle"
                    className="fill-slate-800 font-bold text-lg stroke-none"
                  >
                    {line.label}
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* Workspace Lines (e.g. Distractor options or partial shapes) */}
          <g className="workspace-lines stroke-blue-600 stroke-[4px]" strokeLinecap="round" strokeLinejoin="round">
            {workspaceLines.map((line, idx) => (
              <g key={`work-${idx}`}>
                <line 
                  x1={line.start[0] * cellSize + padding} 
                  y1={line.start[1] * cellSize + padding} 
                  x2={line.end[0] * cellSize + padding} 
                  y2={line.end[1] * cellSize + padding}
                  stroke={line.color || undefined}
                  strokeDasharray={line.dashed ? "6 6" : undefined} 
                />
                {line.label && (
                  <text 
                    x={((line.start[0] + line.end[0]) / 2) * cellSize + padding} 
                    y={((line.start[1] + line.end[1]) / 2) * cellSize + padding - 10}
                    textAnchor="middle"
                    className="fill-blue-800 font-bold text-lg stroke-none"
                  >
                    {line.label}
                  </text>
                )}
              </g>
            ))}
          </g>

        </svg>
      </div>
    </div>
  );
}
