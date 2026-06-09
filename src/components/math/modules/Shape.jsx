import React from 'react';

export default function Shape({ data }) {
  const shapes = data?.shapes || [];

  const getShapeStyle = (type, color) => {
    const base = "border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]";
    switch(type?.toLowerCase()) {
      case 'circle': return `w-24 h-24 rounded-full ${base}`;
      case 'square': return `w-24 h-24 rounded-2xl ${base}`;
      case 'rectangle': return `w-32 h-20 rounded-2xl ${base}`;
      case 'triangle': 
        return `w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-b-[84px] drop-shadow-[6px_6px_0px_rgba(15,23,42,1)]`;
      default: return `w-24 h-24 rounded-2xl ${base}`;
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 p-8">
      {shapes.map((shape, idx) => (
        <div className="flex flex-col items-center gap-3" key={idx}>
          <div 
            className={getShapeStyle(shape.type)}
            style={shape.type?.toLowerCase() === 'triangle' ? { borderBottomColor: shape.color || '#3b82f6' } : { backgroundColor: shape.color || '#3b82f6' }}
          />
          {shape.label && (
            <span className="text-xs font-black uppercase text-slate-500 tracking-widest">{shape.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}