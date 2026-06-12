// @ts-nocheck
'use client';

import React from 'react';
import { BarRow, ComparisonBracket } from '@/types/gym';

interface BarModelProps {
  rows?: BarRow[];
  brackets?: ComparisonBracket[];
  onAddUnit?: (rowId: string) => void;
  onRemoveUnit?: (rowId: string) => void;
  onSplit?: (rowId: string) => void;
  onJoin?: (rowId: string) => void;
  onSegmentClick?: (rowId: string, segId: string) => void;
  onDeleteRow?: (rowId: string) => void;
  onDeleteBracket?: (bracketId: string) => void;
}

/**
 * BarModel Component - Phase 2: The Primary Math Engine
 * Interactive, unit-based logic builder using a "Block Grid" system.
 */
export default function BarModel({ 
  rows = [], 
  brackets = [],
  onAddUnit, 
  onRemoveUnit,
  onSplit, 
  onJoin,
  onSegmentClick, 
  onDeleteRow,
  onDeleteBracket
}: BarModelProps) {
  // @ts-ignore
  if (!rows || rows.length === 0) {
    return (
      <div className="h-48 w-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-300 font-black uppercase tracking-widest text-xs">
        Click "Add Entity" to begin building
      </div>
    );
  }

  // --- Dynamic Scaling Logic ---
  // Calculate the maximum units across all rows to determine if we need to scale down
  const maxTotalUnits = rows.reduce((max, row) => {
    const rowUnits = row.segments.reduce((sum, seg) => sum + seg.value, 0);
    return Math.max(max, rowUnits);
  }, 0);

  const BASE_UNIT_SIZE = 48; 
  const MAX_BAR_ZONE_WIDTH = 480; // The threshold before we start shrinking units
  const UNIT_SIZE = maxTotalUnits * BASE_UNIT_SIZE > MAX_BAR_ZONE_WIDTH
    ? Math.max(16, MAX_BAR_ZONE_WIDTH / maxTotalUnits) // Shrink, but never below 16px
    : BASE_UNIT_SIZE;

  const LABEL_WIDTH = 96; // Matching the w-24 (24 * 4px)
  const ROW_HEIGHT = 48;  // h-12
  const ROW_GAP = 24;     // space-y-6
  const CONTAINER_PADDING = 24; // py-6

  return (
    <div className="w-full py-6 space-y-6 select-none relative">
      {rows.map((row, rowIndex) => (
        <div key={row.id} className="flex items-center gap-4 group relative">
          <div className="w-24 text-right flex-shrink-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Entity</span>
            <span className="text-sm font-black text-slate-900 truncate block">{row.title}</span>
          </div>

          <div className="flex-1 flex items-center gap-3 min-w-0">
            <div className="flex border-2 border-slate-900 rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] bg-white">
              {row.segments.map((seg) => (
                <div
                  key={seg.id}
                  onClick={() => onSegmentClick?.(row.id, seg.id)}
                  className={`h-12 flex items-center justify-center border-r-2 last:border-r-0 border-slate-900 transition-all cursor-pointer hover:bg-opacity-80
                    ${seg.isUnknown ? 'bg-amber-100' : (seg.color || 'bg-blue-500')}`}
                  style={{ width: `${seg.value * UNIT_SIZE}px` }}
                >
                  <span className={`font-black text-sm ${seg.isUnknown ? 'text-amber-600' : 'text-white'}`}>
                    {seg.isUnknown ? '?' : (seg.label || '')}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onAddUnit?.(row.id)}
                className="p-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-slate-600 transition-colors"
                title="Add Unit"
              >
                <span className="font-bold text-lg">+</span>
              </button>
              <button 
                onClick={() => onRemoveUnit?.(row.id)}
                className="p-2 bg-slate-100 hover:bg-slate-300 hover:text-slate-900 rounded-lg text-slate-600 transition-colors"
                title="Remove Unit"
                disabled={row.segments.length <= 1}
              >
                <span className="font-bold text-lg">−</span>
              </button>
              <button 
                onClick={() => onJoin?.(row.id)}
                className="p-2 bg-slate-100 hover:bg-indigo-500 hover:text-white rounded-lg text-slate-600 transition-colors"
                title="Join Units"
                disabled={row.segments.length <= 1}
              >
                <span className="text-lg">🔗</span>
              </button>
              <button 
                onClick={() => onSplit?.(row.id)}
                className="p-2 bg-slate-100 hover:bg-amber-500 hover:text-white rounded-lg text-slate-600 transition-colors"
                title="Split Units"
              >
                <span className="text-lg">✂️</span>
              </button>
              <button 
                onClick={() => onDeleteRow?.(row.id)}
                className="p-2 bg-slate-100 hover:bg-red-500 hover:text-white rounded-lg text-slate-600 transition-colors"
                title="Remove Entity"
              >
                <span className="text-lg">✕</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Comparison Brackets Layer */}
      {brackets.length > 0 && (
        <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ left: LABEL_WIDTH + 16 }}>
          {brackets.map((bracket, index) => {
            const fromRow = rows.find(r => r.id === bracket.fromBarId);
            const toRow = rows.find(r => r.id === bracket.toBarId);
            if (!fromRow || !toRow) return null;

            const fromVal = fromRow.segments.reduce((acc, s) => acc + s.value, 0);
            const toVal = toRow.segments.reduce((acc, s) => acc + s.value, 0);
            
            const startX = Math.min(fromVal, toVal) * UNIT_SIZE;
            const endX = Math.max(fromVal, toVal) * UNIT_SIZE;
            const fromIdx = rows.indexOf(fromRow);
            const toIdx = rows.indexOf(toRow);

            // Smarter positioning: originate from the shorter bar
            // pointing towards the vertical gap between the two compared rows.
            const shorterIdx = fromVal < toVal ? fromIdx : toIdx;
            const longerIdx = fromVal < toVal ? toIdx : fromIdx;
            const isTopRowShorter = shorterIdx < longerIdx;
            
            const rowTop = CONTAINER_PADDING + (shorterIdx * (ROW_HEIGHT + ROW_GAP));
            const yPos = rowTop + (ROW_HEIGHT / 2); // Anchor to the vertical middle of the bar
            const offset = isTopRowShorter ? -28 : 28; // Move away from the longer entity
            const textY = yPos + (isTopRowShorter ? -42 : 42); // Position label outside the bracket

            return (
              <g key={bracket.id}>
                <path
                  d={`M ${startX} ${yPos} L ${startX} ${yPos + offset} L ${endX} ${yPos + offset} L ${endX} ${yPos}`}
                  fill="none"
                  className="stroke-slate-900 stroke-2"
                />
                <g className="pointer-events-auto group/bracket">
                  <text
                    x={(startX + endX) / 2}
                    y={textY}
                    textAnchor="middle"
                    className="fill-slate-900 font-black text-[10px] uppercase"
                  >
                    {Math.abs(fromVal - toVal)}
                  </text>
                  {/* Small Delete Button next to the label */}
                  <g 
                    className="cursor-pointer opacity-0 group-hover/bracket:opacity-100 transition-opacity"
                    onClick={() => onDeleteBracket?.(bracket.id)}
                  >
                    <circle cx={(startX + endX) / 2 + 18} cy={textY - 3} r="6" className="fill-slate-200 hover:fill-red-500 transition-colors" />
                    <text
                      x={(startX + endX) / 2 + 18}
                      y={textY}
                      textAnchor="middle"
                      className="fill-slate-600 hover:fill-white font-bold text-[8px]"
                    >
                      ✕
                    </text>
                  </g>
                </g>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}