import React from 'react';

export default function NumberPattern({ data }) {
  const sequence = data?.sequence || [];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-8 bg-slate-50 rounded-3xl border-2 border-slate-200">
      {sequence.map((num, idx) => (
        <React.Fragment key={idx}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${num === '?' || num === '' ? 'bg-slate-200 animate-pulse' : 'bg-white'}`}>
            <span className="text-2xl font-black text-slate-900">
              {num === '?' ? '' : num}
            </span>
          </div>
          {idx < sequence.length - 1 && (
            <div className="text-slate-400 font-black text-2xl">➔</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}