import React from 'react';

export default function FactTriangle({ data }) {
  if (!data) return null;
  
  const product = data.product !== undefined ? data.product : '?';
  const factors = data.factors || ['?', '?'];

  return (
    <div className="relative w-full max-w-sm mx-auto p-8 flex flex-col items-center select-none" style={{ height: '320px' }}>
      
      {/* SVG Triangle connecting the nodes */}
      <svg className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
        <defs>
          {/* Arrowhead marker for division lines */}
          <marker id="arrowHead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#cbd5e1" />
          </marker>
        </defs>

        {/* Top to Bottom-Left (Division) */}
        <line x1="50%" y1="15%" x2="31%" y2="68%" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" strokeDasharray="6, 6" markerEnd="url(#arrowHead)" />
        <line x1="31%" y1="68%" x2="25%" y2="85%" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" strokeDasharray="6, 6" />
        
        {/* Top to Bottom-Right (Division) */}
        <line x1="50%" y1="15%" x2="69%" y2="68%" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" strokeDasharray="6, 6" markerEnd="url(#arrowHead)" />
        <line x1="69%" y1="68%" x2="75%" y2="85%" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" strokeDasharray="6, 6" />
        
        {/* Bottom-Left to Bottom-Right (Multiplication) */}
        <line x1="25%" y1="85%" x2="75%" y2="85%" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" strokeDasharray="6, 6" />
      </svg>

      {/* Operators */}
      <div 
        className="absolute w-8 h-8 bg-white rounded-full flex justify-center items-center text-slate-400 font-bold text-xl shadow-sm z-10 border border-slate-100"
        style={{ top: '50%', left: '37.5%', transform: 'translate(-50%, -50%)' }}
      >
        ÷
      </div>
      <div 
        className="absolute w-8 h-8 bg-white rounded-full flex justify-center items-center text-slate-400 font-bold text-xl shadow-sm z-10 border border-slate-100"
        style={{ top: '50%', left: '62.5%', transform: 'translate(-50%, -50%)' }}
      >
        ÷
      </div>
      <div 
        className="absolute w-8 h-8 bg-white rounded-full flex justify-center items-center text-slate-400 font-bold text-xl shadow-sm z-10 border border-slate-100"
        style={{ top: '85%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        ×
      </div>

      {/* Product (Top Node) */}
      <div 
        className="absolute w-24 h-24 bg-violet-500 rounded-lg border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex justify-center items-center z-20"
        style={{ top: '15%', left: '50%', transform: 'translate(-50%, -50%) rotate(45deg)' }}
      >
        <span className="text-3xl font-black text-white" style={{ transform: 'rotate(-45deg)' }}>{product}</span>
      </div>

      {/* Factors (Bottom Nodes) */}
      <div 
        className="absolute w-20 h-20 bg-emerald-400 rounded-full border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex justify-center items-center z-20"
        style={{ top: '85%', left: '25%', transform: 'translate(-50%, -50%)' }}
      >
        <span className="text-2xl font-black text-white">{factors[0]}</span>
      </div>
      
      <div 
        className="absolute w-20 h-20 bg-emerald-400 rounded-full border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex justify-center items-center z-20"
        style={{ top: '85%', left: '75%', transform: 'translate(-50%, -50%)' }}
      >
        <span className="text-2xl font-black text-white">{factors[1]}</span>
      </div>

    </div>
  );
}
