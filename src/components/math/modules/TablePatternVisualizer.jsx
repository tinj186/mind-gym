'use client';

import React from 'react';

/**
 * TABLE_PATTERN_VISUALIZER
 * Renders a two-column or two-row sequence table (e.g. "Term Number" vs "Value",
 * or "Machine Input" vs "Machine Output") to help students track linear growth.
 *
 * Props:
 * - data.headers: array of 2 strings (e.g., ["Term Number", "Value"])
 * - data.rows: array of pairs (e.g., [["1", "45000"], ["2", "46500"], ["3", "?"], ["4", "49500"]])
 * - data.title: optional table title string
 */
export default function TablePatternVisualizer({ data, hideCardStyles = false }) {
  if (!data) return null;

  const headers = Array.isArray(data.headers) && data.headers.length >= 2
    ? data.headers
    : ['Term', 'Value'];

  const rows = Array.isArray(data.rows) ? data.rows : [];
  if (rows.length === 0) return null;

  const wrapperClass = hideCardStyles
    ? 'w-full max-w-xl mx-auto select-none py-2'
    : 'my-6 w-full max-w-xl mx-auto p-4 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-3xl border-2 border-slate-200 select-none shadow-sm';

  return (
    <div className={wrapperClass}>
      {data.title && (
        <h4 className="text-center font-black text-slate-800 text-sm sm:text-base uppercase tracking-wider mb-4">
          {data.title}
        </h4>
      )}

      <div className="overflow-hidden rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] bg-white">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white divide-x-2 divide-slate-800">
              {headers.map((h, i) => (
                <th key={i} className="py-3 px-4 font-black text-xs sm:text-sm tracking-wider uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-200">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={`divide-x-2 divide-slate-200 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                }`}
              >
                {row.map((cell, cIdx) => {
                  const isMissing = cell === '?' || cell === '';
                  return (
                    <td
                      key={cIdx}
                      className={`py-3 px-4 font-black text-sm sm:text-base ${
                        isMissing
                          ? 'text-amber-600 bg-amber-50 animate-pulse font-black text-xl'
                          : cIdx === 0
                          ? 'text-slate-700'
                          : 'text-slate-900'
                      }`}
                    >
                      {isMissing ? '?' : cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
