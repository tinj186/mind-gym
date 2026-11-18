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
  const totalItems = data.totalItems ?? (rows * columns);
  const itemShape = data.itemShape || 'dot';
  const rowLabel = data.rowLabel || `${rows} rows`;
  const colLabel = data.colLabel || `${columns} per row`;
  const title = data.title || `Grid Array: ${rows} × ${columns}`;

  const showTotal = data.showTotal === true;
  const showUnknownTotal = data.showTotal === '?' || data.targetUnknown === 'total';
  const showEquation = data.showEquation === true;
  const hideEquationAnswer = data.hideEquationAnswer ?? (data.showTotal === '?' || data.targetUnknown === 'total' || !data.showTotal);

  const highlightRows = new Set(data.highlightRows || []);
  const isCompact = columns > 10;
  const isVeryCompact = columns > 16;

  const itemSizeClasses = isVeryCompact 
    ? 'w-3 h-3' 
    : isCompact 
      ? 'w-4 h-4' 
      : 'w-5 h-5 sm:w-6 sm:h-6';

  const renderItem = (r, c) => {
    const itemIndex = r * columns + c;
    if (data.totalItems !== undefined && itemIndex >= data.totalItems) {
      return (
        <div 
          key={`item-${r}-${c}`}
          className={`${itemSizeClasses} rounded-full border-2 border-dashed border-slate-300 bg-slate-100/40 flex items-center justify-center shrink-0 opacity-40`}
          title="Missing item"
        />
      );
    }

    const isRowHighlighted = highlightRows.has(r);

    if (itemShape === 'square') {
      return (
        <div 
          key={`item-${r}-${c}`}
          className={`${itemSizeClasses} rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
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
          className={`${itemSizeClasses} flex items-center justify-center text-xs shrink-0`}
        >
          ⭐
        </div>
      );
    }

    // Default: dot / circle
    return (
      <div 
        key={`item-${r}-${c}`}
        className={`${itemSizeClasses} rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
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
        {showTotal && (
          <span className="text-xs font-black px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-mono">
            Total: {totalItems}
          </span>
        )}
        {showUnknownTotal && (
          <span className="text-xs font-black px-3 py-1 bg-amber-50 text-amber-700 border border-amber-300 rounded-full font-mono">
            Total: ?
          </span>
        )}
      </div>

      {/* Grid Canvas with Dimensions */}
      <div className="w-full overflow-x-auto py-2">
        <div className="min-w-max mx-auto flex flex-col items-center px-4">
          {/* Top Column Header / Label */}
          <div className="flex items-center justify-center mb-2 text-xs font-black uppercase text-indigo-600 tracking-wider">
            <span>{colLabel}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Left Row Header / Label with vertical indicator */}
            <div className="shrink-0 flex items-center gap-1.5 pr-2.5 border-r-2 border-indigo-200 py-1">
              <span className="text-xs font-black uppercase text-indigo-600 tracking-wider [writing-mode:vertical-lr] rotate-180 text-center select-none">
                {rowLabel}
              </span>
            </div>

            {/* Array Container */}
            <div className="p-3 sm:p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-1.5 sm:space-y-2">
              {Array.from({ length: rows }).map((_, r) => (
                <div key={`row-${r}`} className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: columns }).map((_, c) => renderItem(r, c))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Equation Footer - Only shown when explicitly requested */}
      {showEquation && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-3 font-mono text-xs font-black text-slate-700">
          <span className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            {rows} × {columns} = {hideEquationAnswer ? '?' : totalItems}
          </span>
          <span className="text-slate-400">or</span>
          <span className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            {hideEquationAnswer ? '?' : totalItems} ÷ {rows} = {columns}
          </span>
        </div>
      )}
    </div>
  );
}

