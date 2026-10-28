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
 * - hideCardStyles: boolean to strip redundant outer card frame when already wrapped
 */
export default function NumberSequenceBlocks({ data, hideCardStyles = false }) {
  if (!data) return null;

  const rawNodes = data.nodes || data.items || data.sequence || [];
  if (!Array.isArray(rawNodes) || rawNodes.length === 0) return null;

  const arrowLabels = Array.isArray(data.arrowLabels) ? data.arrowLabels : [];
  const isVertical = data.orientation === 'vertical';
  const nodeShape = data.nodeShape || 'square';
  const nodeCount = rawNodes.length;

  // Auto-adjust layout sizing so any sequence (4, 5, 6, 8+ nodes) is completely visible without clipping
  const config = nodeCount >= 8
    ? {
        gap: 'gap-1 sm:gap-1.5 md:gap-2',
        nodeWidth: 'min-w-[3.4rem] sm:min-w-[3.8rem] md:min-w-[4.4rem] flex-1 max-w-[5.2rem]',
        nodeHeight: 'h-10 sm:h-11 md:h-12',
        nodePx: 'px-1 sm:px-1.5',
        borderWidth: 'border-2 sm:border-[3px]',
        roundedClass: nodeShape === 'circle' ? 'rounded-full' : 'rounded-xl sm:rounded-2xl',
        arrowSize: 'text-xs sm:text-sm',
        arrowPx: 'px-0.5 sm:px-1',
        fontLarge: 'text-xs sm:text-sm md:text-base font-black',
        fontMedium: 'text-[11px] sm:text-xs md:text-sm font-black tracking-tight',
        fontSmall: 'text-[10px] sm:text-[11px] md:text-xs font-black tracking-tighter',
      }
    : nodeCount >= 6
    ? {
        gap: 'gap-1.5 sm:gap-2 md:gap-2.5',
        nodeWidth: 'min-w-[4rem] sm:min-w-[4.6rem] md:min-w-[5.2rem] flex-1 max-w-[6rem]',
        nodeHeight: 'h-11 sm:h-12 md:h-13',
        nodePx: 'px-1.5 sm:px-2',
        borderWidth: 'border-[3px] sm:border-4',
        roundedClass: nodeShape === 'circle' ? 'rounded-full' : 'rounded-xl sm:rounded-2xl',
        arrowSize: 'text-sm sm:text-base',
        arrowPx: 'px-0.5 sm:px-1',
        fontLarge: 'text-sm sm:text-base md:text-lg font-black',
        fontMedium: 'text-xs sm:text-sm font-black tracking-tight',
        fontSmall: 'text-[11px] sm:text-xs font-black tracking-tightest',
      }
    : nodeCount === 5
    ? {
        gap: 'gap-2 sm:gap-2.5 md:gap-3',
        nodeWidth: 'min-w-[4.8rem] sm:min-w-[5.4rem] md:min-w-[6rem] flex-1 max-w-[6.8rem]',
        nodeHeight: 'h-12 sm:h-13 md:h-15',
        nodePx: 'px-2 sm:px-2.5',
        borderWidth: 'border-4',
        roundedClass: nodeShape === 'circle' ? 'rounded-full' : 'rounded-2xl sm:rounded-3xl',
        arrowSize: 'text-base sm:text-lg',
        arrowPx: 'px-1 sm:px-1.5',
        fontLarge: 'text-sm sm:text-base md:text-lg font-black',
        fontMedium: 'text-xs sm:text-sm md:text-base font-black',
        fontSmall: 'text-[11px] sm:text-xs md:text-sm font-black',
      }
    : {
        gap: 'gap-2.5 sm:gap-3 md:gap-4',
        nodeWidth: 'min-w-16 sm:min-w-20 md:min-w-24 flex-1 max-w-[7.5rem]',
        nodeHeight: 'h-14 sm:h-16 md:h-18',
        nodePx: 'px-2.5 sm:px-4',
        borderWidth: 'border-4',
        roundedClass: nodeShape === 'circle' ? 'rounded-full' : 'rounded-2xl sm:rounded-3xl',
        arrowSize: 'text-xl sm:text-2xl',
        arrowPx: 'px-1.5 sm:px-2',
        fontLarge: 'text-base sm:text-xl md:text-2xl font-black',
        fontMedium: 'text-sm sm:text-base md:text-lg font-black',
        fontSmall: 'text-xs sm:text-sm md:text-base font-black',
      };

  const wrapperClass = hideCardStyles
    ? 'w-full select-none py-1'
    : 'my-6 w-full max-w-4xl mx-auto p-3 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-3xl border-2 border-slate-200 select-none shadow-sm';

  return (
    <div className={wrapperClass}>
      <div className="w-full overflow-x-auto py-2">
        <div
          className={`flex ${
            isVertical
              ? 'flex-col items-center justify-center gap-3'
              : `flex-row flex-nowrap items-center justify-center min-w-full w-fit mx-auto px-1 ${config.gap}`
          }`}
        >
          {rawNodes.map((nodeVal, idx) => {
            const isMissing = nodeVal === '?' || nodeVal === '' || nodeVal === null || nodeVal === undefined;
            const isVariable = nodeVal === 'A' || nodeVal === 'B' || nodeVal === 'X' || nodeVal === 'Y';
            const displayVal = isMissing ? '?' : (typeof nodeVal === 'number' ? nodeVal.toLocaleString() : String(nodeVal));
            const hasArrow = idx < rawNodes.length - 1;
            const arrowLabel = arrowLabels[idx] ?? '';
            const isArrowMissing = arrowLabel === '?' || arrowLabel === '???';

            const fontClass = isMissing || isVariable
              ? config.fontLarge
              : displayVal.length >= 6
              ? config.fontSmall
              : displayVal.length >= 5
              ? config.fontMedium
              : config.fontLarge;

            const nodeColor = data.nodeColors?.[idx];
            let colorClasses = '';
            let textClass = '';

            if (isMissing) {
              if (nodeColor === 'blue') {
                colorClasses = `bg-blue-100 border-blue-500 ${nodeCount >= 8 ? 'shadow-[2px_2px_0px_0px_rgba(59,130,246,1)]' : 'shadow-[3px_3px_0px_0px_rgba(59,130,246,1)]'} animate-pulse`;
                textClass = 'text-blue-600';
              } else {
                colorClasses = `bg-amber-50 border-amber-500 ${nodeCount >= 8 ? 'shadow-[2px_2px_0px_0px_rgba(245,158,11,1)]' : 'shadow-[3px_3px_0px_0px_rgba(245,158,11,1)]'} animate-pulse`;
                textClass = 'text-amber-600';
              }
            } else if (isVariable) {
              if (nodeColor === 'blue') {
                colorClasses = `bg-blue-100 border-blue-600 ${nodeCount >= 8 ? 'shadow-[2px_2px_0px_0px_rgba(37,99,235,1)]' : 'shadow-[3px_3px_0px_0px_rgba(37,99,235,1)]'} hover:-translate-y-0.5`;
                textClass = 'text-blue-700';
              } else if (nodeColor === 'orange' || nodeColor === 'amber') {
                colorClasses = `bg-amber-100 border-amber-600 ${nodeCount >= 8 ? 'shadow-[2px_2px_0px_0px_rgba(217,119,6,1)]' : 'shadow-[3px_3px_0px_0px_rgba(217,119,6,1)]'} hover:-translate-y-0.5`;
                textClass = 'text-amber-800';
              } else {
                colorClasses = `bg-indigo-50 border-indigo-600 ${nodeCount >= 8 ? 'shadow-[2px_2px_0px_0px_rgba(79,70,229,1)]' : 'shadow-[3px_3px_0px_0px_rgba(79,70,229,1)]'} hover:-translate-y-0.5`;
                textClass = 'text-indigo-700';
              }
            } else if (nodeColor === 'blue') {
              colorClasses = `bg-blue-50 border-blue-600 ${nodeCount >= 8 ? 'shadow-[2px_2px_0px_0px_rgba(37,99,235,1)]' : 'shadow-[3px_3px_0px_0px_rgba(37,99,235,1)]'} hover:-translate-y-0.5`;
              textClass = 'text-blue-800';
            } else if (nodeColor === 'orange' || nodeColor === 'amber') {
              colorClasses = `bg-amber-50 border-amber-600 ${nodeCount >= 8 ? 'shadow-[2px_2px_0px_0px_rgba(217,119,6,1)]' : 'shadow-[3px_3px_0px_0px_rgba(217,119,6,1)]'} hover:-translate-y-0.5`;
              textClass = 'text-amber-800';
            } else {
              colorClasses = `bg-white border-slate-900 ${nodeCount >= 8 ? 'shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'} hover:-translate-y-0.5`;
              textClass = 'text-slate-900';
            }

            return (
              <React.Fragment key={idx}>
                {/* Geometric Number Node */}
                <div
                  className={`relative ${config.nodeWidth} ${config.nodeHeight} ${config.nodePx} flex items-center justify-center ${config.borderWidth} transition-all duration-200 shrink-0 ${config.roundedClass} ${colorClasses}`}
                >
                  <span
                    className={`font-black text-center whitespace-nowrap leading-none select-text ${fontClass} ${textClass}`}
                  >
                    {displayVal}
                  </span>
                </div>

                {/* Directional Connector Arrow */}
                {hasArrow && (
                  <div
                    className={`flex shrink-0 ${
                      isVertical ? 'flex-row items-center gap-2 py-1' : `flex-col items-center justify-center gap-1 ${config.arrowPx}`
                    }`}
                  >
                    {/* Only show rule badge if rule is unknown ('?') */}
                    {isArrowMissing && (
                      <div className="px-2 py-0.5 bg-amber-400 text-slate-950 border-2 border-slate-900 text-xs sm:text-sm rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] animate-bounce font-black">
                        ?
                      </div>
                    )}

                    <div className={`text-slate-400 font-bold leading-none ${config.arrowSize}`}>
                      {isVertical ? '↓' : '➔'}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
