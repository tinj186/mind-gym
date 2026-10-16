"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  PenTool, 
  Eraser, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Grid, 
  Maximize2, 
  Minimize2, 
  Check, 
  Sparkles,
  Hand,
  Pen,
  X
} from 'lucide-react';

/**
 * ScribbleBox
 * High-performance, iPad & Apple Pencil-optimized scratchpad canvas.
 * 
 * Solves:
 * 1. Scroll trapping: `touch-action: none;` prevents page bounce/scroll while scribbling.
 * 2. Palm rejection: Option to restrict input strictly to `pointerType === 'pen'`, ignoring palms/fingers.
 * 3. Retina scaling: Adapts to `window.devicePixelRatio` for razor-sharp strokes on iPad Retina displays.
 * 4. Apple Pencil Pressure: Dynamically scales stroke width with `event.pressure`.
 * 5. Stroke Smoothing: Uses mid-point quadratic Bezier curves for fluid ink lines.
 */
export default function ScribbleBox({
  title = "Math Working Space",
  initialHeight = 320,
  fullHeight = false,
  allowTouchByDefault = true,
  onStrokeCountChange,
  className = "",
  onClose = null
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Drawing state
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const currentStrokeRef = useRef([]);

  // History for Undo / Redo
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  // Config & UI State
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  const [color, setColor] = useState('#0f172a'); // slate-900 default
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [penOnlyMode, setPenOnlyMode] = useState(!allowTouchByDefault);
  const [gridStyle, setGridStyle] = useState('grid'); // 'grid' | 'dots' | 'lines' | 'blank'
  const [isExpanded, setIsExpanded] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Available ink colors tailored for math working
  const inkColors = [
    { label: 'Black', value: '#0f172a' },
    { label: 'Blue', value: '#2563eb' },
    { label: 'Purple', value: '#7c3aed' },
    { label: 'Red', value: '#dc2626' },
    { label: 'Green', value: '#16a34a' }
  ];

  // --------------------------------------------------------------------------
  // 1. Retina Scaling & Canvas Resizing
  // --------------------------------------------------------------------------
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return; // Prevent zero-size canvas wipe during slide animation!

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Cache current content before resizing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (canvas.width > 0 && canvas.height > 0) {
      tempCtx.drawImage(canvas, 0, 0);
    }

    // Set internal buffer dimensions to match physical Retina pixels
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    // Keep CSS dimensions matching layout display
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Scale context coordinate system so 1 canvas unit = 1 CSS pixel
    ctx.scale(dpr, dpr);

    // Restore previous drawings
    if (tempCanvas.width > 0 && tempCanvas.height > 0) {
      ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / dpr, tempCanvas.height / dpr);
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    const ro = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    return () => ro.disconnect();
  }, [resizeCanvas, isExpanded]);

  // --------------------------------------------------------------------------
  // 2. Snapshot & History Management
  // --------------------------------------------------------------------------
  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Truncate redo tree if we branched
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(snapshot);
    if (nextHistory.length > 20) {
      nextHistory.shift(); // keep memory bounded
    }

    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);

    if (onStrokeCountChange) {
      onStrokeCountChange(historyRef.current.length);
    }
  }, [onStrokeCountChange]);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const snapshot = historyRef.current[historyIndexRef.current];
    if (snapshot) {
      ctx.putImageData(snapshot, 0, 0);
    }
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const snapshot = historyRef.current[historyIndexRef.current];
    if (snapshot) {
      ctx.putImageData(snapshot, 0, 0);
    }
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    saveSnapshot();
  }, [saveSnapshot]);

  // Initial blank snapshot (only on fresh question init)
  useEffect(() => {
    if (historyRef.current.length > 0) return;
    const timer = setTimeout(() => {
      if (historyRef.current.length === 0) {
        saveSnapshot();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [saveSnapshot]);

  // --------------------------------------------------------------------------
  // 3. Pointer Events & Palm Rejection
  // --------------------------------------------------------------------------
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 0.5,
      pointerType: e.pointerType
    };
  };

  const handlePointerDown = (e) => {
    // 🛡️ Strict Palm Rejection Rule: Ignore touch if Pen-Only is active
    if (penOnlyMode && e.pointerType !== 'pen') {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capture pointer to track rapid pen strokes outside canvas margins
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if not supported
    }

    isDrawingRef.current = true;
    const pt = getCanvasCoords(e);
    lastPointRef.current = pt;
    currentStrokeRef.current = [pt];

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = strokeWidth * 6;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, strokeWidth * 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      // Pressure modulation: scale stroke width between 0.7x and 1.6x based on pencil pressure
      const dynamicWidth = e.pointerType === 'pen' && e.pressure > 0
        ? strokeWidth * (0.6 + e.pressure * 1.0)
        : strokeWidth;
      ctx.lineWidth = dynamicWidth;

      // Draw single dot if tapped
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, dynamicWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    if (penOnlyMode && e.pointerType !== 'pen') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pt = getCanvasCoords(e);
    const last = lastPointRef.current;
    if (!last) return;

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = strokeWidth * 6;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;

      // Modulate line width based on Apple Pencil pressure
      const dynamicWidth = e.pointerType === 'pen' && e.pressure > 0
        ? strokeWidth * (0.6 + e.pressure * 1.0)
        : strokeWidth;
      ctx.lineWidth = dynamicWidth;

      // Mid-point Quadratic Bezier Smoothing for silky handwriting
      const midPoint = {
        x: (last.x + pt.x) / 2,
        y: (last.y + pt.y) / 2
      };

      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.quadraticCurveTo(last.x, last.y, midPoint.x, midPoint.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }

    lastPointRef.current = pt;
    currentStrokeRef.current.push(pt);
  };

  const handlePointerUp = (e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    currentStrokeRef.current = [];

    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }

    saveSnapshot();
  };

  const handlePointerCancel = (e) => {
    handlePointerUp(e);
  };

  // Background pattern styling
  const getBackgroundStyle = () => {
    switch (gridStyle) {
      case 'grid':
        return {
          backgroundImage: `
            linear-gradient(to right, rgba(226, 232, 240, 0.7) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(226, 232, 240, 0.7) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        };
      case 'dots':
        return {
          backgroundImage: 'radial-gradient(circle, rgba(203, 213, 225, 0.9) 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px'
        };
      case 'lines':
        return {
          backgroundImage: 'linear-gradient(to bottom, transparent 27px, rgba(226, 232, 240, 0.9) 28px)',
          backgroundSize: '100% 28px'
        };
      default:
        return {};
    }
  };

  return (
    <div className={`flex flex-col ${fullHeight ? 'h-full flex-1 rounded-none border-0' : 'border-2 border-slate-300 rounded-3xl'} bg-slate-50 overflow-hidden shadow-sm transition-all duration-300 ${className}`}>
      {/* ==================================================================== */}
      {/* ROW 1: Title, iPad Badge & Global Actions (Palm, Paper, Undo, Clear) */}
      {/* ==================================================================== */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-white border-b border-slate-200 select-none min-h-[46px] flex-nowrap">
        {/* Left: Combined Single Title & iPad Ready badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-none">{title}</h4>
            <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">
              iPad Ready
            </span>
          </div>
        </div>

        {/* Right: Quick Global Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Palm Rejection Toggle */}
          <button
            type="button"
            onClick={() => setPenOnlyMode((prev) => !prev)}
            title={penOnlyMode ? "Pencil Only: Palms & touch ignored" : "Touch Allowed: Draw with finger or pencil"}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all border ${
              penOnlyMode 
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {penOnlyMode ? <Pen className="w-3 h-3 text-amber-700" /> : <Hand className="w-3 h-3 text-slate-500" />}
            <span className="text-[11px] hidden sm:inline">{penOnlyMode ? "Stylus Only" : "All Touch"}</span>
          </button>

          {/* Grid Paper Toggle */}
          <button
            type="button"
            title="Toggle Paper: Grid / Dots / Lines / Blank"
            onClick={() => {
              const modes = ['grid', 'dots', 'lines', 'blank'];
              const nextIdx = (modes.indexOf(gridStyle) + 1) % modes.length;
              setGridStyle(modes[nextIdx]);
            }}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all border border-transparent hover:border-slate-200"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Undo */}
          <button
            type="button"
            title="Undo"
            disabled={!canUndo}
            onClick={undo}
            className={`p-1.5 rounded-lg transition-all ${
              canUndo 
                ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-90' 
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Redo */}
          <button
            type="button"
            title="Redo"
            disabled={!canRedo}
            onClick={redo}
            className={`p-1.5 rounded-lg transition-all ${
              canRedo 
                ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-90' 
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Clear */}
          <button
            type="button"
            title="Clear all ink"
            onClick={clearCanvas}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Expand / Minimize (when not in fullHeight mode) */}
          {!fullHeight && (
            <button
              type="button"
              title={isExpanded ? "Collapse height" : "Expand height"}
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {/* Close Button for Drawer Mode */}
          {onClose && (
            <button
              type="button"
              title="Close Scratchpad"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all ml-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ROW 2: Drawing Tools (Pen, Eraser, Colors & Sizes) - 100% Stable     */}
      {/* ==================================================================== */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 bg-slate-100 border-b border-slate-200 select-none min-h-[46px] flex-nowrap">
        {/* Tool Selectors: Pen & Eraser */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setTool('pen')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              tool === 'pen'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Pen</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('eraser')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              tool === 'eraser'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Eraser</span>
          </button>
        </div>

        {/* Color Palette (Always visible, never unmounted to prevent jumping!) */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-xl shadow-xs shrink-0">
          {inkColors.map((c) => (
            <button
              key={c.value}
              type="button"
              title={tool === 'eraser' ? `Switch to Pen (${c.label})` : c.label}
              onClick={() => {
                setColor(c.value);
                setTool('pen'); // Tapping any color immediately switches back to Pen!
              }}
              className={`w-5 h-5 rounded-full transition-all flex items-center justify-center ${
                tool === 'pen' && color === c.value 
                  ? 'scale-125 ring-2 ring-indigo-500 ring-offset-1 opacity-100' 
                  : tool === 'eraser'
                  ? 'opacity-60 hover:opacity-100 hover:scale-110'
                  : 'hover:scale-110 opacity-80'
              }`}
              style={{ backgroundColor: c.value }}
            >
              {tool === 'pen' && color === c.value && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
            </button>
          ))}
        </div>

        {/* Stroke Width Selector */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-xl shadow-xs shrink-0">
          {[2, 4, 6].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setStrokeWidth(w)}
              title={tool === 'eraser' ? `Eraser Size: ${w === 2 ? 'Small' : w === 4 ? 'Medium' : 'Large'}` : `Pen Width: ${w === 2 ? 'Fine' : w === 4 ? 'Medium' : 'Bold'}`}
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                strokeWidth === w ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {w === 2 ? 'S' : w === 4 ? 'M' : 'L'}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Drawing Area with Touch-Action None */}
      <div 
        ref={containerRef}
        style={{
          height: fullHeight ? '100%' : (isExpanded ? 580 : initialHeight),
          touchAction: 'none', // 🛡️ CRITICAL: Traps touch events inside, stops iOS safari rubber-band scroll
          overscrollBehavior: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          ...getBackgroundStyle()
        }}
        className={`relative w-full ${fullHeight ? 'flex-1 h-full' : ''} bg-white cursor-crosshair overflow-hidden transition-[height] duration-200`}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{
            touchAction: 'none', // 🛡️ Direct canvas touch trap
            display: 'block',
            width: '100%',
            height: '100%'
          }}
        />

        {/* Empty State Prompt */}
        {!canUndo && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-300 select-none">
            <PenTool className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-bold tracking-wider uppercase opacity-70">
              Scribble working here with Apple Pencil or finger
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
