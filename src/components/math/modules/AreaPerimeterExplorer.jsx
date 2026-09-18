import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AreaPerimeterExplorer({ data, onSubmit, disabled }) {
  const { area = 12, startDim = [3, 4], targetType = "longest" } = data || {};
  
  // Provide enough grid space to draw a 1x24 rectangle (longest perimeter for area 24)
  const cols = 28;
  const rows = 16;

  const [grid, setGrid] = useState(() => {
    const initialGrid = Array(rows).fill(null).map(() => Array(cols).fill(false));
    // Place starting shape in center
    const [w, h] = startDim;
    const startRow = Math.floor((rows - h) / 2);
    const startCol = Math.floor((cols - w) / 2);
    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r >= startRow && r < startRow + h && c >= startCol && c < startCol + w && count < area) {
          initialGrid[r][c] = true;
          count++;
        }
      }
    }
    return initialGrid;
  });

  const [tilesInHand, setTilesInHand] = useState(area - grid.flat().filter(Boolean).length);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate stats
  const { currentArea, currentPerimeter, isContiguous } = useMemo(() => {
    let a = 0;
    let p = 0;
    let firstTile = null;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          a++;
          if (!firstTile) firstTile = { r, c };
          
          // Check 4 neighbors for perimeter
          if (r === 0 || !grid[r - 1][c]) p++;
          if (r === rows - 1 || !grid[r + 1][c]) p++;
          if (c === 0 || !grid[r][c - 1]) p++;
          if (c === cols - 1 || !grid[r][c + 1]) p++;
        }
      }
    }

    // BFS for contiguity
    let isContiguous = true;
    if (a > 0) {
      let visited = new Set();
      let queue = [firstTile];
      visited.add(`${firstTile.r},${firstTile.c}`);
      let connectedCount = 0;

      while (queue.length > 0) {
        const { r, c } = queue.shift();
        connectedCount++;

        const neighbors = [
          { r: r - 1, c }, { r: r + 1, c }, { r, c: c - 1 }, { r, c: c + 1 }
        ];

        for (const n of neighbors) {
          if (n.r >= 0 && n.r < rows && n.c >= 0 && n.c < cols && grid[n.r][n.c]) {
            const key = `${n.r},${n.c}`;
            if (!visited.has(key)) {
              visited.add(key);
              queue.push(n);
            }
          }
        }
      }
      isContiguous = connectedCount === a;
    }

    return { currentArea: a, currentPerimeter: p, isContiguous };
  }, [grid, rows, cols]);

  const toggleTile = (r, c) => {
    if (disabled) return;
    setErrorMsg('');

    const newGrid = [...grid.map(row => [...row])];
    if (newGrid[r][c]) {
      // Remove tile
      newGrid[r][c] = false;
      setTilesInHand(prev => prev + 1);
      setGrid(newGrid);
    } else {
      // Add tile if available
      if (tilesInHand > 0) {
        newGrid[r][c] = true;
        setTilesInHand(prev => prev - 1);
        setGrid(newGrid);
      } else {
        // Can't add
        setErrorMsg('You have no tiles left in your hand! Remove a tile from the board first by tapping it.');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    }
  };

  const handleReset = () => {
    if (disabled) return;
    const initialGrid = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const [w, h] = startDim;
    const startRow = Math.floor((rows - h) / 2);
    const startCol = Math.floor((cols - w) / 2);
    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r >= startRow && r < startRow + h && c >= startCol && c < startCol + w && count < area) {
          initialGrid[r][c] = true;
          count++;
        }
      }
    }
    setGrid(initialGrid);
    setTilesInHand(area - initialGrid.flat().filter(Boolean).length);
    setErrorMsg('');
  };

  const handleSubmit = () => {
    if (disabled || !onSubmit) return;
    if (tilesInHand > 0) {
      setErrorMsg(`You must place all ${area} tiles on the board.`);
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    if (!isContiguous) {
      setErrorMsg('All tiles must be connected together into a single shape (no disconnected islands)!');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    
    // For this module, we will just submit the JSON string representing the grid or the final perimeter
    // But since it's just an interactive sandbox right now, we can submit a dummy payload
    onSubmit(JSON.stringify({ perimeter: currentPerimeter, area: currentArea }));
  };

  return (
    <div className="w-full flex flex-col items-center my-8 font-sans select-none overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-indigo-950 p-4 sm:p-8 shadow-2xl relative border border-slate-700/50">
      
      {/* Target Instruction Banner */}
      <div className="w-full max-w-4xl bg-indigo-500/20 border border-indigo-400/30 rounded-2xl p-4 mb-6 text-center backdrop-blur-sm">
        <h3 className="text-indigo-200 font-bold text-sm uppercase tracking-widest mb-1">Your Mission</h3>
        <p className="text-white text-lg">
          Arrange exactly <span className="text-amber-400 font-black">{area} tiles</span> to create the <span className="text-rose-400 font-black">{targetType} possible perimeter</span>!
        </p>
      </div>

      {/* Header Stats */}
      <div className="flex flex-col md:flex-row justify-between w-full max-w-5xl mb-6 items-center gap-4">
        
        {/* Tiles in Hand Badge */}
        <div className="flex items-center gap-4 bg-slate-800/80 px-6 py-4 rounded-2xl border-t-2 border-slate-600 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(tilesInHand, 5) }).map((_, i) => (
              <div key={i} className="w-5 h-5 bg-gradient-to-br from-amber-300 to-orange-500 rounded-sm shadow-[0_0_10px_rgba(245,158,11,0.3)] border border-orange-400/50 rotate-3" />
            ))}
            {tilesInHand > 5 && <span className="text-amber-400 font-black ml-2 text-lg">+{tilesInHand - 5}</span>}
            {tilesInHand === 0 && <span className="text-emerald-400 font-black tracking-widest text-sm uppercase">Empty</span>}
          </div>
          <div className="flex flex-col ml-2 border-l-2 border-slate-700 pl-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hand</span>
            <span className="text-2xl font-black text-white leading-none">{tilesInHand} <span className="text-xs font-bold text-slate-400 uppercase">left</span></span>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center justify-center bg-slate-800/50 w-28 h-20 rounded-2xl border-t-2 border-slate-700/50 shadow-inner">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Area</span>
            <span className="text-3xl font-black text-blue-400 leading-none">{currentArea}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-slate-800/50 w-36 h-20 rounded-2xl border-t-2 border-rose-900/50 shadow-[inset_0_0_20px_rgba(225,29,72,0.1)]">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Perimeter</span>
            <span className="text-3xl font-black text-rose-400 leading-none">{currentPerimeter}</span>
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="relative p-4 sm:p-6 bg-slate-950/60 rounded-3xl border border-slate-800 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] overflow-auto max-w-full">
        <div 
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) => 
            row.map((isActive, c) => (
              <button
                key={`${r}-${c}`}
                disabled={disabled}
                onClick={() => toggleTile(r, c)}
                className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-sm sm:rounded-md flex items-center justify-center transition-all duration-200 border-2 ${
                  isActive 
                    ? 'bg-gradient-to-br from-amber-300 to-orange-500 border-orange-300/80 shadow-[0_0_10px_rgba(245,158,11,0.4)] scale-100 z-10' 
                    : 'bg-slate-800/40 border-slate-700/30 hover:bg-slate-700/60 hover:border-blue-400/30 scale-95 hover:scale-100'
                }`}
              >
                {isActive && (
                  <div className="w-1/2 h-1/2 bg-white/30 rounded-full blur-[2px] -mt-2 -ml-2" />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-28 bg-rose-500 text-white font-bold px-8 py-4 rounded-2xl shadow-[0_10px_40px_rgba(225,29,72,0.4)] border-b-4 border-rose-700 z-50 text-center"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      {!disabled && (
        <div className="flex gap-4 mt-8">
          <button 
            onClick={handleReset}
            className="px-6 py-4 bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
          >
            Reset Board
          </button>
          {onSubmit && (
            <button 
              onClick={handleSubmit}
              className="px-8 sm:px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border-b-4 border-emerald-700 transition-all active:translate-y-1 active:border-b-0"
            >
              Done
            </button>
          )}
        </div>
      )}
    </div>
  );
}
