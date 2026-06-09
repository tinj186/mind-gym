import React from 'react';

/**
 * GroupingWorkspaceModule:
 * This is the INLINE PREVIEW rendered within a question card.
 * It displays a static pile of items and a button to launch the full interactive tool.
 */
export default function GroupingWorkspaceModule({ data, modelData, visualProps, setIsToolOpen }) {
  // Defensive data extraction for labels and icons
  const totalItems = visualProps?.totalItems || data?.totalItems || 0;
  const icon = visualProps?.icon || data?.icon || modelData?.icon || '🎈';
  
  // Performance Guard: Adjust sizes for large quantities
  const groupingSizeClass = totalItems > 50 ? 'text-2xl' : totalItems > 20 ? 'text-3xl' : 'text-5xl';

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex flex-wrap justify-center gap-3">
        {Array.from({ length: totalItems }).map((_, idx) => (
          <span key={idx} className={`${groupingSizeClass} drop-shadow-sm select-none`}>{icon}</span>
        ))}
      </div>
      <button 
        onClick={() => setIsToolOpen?.(true)}
        className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
      >
        ✨ Open Grouping Tool to Help
      </button>
    </div>
  );
}