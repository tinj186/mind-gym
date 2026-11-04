import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Trash2, Edit3 } from 'lucide-react';

export default function InteractiveScribbleCanvas({ data, disabled }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [history, setHistory] = useState([]);

  const watermarkText = data?.watermarkText || "Draw your model, array, or working here";
  const showGrid = data?.backgroundGrid !== false;

  // Initialize and resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set actual canvas size matching container
    const width = 560;
    const height = 260;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2563eb'; // Blue-600
    ctx.lineWidth = 3;
  }, []);

  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory((prev) => [...prev, canvas.toDataURL()]);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    saveHistoryState();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setHasDrawn(false);
  };

  const handleUndo = () => {
    if (disabled || history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const prevHistory = [...history];
    const lastImageSrc = prevHistory.pop();
    setHistory(prevHistory);

    const img = new Image();
    img.src = lastImageSrc;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 560, 260);
      if (prevHistory.length === 0) setHasDrawn(false);
    };
  };

  return (
    <div className="flex flex-col items-center my-4 select-none">
      <div 
        ref={containerRef}
        className="relative w-full max-w-[560px] h-[260px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-inner"
        style={{
          touchAction: 'none',
          backgroundImage: showGrid 
            ? 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)' 
            : 'none',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Stylus / Drawing watermark */}
        {!hasDrawn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 dark:text-slate-500 gap-2">
            <Edit3 className="w-8 h-8 opacity-40 animate-pulse" />
            <span className="text-xs font-medium tracking-wide uppercase">{watermarkText}</span>
            <span className="text-[11px] opacity-60">Touch / Stylus / Mouse supported</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Floating toolbar buttons */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <button
            type="button"
            onClick={handleUndo}
            disabled={disabled || history.length === 0}
            className="p-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-40 transition-colors"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled || !hasDrawn}
            className="p-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded disabled:opacity-40 transition-colors"
            title="Clear canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 italic">
        Singapore Math Heuristic: Sketch your groupings or factor arrays before entering the working steps below.
      </p>
    </div>
  );
}

