import React from 'react';

export default function IconGrid({ data, modelData, visualProps }) {
  // 🛡️ Data Sanitization: Handle stringified JSON payloads (common in AI generations)
  const cleanData = typeof data === 'string' ? JSON.parse(data) : (data || {});
  const cleanModelData = typeof modelData === 'string' ? JSON.parse(modelData) : (modelData || {});

  // Merge modern componentData and root modelData to catch the array wherever the AI placed it
  const source = { ...cleanModelData, ...cleanData };

  // 🛡️ Hyper-Resilient Schema Extraction
  // We use .length > 0 and null fallbacks to ensure the chain (||) correctly skips empty results
  const renderArray = (source?.elements?.length > 0 ? source.elements : null) || 
    (source?.icons?.length > 0 ? source.icons : null) || 
    (source?.items?.length > 0 ? source.items : null) || 
    (source?.visualItems?.length > 0 ? source.visualItems : null) || 
    (source?.totalItems > 0 ? Array(Number(source.totalItems)).fill(source?.icon || '🔔') : null) ||
    (visualProps?.totalItems > 0 ? Array(Number(visualProps.totalItems)).fill(source?.icon || visualProps?.icon || '🔔') : null) ||
    (source?.count > 0 ? Array(Number(source.count)).fill(source?.icon || '🔔') : null) ||
    (source?.groups?.length > 0 ? source.groups.flatMap(count => Array(Number(count)).fill(source?.icon || source?.icons?.[0] || '⭐')) : []);
    
  if (!renderArray || renderArray.length === 0) return null;

  const cols = Number(source?.cols) || 0;
  
  // Dynamically scale down sizes for larger arrays to prevent horizontal overflow
  let gapClass = "gap-4 md:gap-6";
  let itemSizeClass = "text-4xl md:text-5xl p-4 rounded-2xl border-2";
  
  if (cols >= 8 || renderArray.length > 50) {
    gapClass = "gap-1 md:gap-2";
    itemSizeClass = "text-xl md:text-2xl p-1 md:p-2 rounded-lg border border-slate-200";
  } else if (cols >= 5 || renderArray.length > 20) {
    gapClass = "gap-2 md:gap-3";
    itemSizeClass = "text-2xl md:text-3xl p-2 md:p-3 rounded-xl border-2 border-slate-200";
  } else {
    itemSizeClass = "text-4xl md:text-5xl p-4 rounded-2xl border-2 border-slate-200";
  }
  
  const containerClass = cols > 0
    ? `grid ${gapClass} justify-center mx-auto max-w-full overflow-x-auto p-2`
    : `flex flex-wrap justify-center ${gapClass} max-w-2xl`;
    
  const gridStyle = cols > 0 ? { gridTemplateColumns: `repeat(${cols}, max-content)` } : {};

  return (
    <div className="flex flex-col items-center justify-center p-2 md:p-4 w-full">
      <div className={containerClass} style={gridStyle}>
        {renderArray.map((item, idx) => {
          const displayIcon = typeof item === 'object' ? (item.icon || item.symbol || '🔔') : item;
          
          return (
            <div 
              key={idx} 
              className={`flex items-center justify-center drop-shadow-md bg-slate-50 hover:scale-105 transition-transform ${itemSizeClass}`}
            >
              {displayIcon}
            </div>
          );
        })}
      </div>
    </div>
  );
}