import React, { useState, useEffect } from 'react';

export default function GridDrawingCanvas({ data, onSubmit, onChange, disabled }) {
  const [drawnLines, setDrawnLines] = useState([]);
  const [activePoint, setActivePoint] = useState(null);

  useEffect(() => {
    // If the data payload comes with some workspaceLines (e.g. partial shapes), we should pre-populate
    if (data?.workspaceLines) {
      setDrawnLines(data.workspaceLines);
    }
  }, [data]);

  if (!data) return null;

  const { gridType = 'SQUARE', gridSize = { cols: 6, rows: 6 }, referenceLines = [] } = data;
  const { cols, rows } = gridSize;

  const cellSize = 30; // 30px per cell
  const padding = 20;
  const width = cols * cellSize + padding * 2;
  const height = rows * cellSize + padding * 2;

  const handlePointClick = (x, y) => {
    if (disabled) return;
    
    if (activePoint) {
      // Create a line
      if (activePoint.x !== x || activePoint.y !== y) {
        // Prevent duplicate lines
        const exists = drawnLines.some(l => 
          (l.start[0] === activePoint.x && l.start[1] === activePoint.y && l.end[0] === x && l.end[1] === y) ||
          (l.start[0] === x && l.start[1] === y && l.end[0] === activePoint.x && l.end[1] === activePoint.y)
        );
        if (!exists) {
          setDrawnLines(prev => {
            const newLines = [...prev, { start: [activePoint.x, activePoint.y], end: [x, y] }];
            if (onChange) {
              const minCount = data?.workspaceLines ? data.workspaceLines.length : 0;
              onChange(JSON.stringify(newLines.slice(minCount)));
            }
            return newLines;
          });
        }
      }
      setActivePoint(null); // Reset after drawing or clicking same point
    } else {
      setActivePoint({ x, y });
    }
  };

  const handleUndo = () => {
    if (disabled || drawnLines.length === 0) return;
    // Don't undo the initial workspace lines provided by the AI payload if we can help it,
    // but for simplicity, we'll just pop the last one.
    // If we want to prevent deleting initial lines, we'd check against data.workspaceLines.length.
    const minLines = data.workspaceLines ? data.workspaceLines.length : 0;
    if (drawnLines.length > minLines) {
      setDrawnLines(prev => {
        const newLines = prev.slice(0, -1);
        if (onChange) onChange(JSON.stringify(newLines.slice(minLines)));
        return newLines;
      });
    }
    setActivePoint(null);
  };

  const handleClear = () => {
    if (disabled) return;
    const minLines = data.workspaceLines ? data.workspaceLines : [];
    setDrawnLines(minLines);
    if (onChange) onChange(JSON.stringify([]));
    setActivePoint(null);
  };

  const handleSubmit = () => {
    if (disabled || !onSubmit) return;
    
    // We should only submit the lines the user ADDED, ignoring the pre-populated workspaceLines.
    // The backend expects an array of the missing lines.
    const initialCount = data.workspaceLines ? data.workspaceLines.length : 0;
    const userLines = drawnLines.slice(initialCount);
    onSubmit(JSON.stringify(userLines));
  };

  const renderGridContent = (interactive = false) => {
    const lines = interactive ? drawnLines : referenceLines;
    const strokeColor = interactive ? "stroke-blue-600" : "stroke-slate-900";

    return (
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

        {/* Drawn/Reference Lines */}
        <g className={`${strokeColor} stroke-[4px] pointer-events-none`} strokeLinecap="round" strokeLinejoin="round">
          {lines.map((line, idx) => (
            <line 
              key={`line-${idx}`} 
              x1={line.start[0] * cellSize + padding} 
              y1={line.start[1] * cellSize + padding} 
              x2={line.end[0] * cellSize + padding} 
              y2={line.end[1] * cellSize + padding} 
            />
          ))}
          {interactive && activePoint && (
            <circle cx={activePoint.x * cellSize + padding} cy={activePoint.y * cellSize + padding} r="6" className="fill-blue-500 stroke-none" />
          )}
        </g>
      </svg>
    );
  };

  const renderInteractiveHitboxes = () => {
    return (
      <div className="absolute top-0 left-0 w-full h-full z-20">
        {Array.from({ length: rows + 1 }).map((_, r) => (
          Array.from({ length: cols + 1 }).map((_, c) => {
            const isSelected = activePoint?.x === c && activePoint?.y === r;
            return (
              <button
                key={`hitbox-${r}-${c}`}
                disabled={disabled}
                onClick={() => handlePointClick(c, r)}
                className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center transition-all ${
                  isSelected ? 'bg-blue-400/50 scale-150' : 'hover:bg-slate-300/50'
                }`}
                style={{ left: c * cellSize + padding, top: r * cellSize + padding }}
                aria-label={`Point ${c}, ${r}`}
              />
            );
          })
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center my-6 select-none">
      
      {/* Side-by-side Grids */}
      <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
        
        {/* Target Figure */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Target Shape</span>
          <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm relative overflow-hidden">
            {renderGridContent(false)}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:flex h-32 w-1 bg-slate-200 rounded-full" />

        {/* Workspace */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-black tracking-widest text-blue-500 uppercase">Your Workspace</span>
          <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm relative overflow-hidden">
            {renderGridContent(true)}
            {!disabled && renderInteractiveHitboxes()}
          </div>
        </div>

      </div>

      {/* Controls */}
      {!disabled && onSubmit && (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={handleUndo}
              disabled={drawnLines.length <= (data.workspaceLines ? data.workspaceLines.length : 0)}
              className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-all"
            >
              Undo
            </button>
            <button 
              onClick={handleClear}
              disabled={drawnLines.length <= (data.workspaceLines ? data.workspaceLines.length : 0)}
              className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-all"
            >
              Clear
            </button>
          </div>
          <button 
            onClick={handleSubmit}
            className="flex-[2] py-3 px-6 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all"
          >
            Submit Drawing
          </button>
        </div>
      )}

    </div>
  );
}
