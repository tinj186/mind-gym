import React from 'react';

export default function ShapeDisplay({ data, hideCardStyles = false }) {
  if (!data) return null;

  // Normalize layout/mode keys from syllabus logic
  const layout = (data.layout || data.mode || 'SINGLE').toUpperCase();

  const renderPrimitiveShape = (shapeData) => {
    // Handle both string identifiers and detailed shape objects
    const { shapeType, color, size = 'large', rotation = 0 } = 
      typeof shapeData === 'string' ? { shapeType: shapeData, color: '#3b82f6' } : shapeData;

    // Use a fixed base size for the SVG, let CSS transforms handle scaling/rotation for COMPOSITE_ADVANCED
    const baseSize = 100;
    const center = baseSize / 2;
    const half = baseSize / 2;
    const typeKey = (shapeType || "").toLowerCase().trim();

    let scale = 1;
    if (size === 'small') scale = 0.5;
    else if (size === 'medium') scale = 0.75;
    else if (size === 'large') scale = 1.0;

    const style = {
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transformOrigin: 'center',
      transition: 'all 0.3s ease'
    };

    const fillColor = color || '#3b82f6';
    const isComposite = layout.startsWith('COMPOSITE');
    // Allow explicit shapeData.opacity (used for dynamic stack layers), otherwise default to 0.8 for composite
    const fillOpacity = shapeData.opacity !== undefined ? shapeData.opacity : (isComposite ? 0.8 : 1);

    return (
      <svg viewBox={`0 0 ${baseSize} ${baseSize}`} className={`w-full h-full overflow-visible ${!isComposite ? 'drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]' : ''}`} style={style}>
        {typeKey === 'circle' && (
          <circle cx={center} cy={center} r={half - 4} fill={fillColor} fillOpacity={fillOpacity} stroke="#0f172a" strokeWidth="4" />
        )}
        {typeKey === 'square' && (
          <rect x={2} y={2} width={baseSize - 4} height={baseSize - 4} fill={fillColor} fillOpacity={fillOpacity} stroke="#0f172a" strokeWidth="4" rx="6" />
        )}
        {typeKey === 'rectangle' && (
          <rect x={2} y={15} width={baseSize - 4} height={baseSize - 30} fill={fillColor} fillOpacity={fillOpacity} stroke="#0f172a" strokeWidth="4" rx="6" />
        )}
        {typeKey === 'triangle' && (
          <polygon points={`${center},4 4,${baseSize - 4} ${baseSize - 4},${baseSize - 4}`} fill={fillColor} fillOpacity={fillOpacity} stroke="#0f172a" strokeWidth="4" strokeLinejoin="round" />
        )}
      </svg>
    );
  };

  const containerStyle = hideCardStyles
    ? "bg-transparent p-0 border-0 shadow-none flex items-center justify-center"
    : "w-full max-w-md mx-auto p-8 bg-white rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center justify-center min-h-[240px]";

  return (
    <div className={containerStyle}>
      {layout === 'SINGLE' && (
        <div className="w-32 h-32 flex items-center justify-center">
          {renderPrimitiveShape(data)}
        </div>
      )}
      
      {layout === 'GRID' && (
        <div className="flex gap-6 flex-wrap justify-center items-center">
          {(data.items || []).map((s, idx) => (
            <div key={idx} className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center gap-2">
              {s.label && (
                <span className="bg-slate-900 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider select-none">
                  {s.label}
                </span>
              )}
              <div className="w-20 h-20">
                {renderPrimitiveShape(s)}
              </div>
            </div>
          ))}
        </div>
      )}

      {layout === 'GROUPS' && (
        <div className="flex gap-4 flex-wrap justify-center items-center">
          {(data.groups || []).map((group, gIdx) => (
            <div key={gIdx} className="border-4 border-slate-900 bg-slate-50 p-4 rounded-2xl flex flex-col items-center space-y-3">
              <span className="bg-slate-900 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider select-none">
                {group.label}
              </span>
              <div className="flex flex-wrap gap-2 justify-center items-center min-h-[80px]">
                {(group.items || []).map((item, itemIdx) => (
                  <div key={itemIdx} className="w-16 h-16">
                    {renderPrimitiveShape(item)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {layout === 'COMPOSITE_ADVANCED' && (
        <div className="relative w-72 h-72 mx-auto my-6 bg-slate-50 border-4 border-dashed border-slate-300 rounded-[2rem] overflow-hidden shadow-inner">
          {data.parts?.map((part, idx) => (
            <div
              key={idx}
              className="absolute origin-center transition-all duration-500 hover:brightness-110"
              style={{
                width: '100px', // Explicit size so CSS knows exactly what 100% means
                height: '100px',
                top: part.style?.top,
                left: part.style?.left,
                transform: part.style?.transform, // 💡 Pure backend transform untouched!
                zIndex: part.zIndex
              }}
            >
              {renderPrimitiveShape(part)}
            </div>
          ))}
        </div>
      )}

      {layout === 'COMPOSITE_GENERATIVE' && (
        <div className="relative w-72 h-72 mx-auto my-6 bg-slate-50 border-4 border-dashed border-slate-300 rounded-[2rem] overflow-hidden shadow-inner">
          {data.parts?.map((part, idx) => (
            <div
              key={idx}
              className="absolute origin-center transition-all duration-500 hover:brightness-110"
              style={{
                width: '100px',
                height: '100px',
                top: `${part.y}%`,
                left: `${part.x}%`,
                transform: `translate(-50%, -50%) scale(${part.scale || 1})`,
                zIndex: part.zIndex || idx
              }}
            >
              {/* We pass rotation to renderPrimitiveShape to keep SVG rotation logic clean */}
              {renderPrimitiveShape(part)}
            </div>
          ))}
        </div>
      )}

      {layout === 'PATTERN' && (
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {(data.pattern || []).map((s, idx) => {
            const isGap = data.gapIndex === idx;
            return (
              <div key={idx} className="flex items-center gap-4">
                {isGap ? (
                  <div className="w-24 h-24 border-4 border-dashed border-blue-400 rounded-2xl bg-blue-50 flex items-center justify-center animate-pulse">
                    <span className="text-blue-500 font-black text-3xl">?</span>
                  </div>
                ) : (
                  <div className="w-24 h-24 p-2 border-2 border-slate-100 rounded-xl bg-slate-50">
                    {renderPrimitiveShape(s)}
                  </div>
                )}
                {idx < data.pattern.length - 1 && <span className="text-2xl font-black text-slate-300">→</span>}
              </div>
            );
          })}
          {data.gapIndex === undefined && data.mistakeIndex === undefined && (
            <>
              <span className="text-2xl font-black text-slate-300">→</span>
              <div className="w-24 h-24 border-4 border-dashed border-blue-400 rounded-2xl bg-blue-50 flex items-center justify-center animate-pulse">
                <span className="text-blue-500 font-black text-3xl">?</span>
              </div>
            </>
          )}
        </div>
      )}

      {layout === 'EMOJI' && (
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          {data.emoji && (
            <div className="text-8xl p-6 bg-slate-50 border-4 border-slate-900 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] select-none hover:-translate-y-2 transition-transform duration-300">
              {data.emoji}
            </div>
          )}
          <span className="bg-slate-900 text-white font-black text-sm px-4 py-1.5 rounded-full uppercase tracking-widest select-none">
            {data.name}
          </span>
        </div>
      )}

      {layout === 'COMPOSITE' && (
        <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 relative">
          {data.drawingType === 'house' && (
            <div className="relative h-48 w-48 mx-auto flex flex-col items-center justify-center">
              <div className="absolute top-0">
                {renderPrimitiveShape({ shapeType: 'triangle', color: '#ef4444', size: 'large' })}
              </div>
              <div className="absolute top-16">
                {renderPrimitiveShape({ shapeType: 'square', color: '#3b82f6', size: 'large' })}
              </div>
            </div>
          )}
          {!data.drawingType && <p className="text-slate-400 font-bold italic">Building drawing...</p>}
        </div>
      )}
    </div>
  );
}