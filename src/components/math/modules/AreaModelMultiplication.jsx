"use client";

import React from 'react';

/**
 * AREA_MODEL_MULTIPLICATION
 * Renders a partitioned rectangle decomposing multi-digit multiplication into place-value partial products.
 *
 * Props (data):
 * - title?: string
 * - topParts: Array<number | string> (e.g., [200, 40, 5] or [200, "?", 5])
 * - sideParts: Array<number | string> (e.g., [30, 6] or [7])
 * - cellValues: Array<Array<number | string>> (2D array [row][col], supporting "?")
 */
export default function AreaModelMultiplication({ data = {} }) {
  if (!data) return null;

  const {
    title = 'Area Model Multiplication',
    topParts = [],
    sideParts = [],
    cellValues = [],
  } = data;

  if (!Array.isArray(topParts) || topParts.length === 0 || !Array.isArray(sideParts) || sideParts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-6 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm select-none">
      <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            {title}
          </h4>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
          Partial Products
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="mx-auto border-collapse">
          <thead>
            <tr>
              <th className="w-16 h-12 text-center font-black text-slate-400 text-lg">×</th>
              {topParts.map((tp, cIdx) => (
                <th key={cIdx} className="min-w-[5.5rem] h-12 px-3 pb-2 text-center">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border-2 font-mono text-base font-black ${
                      String(tp) === '?'
                        ? 'bg-amber-50 text-amber-800 border-dashed border-amber-400'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    {tp}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sideParts.map((sp, rIdx) => (
              <tr key={rIdx}>
                <td className="pr-3 text-center">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border-2 font-mono text-base font-black ${
                      String(sp) === '?'
                        ? 'bg-amber-50 text-amber-800 border-dashed border-amber-400'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {sp}
                  </span>
                </td>
                {topParts.map((_, cIdx) => {
                  const val = cellValues?.[rIdx]?.[cIdx] ?? '?';
                  const isMissing = String(val) === '?';
                  return (
                    <td
                      key={cIdx}
                      className={`h-20 min-w-[5.5rem] px-3 text-center border-2 border-slate-300 font-mono text-lg font-black ${
                        isMissing ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-900'
                      }`}
                    >
                      {isMissing ? '?' : Number.isFinite(Number(val)) ? Number(val).toLocaleString() : val}
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
