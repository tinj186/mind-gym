"use client";

import React from 'react';

/**
 * GridArrayVisualizer
 * Visually proves factors and multiples by arranging items in a grid of rows and columns.
 * 
 * Props (data):
 * - rows: number (e.g. 4)
 * - columns: number (e.g. 6)
 * - totalItems: number (rows * columns)
 * - itemShape: "dot" | "square" | "star" | "box"
 * - rowLabel: string (e.g. "4 rows")
 * - colLabel: string (e.g. "6 items per row")
 * - title: string
 * - highlightRows: number[] (indices of rows to highlight)
 * - showEquation: boolean
 */
export default function GridArrayVisualizer({ data = {} }) {
  if (!data) return null;

  const rows = Math.min(12, Math.max(1, data.rows || 4));
  const columns = Math.min(15, Math.max(1, data.columns || 6));
  const totalItems = data.totalItems || (rows * columns);
  const itemShape = data.itemShape || 'dot';
  const rowLabel = data.rowLabel || `${rows} rows`;
  const colLabel = data.colLabel || `${columns} per row`;
  const title = data.title || `Grid Array: ${rows} × ${columns}`;

  const highlightRows = new Set(data.highlightRows || []);

  const renderItem = (r, c) => {
    const isRowHighlighted = highlightRows.has(r);

    if (itemShape === 'square') {
      return (
        <div 
          key={`item-${r}-${c}`}
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md border-2 flex items-center justify-center transition-all ${
            isRowHighlighted 
              ? 'bg-amber-400 border-amber-600 shadow-xs' 
              : 'bg-indigo-500 border-indigo-700 shadow-2xs'
          }`}
        />
      );
    }

    if (itemShape === 'star') {
      return (
        <div 
          key={`item-${r}-${c}`}
          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm"
        >
          ⭐
        </div>
      );
    }

    // Default: dot / circle
    return (
      <div 
        key={`item-${r}-${c}`}
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isRowHighlighted 
            ? 'bg-amber-400 border-amber-600 shadow-xs' 
            : 'bg-indigo-500 border-indigo-700 shadow-2xs'
        }`}
      />
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            {title}
          </h4>
        </div>
        <span className="text-xs font-black px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-mono">
          Total: {totalItems}
        </span>
      </div>

      {/* Grid Canvas with Dimensions */}
      <div className="flex flex-col items-center justify-center py-2 overflow-x-auto">
        {/* Top Column Header / Label */}
        <div className="flex items-center justify-center mb-2 text-xs font-black uppercase text-indigo-600 tracking-wider">
          <span>{colLabel}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Left Row Header / Label with vertical indicator */}
          <div className="flex items-center gap-1.5 pr-2 border-r-2 border-indigo-200 py-1">
            <span className="text-xs font-black uppercase text-indigo-600 tracking-wider [writing-mode:vertical-lr] rotate-180 text-center">
              {rowLabel}
            </span>
          </div>

          {/* Array Container */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
            {Array.from({ length: rows }).map((_, r) => (
              <div key={`row-${r}`} className="flex items-center gap-2">
                {Array.from({ length: columns }).map((_, c) => renderItem(r, c))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Equation Footer */}
      {data.showEquation !== false && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-3 font-mono text-xs font-black text-slate-700">
          <span className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            {rows} × {columns} = {totalItems}
          </span>
          <span className="text-slate-400">or</span>
          <span className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            {totalItems} ÷ {rows} = {columns}
          </span>
        </div>
      )}
    </div>
  );
}

