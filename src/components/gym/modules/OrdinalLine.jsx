import React from 'react';

export default function OrdinalLine({ data }) {
  // Support 'elements' (legacy), 'items' (new standard), or a direct array for maximum compatibility
  const rawElements = data?.elements || data?.items || (Array.isArray(data) ? data : []);
  
  if (!rawElements || rawElements.length === 0) {
    return null;
  }

  const totalItems = rawElements.length;
  
  // Calculate content density to auto-resize emojis
  const totalIconsLength = rawElements.reduce((acc, el) => {
    const icon = typeof el === 'object' ? (el.icon || '') : String(el || '');
    return acc + [...icon].length;
  }, 0);

  // Responsive scaling: Shrink icons if there are many items to keep them on screen
  let itemSizeClass = 'text-6xl';
  if (totalIconsLength > 15 || totalItems > 8) itemSizeClass = 'text-3xl';
  else if (totalIconsLength > 10 || totalItems > 6) itemSizeClass = 'text-4xl';
  else if (totalIconsLength > 6 || totalItems > 4) itemSizeClass = 'text-5xl';
  
  const gapClass = totalItems > 8 ? 'gap-2' : 'gap-6';

  return (
    <div className="w-full max-w-3xl mx-auto overflow-x-auto p-8">
      <div className={`flex items-end min-w-max ${gapClass} border-b-8 border-slate-900 pb-8 relative px-12`}>
        {/* Left Indicator */}
        <div className="absolute left-0 bottom-4 w-2 h-16 bg-red-500 border-2 border-slate-900" />
        <span className="absolute left-0 bottom-24 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1 rounded border border-red-100">LEFT</span>

        {/* Right Indicator */}
        <div className="absolute right-0 bottom-4 w-2 h-16 bg-slate-400 border-2 border-slate-900" />
        <span className="absolute right-0 bottom-24 translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 px-3 py-1 rounded border border-slate-100">RIGHT</span>

        {rawElements.map((el, idx) => {
          if (!el) return null;
          
          // If the item is a string, check if it's likely an emoji (short) or a label (long).
          // If it's a label like "Friend 1", we fallback to a human emoji.
          const isEmoji = typeof el === 'string' && [...el].length <= 2;
          const icon = typeof el === 'object' ? (el.icon || '🏃') : (isEmoji ? el : '🏃');
          const label = typeof el === 'object' ? el.label : null;

          return (
            <div key={idx} className="flex flex-col items-center min-w-max px-4 mb-1">
              <span className={`${itemSizeClass} drop-shadow-lg hover:-translate-y-2 transition-transform cursor-default`}>
                {icon}
              </span>
              {label && (
                <span className="mt-2 text-[10px] font-black uppercase text-slate-500 tracking-wider text-center break-words w-full select-none">
                  {label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}