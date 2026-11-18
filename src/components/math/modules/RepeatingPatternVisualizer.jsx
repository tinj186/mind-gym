"use client";

import React from 'react';

const COLOR_STYLES = {
  red: 'bg-rose-100 text-rose-800 border-rose-300',
  blue: 'bg-blue-100 text-blue-800 border-blue-300',
  green: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  yellow: 'bg-amber-100 text-amber-800 border-amber-300',
  purple: 'bg-purple-100 text-purple-800 border-purple-300',
  orange: 'bg-orange-100 text-orange-800 border-orange-300',
};

const renderShapeSvg = (shape) => {
  switch (String(shape || '').toLowerCase()) {
    case 'triangle':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <polygon points="12,3 22,20 2,20" />
        </svg>
      );
    case 'circle':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
        </svg>
      );
    case 'diamond':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <polygon points="12,2 22,12 12,22 2,12" />
        </svg>
      );
    default:
      return null;
  }
};

/**
 * REPEATING_PATTERN_VISUALIZER
 * Visualizes a repeating sequence of shapes or colors to support N-th term cycle problems.
 *
 * Props (data):
 * - title?: string
 * - cycle: Array<string | { label: string, shape?: string, color?: string }>
 * - targetPosition?: number
 * - showCycles?: number (default 2)
 */
export default function RepeatingPatternVisualizer({ data = {} }) {
  if (!data) return null;

  const {
    title = 'Repeating Pattern Sequence',
    cycle = [],
    targetPosition = null,
    showCycles = 2,
  } = data;

  if (!Array.isArray(cycle) || cycle.length === 0) return null;

  const items = [];
  const repeats = Math.max(1, Math.min(3, Number(showCycles) || 2));
  for (let r = 0; r < repeats; r++) {
    cycle.forEach((raw, idx) => {
      const item = typeof raw === 'string' ? { label: raw } : raw;
      items.push({
        pos: r * cycle.length + idx + 1,
        label: item.label || String(raw),
        shape: item.shape,
        color: item.color || String(item.label || '').toLowerCase(),
      });
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-6 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm select-none">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            {title}
          </h4>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
          Cycle Length: {cycle.length}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {items.map((item) => {
          const colorCls = COLOR_STYLES[String(item.color).toLowerCase()] || 'bg-slate-100 text-slate-800 border-slate-300';
          const icon = renderShapeSvg(item.shape);
          return (
            <div key={item.pos} className="flex flex-col items-center gap-1">
              <div className={`min-w-[3.25rem] h-12 px-3 rounded-2xl border-2 flex items-center justify-center gap-1.5 font-black text-xs shadow-xs ${colorCls}`}>
                {icon}
                <span>{item.label}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">#{item.pos}</span>
            </div>
          );
        })}

        <span className="px-2 text-lg font-black text-slate-400 self-start mt-2">•••</span>

        {targetPosition !== null && targetPosition !== undefined && (
          <div className="flex flex-col items-center gap-1">
            <div className="min-w-[3.5rem] h-12 px-3 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 text-amber-700 flex items-center justify-center font-black text-base shadow-xs">
              ?
            </div>
            <span className="text-[10px] font-mono font-black text-amber-700">
              #{Number(targetPosition).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

