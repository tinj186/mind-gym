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
export default function TablePatternVisualizer({ data }) {
  if (!data) return null;

  const headers = Array.isArray(data.headers) && data.headers.length >= 2
    ? data.headers
    : ['Term', 'Value'];

  const rows = Array.isArray(data.rows) ? data.rows : [];
  if (rows.length === 0) return null;

  return (
    <div className="my-8 w-full max-w-xl mx-auto p-6 sm:p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-200 select-none shadow-sm">
      {data.title && (
        <h4 className="text-center font-black text-slate-800 text-sm sm:text-base uppercase tracking-wider mb-4">
          {data.title}
        </h4>
      )}

      <div className="overflow-hidden rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] bg-white">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white divide-x-2 divide-slate-800">
              <th className="py-3 px-4 font-black text-xs sm:text-sm tracking-wider uppercase w-1/2">
                {headers[0]}
              </th>
              <th className="py-3 px-4 font-black text-xs sm:text-sm tracking-wider uppercase w-1/2">
                {headers[1]}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-200">
            {rows.map((row, idx) => {
              const cell1 = row[0];
              const cell2 = row[1];
              const isMissing1 = cell1 === '?' || cell1 === '';
              const isMissing2 = cell2 === '?' || cell2 === '';

              return (
                <tr
                  key={idx}
                  className={`divide-x-2 divide-slate-200 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                  }`}
                >
                  <td
                    className={`py-3 px-4 font-black text-sm sm:text-base ${
                      isMissing1
                        ? 'text-amber-600 bg-amber-50 animate-pulse font-black text-xl'
                        : 'text-slate-700'
                    }`}
                  >
                    {isMissing1 ? '?' : cell1}
                  </td>
                  <td
                    className={`py-3 px-4 font-black text-sm sm:text-base ${
                      isMissing2
                        ? 'text-amber-600 bg-amber-50 animate-pulse font-black text-xl'
                        : 'text-slate-900'
                    }`}
                  >
                    {isMissing2 ? '?' : cell2}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
