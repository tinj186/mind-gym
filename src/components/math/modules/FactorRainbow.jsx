"use client";

import React from 'react';

/**
 * FactorRainbow
 * Visualizes factor pairs as concentric rainbow arcs connecting factor nodes along a baseline.
 * 
 * Props (data):
 * - targetNumber: number (e.g. 24, 36)
 * - factors: number[] (sorted array of factors, e.g. [1, 2, 3, 4, 6, 8, 12, 24])
 * - pairs: [number, number][] (pairs that multiply to target, e.g. [[1, 24], [2, 12], [3, 8], [4, 6]])
 * - hiddenIndices: number[] (indices in `factors` to display as '?')
 * - hiddenValue: number (specific factor value to replace with '?')
 * - title: string
 * - showEquations: boolean
 */
export default function FactorRainbow({ data = {} }) {
  if (!data) return null;

  const targetNumber = data.targetNumber || 24;
  
  // Calculate factors if not provided
  let factors = data.factors;
  if (!factors || factors.length === 0) {
    const fSet = new Set();
    for (let i = 1; i * i <= targetNumber; i++) {
      if (targetNumber % i === 0) {
        fSet.add(i);
        fSet.add(targetNumber / i);
      }
    }
    factors = Array.from(fSet).sort((a, b) => a - b);
  }

  // Derive pairs if not provided
  let pairs = data.pairs;
  if (!pairs || pairs.length === 0) {
    pairs = [];
    const len = factors.length;
    for (let i = 0; i < Math.ceil(len / 2); i++) {
      pairs.push([factors[i], factors[len - 1 - i]]);
    }
  }

  const hiddenIndices = new Set(data.hiddenIndices || []);
  if (data.hiddenIndex !== undefined) {
    hiddenIndices.add(data.hiddenIndex);
  }
  if (data.hiddenValue !== undefined) {
    const idx = factors.indexOf(data.hiddenValue);
    if (idx !== -1) hiddenIndices.add(idx);
  }

  // Rainbow color palette
  const rainbowColors = [
    { stroke: '#ef4444', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-400' },     // Red
    { stroke: '#f97316', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-400' }, // Orange
    { stroke: '#eab308', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-400' },   // Amber
    { stroke: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-400' }, // Green
    { stroke: '#06b6d4', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-400' },     // Cyan
    { stroke: '#6366f1', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-400' }, // Indigo
    { stroke: '#a855f7', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-400' }, // Purple
    { stroke: '#ec4899', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-400' }      // Pink
  ];

  const svgWidth = Math.max(500, factors.length * 62 + 60);
  const baselineY = 170;
  const svgHeight = 220;

  const nodePositions = factors.map((_, i) => {
    const margin = 40;
    const availableWidth = svgWidth - margin * 2;
    const step = availableWidth / (factors.length - 1 || 1);
    return margin + i * step;
  });

  return (
    <div className="w-full max-w-2xl mx-auto my-6 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm select-none">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            {data.title || `Factor Rainbow for ${targetNumber}`}
          </h4>
        </div>
        <span className="text-xs font-black px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-mono">
          Target: {targetNumber}
        </span>
      </div>

      {/* SVG Rainbow Display */}
      <div className="relative w-full overflow-x-auto py-2">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-auto min-w-[480px] max-h-[220px]"
          style={{ overflow: 'visible' }}
        >
          {/* Horizontal Baseline */}
          <line
            x1="20"
            y1={baselineY}
            x2={svgWidth - 20}
            y2={baselineY}
            stroke="#e2e8f0"
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* Semicircular Rainbow Arcs for Factor Pairs */}
          {pairs.map((pair, pIdx) => {
            const [f1, f2] = pair;
            const idx1 = factors.indexOf(f1);
            const idx2 = factors.indexOf(f2);
            if (idx1 === -1 || idx2 === -1) return null;

            const x1 = nodePositions[idx1];
            const x2 = nodePositions[idx2];
            const color = rainbowColors[pIdx % rainbowColors.length];

            // If square number (f1 === f2), draw an upward loop
            if (idx1 === idx2) {
              const r = 24;
              return (
                <g key={`pair-square-${pIdx}`}>
                  <path
                    d={`M ${x1 - 8} ${baselineY - 14} C ${x1 - 25} ${baselineY - 60}, ${x1 + 25} ${baselineY - 60}, ${x1 + 8} ${baselineY - 14}`}
                    fill="none"
                    stroke={color.stroke}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="4 3"
                  />
                  <text
                    x={x1}
                    y={baselineY - 55}
                    textAnchor="middle"
                    className="text-[10px] font-black fill-slate-500 font-mono"
                  >
                    {f1}×{f1}
                  </text>
                </g>
              );
            }

            const span = Math.abs(x2 - x1);
            const apexY = Math.max(25, baselineY - span * 0.45);
            const cp1X = x1 + span * 0.15;
            const cp2X = x2 - span * 0.15;

            return (
              <g key={`pair-${pIdx}`}>
                <path
                  d={`M ${x1} ${baselineY - 14} C ${cp1X} ${apexY}, ${cp2X} ${apexY}, ${x2} ${baselineY - 14}`}
                  fill="none"
                  stroke={color.stroke}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Factor Node Badges along Baseline */}
          {factors.map((val, idx) => {
            const cx = nodePositions[idx];
            const isHidden = hiddenIndices.has(idx);
            const displayVal = isHidden ? '?' : val;

            return (
              <g key={`node-${idx}`} transform={`translate(${cx}, ${baselineY})`}>
                {/* Node Circle */}
                <circle
                  cx="0"
                  cy="0"
                  r="18"
                  fill={isHidden ? "#fef3c7" : "#ffffff"}
                  stroke={isHidden ? "#f59e0b" : "#475569"}
                  strokeWidth={isHidden ? "3" : "2.5"}
                  className="filter drop-shadow-xs"
                />
                {/* Node Value Text */}
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  fill={isHidden ? "#b45309" : "#0f172a"}
                  className="font-mono text-sm font-black select-none pointer-events-none"
                >
                  {displayVal}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Optional Equation Summary Footer - Only shown when explicitly requested */}
      {data.showEquations === true && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-center">
          {pairs.map(([f1, f2], pIdx) => {
            const isHiddenPair = (hiddenIndices.has(factors.indexOf(f1)) || hiddenIndices.has(factors.indexOf(f2)));
            const color = rainbowColors[pIdx % rainbowColors.length];
            return (
              <span
                key={`eq-${pIdx}`}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border font-mono ${
                  isHiddenPair ? 'bg-amber-50 text-amber-900 border-amber-300 animate-pulse font-black' : `${color.bg} ${color.text} ${color.border}`
                }`}
              >
                {hiddenIndices.has(factors.indexOf(f1)) ? '?' : f1} × {hiddenIndices.has(factors.indexOf(f2)) ? '?' : f2} = {targetNumber}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

