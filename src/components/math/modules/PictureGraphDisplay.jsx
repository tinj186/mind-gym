import React from 'react';

export default function PictureGraphDisplay({ data, hideCardStyles = false }) {
  if (!data || !data.categories) return null;

  const { title, categories, key, orientation = 'HORIZONTAL' } = data;

  const containerStyle = hideCardStyles
    ? "w-full flex flex-col items-center justify-center space-y-4 bg-transparent p-0 border-0 shadow-none"
    : "w-full max-w-md mx-auto p-6 bg-white rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center justify-center space-y-6";

  const defaultEmoji = categories[0]?.emoji || '❓'; // Fallback emoji if none provided
  const keyText = key || `Each ${defaultEmoji} = 1 item`;

  return (
    <div className={containerStyle}>
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>
        <span className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">
          {keyText}
        </span>
      </div>

      {/* 🧭 HORIZONTAL ROUTE LAYOUT - FIXED LEFT ALIGNMENT */}
      {orientation === 'HORIZONTAL' && (
        <div className="space-y-4 pt-2">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-4 border-b border-dashed border-slate-100 pb-3 last:border-0">
              {/* Fixed-width category column to align the baseline */}
              <span className="font-black text-xs text-slate-700 w-20 shrink-0 text-left capitalize">
                {cat.label}
              </span>
              
              <div className="flex flex-wrap gap-2 justify-start items-center flex-1 min-h-[32px]">
                {cat.count === '?' ? (
                  <span className="text-2xl font-black text-slate-400">?</span>
                ) : (
                  <>
                    {Array.from({ length: Math.floor(cat.count || 0) }).map((_, sIdx) => (
                      <span key={sIdx} className="text-2xl select-none drop-shadow-[1px_1px_0px_rgba(0,0,0,1)] transform hover:scale-110 transition-transform">
                        {cat.emoji || defaultEmoji}
                      </span>
                    ))}
                    {(cat.count % 1 !== 0) && (
                      <span className="text-2xl select-none drop-shadow-[1px_1px_0px_rgba(0,0,0,1)] transform hover:scale-110 transition-transform" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                        {cat.emoji || defaultEmoji}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {orientation === 'VERTICAL' && (
        <div className="w-full flex items-end justify-center gap-4 pt-8 border-b-4 border-slate-900 min-h-[250px] relative">
          {categories.map((category, idx) => (
            <div key={idx} className="flex flex-col items-center justify-end h-full relative">
              <div className="flex flex-col-reverse items-center gap-1 min-h-[40px]">
                {category.count === '?' ? (
                  <span className="text-3xl font-black text-slate-400">?</span>
                ) : (
                  <>
                    {Array.from({ length: Math.floor(category.count || 0) }).map((_, i) => (
                      <span key={i} className="text-3xl select-none drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                        {category.emoji || defaultEmoji}
                      </span>
                    ))}
                    {(category.count % 1 !== 0) && (
                      <span className="text-3xl select-none drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                        {category.emoji || defaultEmoji}
                      </span>
                    )}
                  </>
                )}
              </div>
              <span className="mt-2 text-sm font-bold text-slate-800 text-center whitespace-nowrap">
                {category.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}