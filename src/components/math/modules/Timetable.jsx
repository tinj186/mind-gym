'use client';

import React from 'react';

export default function Timetable({ data }) {
  if (!data || !data.rows || data.rows.length === 0) return null;

  const { title = 'Schedule', rows } = data;

  return (
    <div className="w-full max-w-xl mx-auto my-6 p-6 md:p-8 bg-white border-2 border-slate-100 rounded-3xl shadow-sm select-none">
      <h3 className="text-xl md:text-2xl font-black text-slate-800 text-center mb-6 uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex flex-col gap-3 md:gap-4">
        {rows.map((row, idx) => {
          return (
            <div 
              key={idx} 
              className={`flex items-center gap-4 px-4 py-3 md:py-4 rounded-xl ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white border border-slate-100'} transition-all hover:bg-slate-100`}
            >
              <div className="flex-shrink-0 w-24 md:w-32">
                <span className="text-base md:text-lg font-black text-blue-600">
                  {row.time}
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-sm md:text-base font-bold text-slate-700">
                  {row.event}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
