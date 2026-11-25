"use client";

import React from 'react';

/**
 * AREA_MODEL_DIVISION
 * Renders a partitioned rectangle decomposing a dividend into clean multiples of the divisor
 * to visualize partial quotients (e.g., (4000 + 200 + 56) / 4 = 1000 + 50 + 14).
 *
 * Props (data):
 * - title?: string
 * - divisor: number | string
 * - dividendParts: Array<number | string> (supports "?")
 * - quotientParts: Array<number | string> (supports "?")
 * - remainder?: number | string
 */
export default function AreaModelDivision({ data = {} }) {
  if (!data) return null;

  const {
    title = 'Area Model Division',
    divisor,
    dividendParts = [],
    quotientParts = [],
    remainder = null,
  } = data;

  if (!divisor || !Array.isArray(dividendParts) || dividendParts.length === 0) return null;

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
          Partial Quotients
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="mx-auto border-collapse">
          <thead>
            <tr>
              <th className="w-16 h-10 text-center font-black text-slate-400 text-sm">Quotient</th>
              {dividendParts.map((_, idx) => {
                const qVal = quotientParts?.[idx] ?? '?';
                const isMissing = String(qVal) === '?';
                return (
                  <th key={idx} className="min-w-[6rem] h-12 px-3 pb-2 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border-2 font-mono text-base font-black ${
                        isMissing
                          ? 'bg-amber-50 text-amber-800 border-dashed border-amber-400'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {isMissing ? '?' : Number.isFinite(Number(qVal)) ? Number(qVal).toLocaleString() : qVal}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-3 text-center">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-800 font-mono text-base font-black">
                  ÷ {divisor}
                </span>
              </td>
              {dividendParts.map((dp, idx) => {
                const isMissing = String(dp) === '?';
                return (
                  <td
                    key={idx}
                    className={`h-20 min-w-[6rem] px-3 text-center border-2 border-slate-300 font-mono text-lg font-black ${
                      isMissing ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-900'
                    }`}
                  >
                    {isMissing ? '?' : Number.isFinite(Number(dp)) ? Number(dp).toLocaleString() : dp}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {remainder !== null && remainder !== undefined && Number(remainder) > 0 && (
        <div className="mt-4 flex justify-center">
          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-black">
            Remainder: {remainder}
          </span>
        </div>
      )}
    </div>
  );
}
