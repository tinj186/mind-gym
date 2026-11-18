"use client";

import React from 'react';

/**
 * VennDiagramVisualizer
 * Visualizes the intersection of two sets (e.g., unique factors of A, unique factors of B,
 * and common factors in the overlapping center).
 *
 * Props (data):
 * - title?: string
 * - setALabel: string
 * - setBLabel: string
 * - setAValues: (number | string)[]
 * - setBValues: (number | string)[]
 * - intersectionValues: (number | string)[]
 * - hiddenNodes?: (number | string)[] (values or 'intersection' to mask as '?')
 */
export default function VennDiagramVisualizer({ data = {} }) {
  if (!data) return null;

  const {
    title = 'Common Factors Venn Diagram',
    setALabel = 'Set A',
    setBLabel = 'Set B',
    setAValues = [],
    setBValues = [],
    intersectionValues = [],
    hiddenNodes = [],
  } = data;

  const hiddenSet = new Set((hiddenNodes || []).map((v) => String(v)));
  const hideAllIntersection = hiddenSet.has('intersection') || hiddenSet.has('*');

  const renderBadge = (val, idx, variant) => {
    const isHidden =
      (variant === 'intersection' && hideAllIntersection) ||
      hiddenSet.has(String(val));

    const styles =
      variant === 'A'
        ? 'bg-blue-50 text-blue-800 border-blue-300'
        : variant === 'B'
        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
        : 'bg-indigo-100 text-indigo-900 border-indigo-400';

    return (
      <span
        key={`${variant}-${idx}`}
        className={`inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2.5 rounded-xl border-2 text-sm font-black font-mono shadow-xs ${
          isHidden
            ? 'bg-amber-50 text-amber-700 border-amber-400 border-dashed'
            : styles
        }`}
      >
        {isHidden ? '?' : val}
      </span>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            {title}
          </h4>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
          Set Intersection
        </span>
      </div>

      {/* Labels Row */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="text-xs font-black uppercase tracking-wide text-blue-700">
          {setALabel}
        </div>
        <div className="text-xs font-black uppercase tracking-wide text-indigo-700">
          Common
        </div>
        <div className="text-xs font-black uppercase tracking-wide text-emerald-700">
          {setBLabel}
        </div>
      </div>

      {/* Venn Diagram Regions */}
      <div className="relative flex flex-col sm:flex-row items-stretch justify-center gap-2 sm:gap-0">
        {/* Left Circle (Set A Only) */}
        <div className="flex-1 min-h-[160px] rounded-3xl sm:rounded-r-none border-2 border-blue-300 bg-blue-50/40 p-4 flex flex-col items-center justify-center sm:pr-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {setAValues.length > 0 ? (
              setAValues.map((v, i) => renderBadge(v, i, 'A'))
            ) : (
              <span className="text-xs font-bold text-slate-400 italic">None</span>
            )}
          </div>
        </div>

        {/* Center Overlap (Intersection) */}
        <div className="sm:w-44 min-h-[160px] sm:-mx-5 z-10 rounded-3xl border-2 border-indigo-400 bg-indigo-50/90 p-4 flex flex-col items-center justify-center shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {intersectionValues.length > 0 ? (
              intersectionValues.map((v, i) => renderBadge(v, i, 'intersection'))
            ) : (
              <span className="text-xs font-bold text-indigo-400 italic">?</span>
            )}
          </div>
        </div>

        {/* Right Circle (Set B Only) */}
        <div className="flex-1 min-h-[160px] rounded-3xl sm:rounded-l-none border-2 border-emerald-300 bg-emerald-50/40 p-4 flex flex-col items-center justify-center sm:pl-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {setBValues.length > 0 ? (
              setBValues.map((v, i) => renderBadge(v, i, 'B'))
            ) : (
              <span className="text-xs font-bold text-slate-400 italic">None</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

