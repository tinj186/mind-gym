'use client';

import React from 'react';

/**
 * NUMBER_SEQUENCE_BLOCKS
 * Renders a horizontal or vertical chain of geometric nodes containing numbers,
 * connected by directional arrows with optional rule badges.
 *
 * Props:
 * - data.nodes: array of values/strings (e.g., ["45000", "46500", "?", "49500"])
 * - data.arrowLabels: array of strings connecting the nodes (e.g., ["+ 500", "+ 500", "+ 500"] or ["?", "?", "?"])
 * - data.orientation: "horizontal" (default) or "vertical"
 * - data.nodeShape: "square" (default) or "circle"
 */
export default function NumberSequenceBlocks({ data }) {
  if (!data) return null;

  const rawNodes = data.nodes || data.items || data.sequence || [];
  if (!Array.isArray(rawNodes) || rawNodes.length === 0) return null;

  const arrowLabels = Array.isArray(data.arrowLabels) ? data.arrowLabels : [];
  const isVertical = data.orientation === 'vertical';
  const nodeShape = data.nodeShape || 'square';
  const roundedClass = nodeShape === 'circle' ? 'rounded-full' : 'rounded-2xl sm:rounded-3xl';

  return (
    <div className="my-8 w-full max-w-4xl mx-auto p-6 sm:p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-200 select-none shadow-sm">
      <div
        className={`flex ${
          isVertical
            ? 'flex-col items-center justify-center gap-4'
            : 'flex-row flex-wrap items-center justify-center gap-2 sm:gap-4'
        }`}
      >
        {rawNodes.map((nodeVal, idx) => {
          const isMissing = nodeVal === '?' || nodeVal === '' || nodeVal === null || nodeVal === undefined;
          const displayVal = isMissing ? '?' : (typeof nodeVal === 'number' ? nodeVal.toLocaleString() : String(nodeVal));
          const hasArrow = idx < rawNodes.length - 1;
          const arrowLabel = arrowLabels[idx] ?? '';
          const isArrowMissing = arrowLabel === '?' || arrowLabel === '???';

          return (
            <React.Fragment key={idx}>
              {/* Geometric Number Node */}
              <div
                className={`relative min-w-20 sm:min-w-24 h-16 sm:h-20 px-3 sm:px-5 flex items-center justify-center border-4 transition-all duration-200 ${roundedClass} ${
                  isMissing
                    ? 'bg-amber-50 border-amber-500 shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] animate-pulse'
                    : 'bg-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5'
                }`}
              >
                <span
                  className={`font-black tracking-tight ${
                    isMissing
                      ? 'text-amber-600 text-2xl sm:text-3xl'
                      : displayVal.length > 6
                      ? 'text-sm sm:text-base text-slate-900'
                      : displayVal.length > 4
                      ? 'text-base sm:text-lg text-slate-900'
                      : 'text-xl sm:text-2xl text-slate-900'
                  }`}
                >
                  {displayVal}
                </span>

                {/* Sub-label for Term index if provided */}
                {data.showIndices && (
                  <span className="absolute -bottom-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Term {idx + 1}
                  </span>
                )}
              </div>

              {/* Directional Connector Arrow with optional label */}
              {hasArrow && (
                <div
                  className={`flex ${
                    isVertical ? 'flex-row items-center gap-2 py-1' : 'flex-col items-center justify-center gap-1 px-1'
                  }`}
                >
                  {arrowLabel !== '' && (
                    <div
                      className={`font-black tracking-tight transition-all duration-200 ${
                        isArrowMissing
                          ? 'px-2.5 py-0.5 bg-amber-400 text-slate-950 border-2 border-slate-900 text-xs sm:text-sm rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] animate-bounce'
                          : 'px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] sm:text-xs rounded-lg font-bold'
                      }`}
                    >
                      {arrowLabel}
                    </div>
                  )}

                  <div className="text-slate-400 font-black text-2xl sm:text-3xl leading-none">
                    {isVertical ? '↓' : '➔'}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
