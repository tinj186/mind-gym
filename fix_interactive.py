import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'r') as f:
    content = f.read()

# Add use client and hooks
if '"use client";' not in content:
    content = content.replace("import React from 'react';", '"use client";\nimport React, { useState, useRef } from \'react\';')

# Add State inside component
state_code = """export default function MeasurementRuler({ data, topic, difficulty, hideCardStyles = false }) {
  const [rulerPos, setRulerPos] = useState({ x: -100, y: 150 }); 
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: -100, y: 150 });

  const handlePointerDown = (e) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX - currentPos.current.x, y: e.clientY - currentPos.current.y };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - startPos.current.x;
    const newY = e.clientY - startPos.current.y;
    currentPos.current = { x: newX, y: newY };
    setRulerPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  // 🦒 1. VERTICAL RENDERING ENGINE"""

if "const [rulerPos, setRulerPos]" not in content:
    content = content.replace("export default function MeasurementRuler({ data, topic, difficulty, hideCardStyles = false }) {\n  // 🦒 1. VERTICAL RENDERING ENGINE", state_code)

# Replace the Map UI
old_map = """            {/* The Trail Path */}
            <div className="relative flex items-center" style={{ width: `${Math.max(300, perimeterSides[0] * 50)}px` }}>
              <div className="absolute inset-0 top-1/2 -translate-y-1/2 border-t-8 border-dashed border-slate-600/60 drop-shadow-sm"></div>
              
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-5xl bg-white/80 rounded-full p-2 shadow-lg z-20 border-2 border-slate-200">🏁</div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-5xl bg-white/80 rounded-full p-2 shadow-lg z-20 border-2 border-slate-200">📍</div>
              
              {/* Distance Markers */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center">
                {Array.from({ length: perimeterSides[0] + 1 }).map((_, i) => (
                  <div key={i} className="absolute flex flex-col items-center" style={{ left: `${(i / perimeterSides[0]) * 100}%`, transform: 'translateX(-50%)' }}>
                    <div className="w-1.5 h-6 bg-slate-800 rounded-full shadow-sm z-10"></div>
                    <div className="mt-2 text-sm font-black text-slate-800 bg-white/90 px-2 py-0.5 rounded-lg shadow-sm border border-slate-200">{i}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-black tracking-widest text-slate-800 bg-white/80 px-6 py-2 rounded-xl border-2 border-slate-200 shadow-sm uppercase">{data.items?.[0]?.label || "Distance"}</div>"""

new_map = """            {/* The Trail Path */}
            <div className="relative flex items-center" style={{ width: `${Math.max(200, perimeterSides[0] * 50)}px` }}>
              <div className="absolute inset-0 top-1/2 -translate-y-1/2 border-t-8 border-dashed border-slate-600/60 drop-shadow-sm"></div>
              
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-5xl bg-white/80 rounded-full p-2 shadow-lg z-20 border-2 border-slate-200">🏁</div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-5xl bg-white/80 rounded-full p-2 shadow-lg z-20 border-2 border-slate-200">📍</div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-black tracking-widest text-slate-800 bg-white/80 px-6 py-2 rounded-xl border-2 border-slate-200 shadow-sm uppercase">{data.items?.[0]?.label || "Distance"}</div>

            {/* Draggable Interactive Ruler */}
            <div 
              className={`absolute top-0 left-1/2 z-30 cursor-grab touch-none ${isDragging ? 'cursor-grabbing opacity-90 scale-105' : 'opacity-100 hover:scale-[1.02]'} transition-transform duration-75`}
              style={{ transform: `translate(${rulerPos.x}px, ${rulerPos.y}px)` }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div className="relative bg-[#fdd835]/60 backdrop-blur-sm border-2 border-[#f57f17] shadow-xl flex items-end shadow-slate-900/30 rounded-sm"
                   style={{ width: `${Math.max(300, (perimeterSides[0] + 3) * 50)}px`, height: '50px' }}>
                <span className="absolute top-1 left-2 text-[10px] font-black text-slate-700/60 uppercase">cm</span>
                {Array.from({ length: perimeterSides[0] + 3 }).map((_, i) => (
                  <div key={i} className="absolute flex flex-col items-center bottom-0" style={{ left: `${(i) * 50 + 40}px`, transform: 'translateX(-50%)' }}>
                    <div className="w-[1.5px] h-4 bg-slate-900"></div>
                    <span className="text-[12px] font-bold text-slate-900 mb-1">{i}</span>
                  </div>
                ))}
              </div>
            </div>"""

content = content.replace(old_map, new_map)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'w') as f:
    f.write(content)

print("Done")
