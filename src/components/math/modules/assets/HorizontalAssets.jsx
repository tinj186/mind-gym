import React from 'react';

// ✏️ Pencil/Pen asset inner decorations
export const PencilTip = () => (
  <div 
    className="w-4 h-10 border-y-4 border-r-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative"
    style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', backgroundColor: '#fed7aa', marginLeft: '-4px', zIndex: 10 }}
  >
    <div className="absolute right-0 top-[13px] w-2 h-3 bg-slate-900 rounded-l-sm" />
  </div>
);

// 🖌️ Paintbrush inner ferrule & bristle tip
export const PaintbrushBristles = () => (
  <div className="absolute inset-y-0 right-0 w-8 bg-slate-400 border-l-4 border-slate-900 flex justify-end">
    <div className="w-4 h-full bg-gradient-to-r from-indigo-500 to-purple-600 border-l-4 border-slate-900 rounded-r-sm" />
  </div>
);

// 🖍️ Crayon wrapping label paper texture
export const CrayonDetails = () => (
  <div className="absolute inset-y-0 left-3 right-3 bg-rose-400 border-x-4 border-slate-900 pointer-events-none flex items-center justify-center">
    <div className="w-full h-4 border-y-2 border-slate-900/30 flex justify-between px-4 font-serif text-[10px] font-black tracking-widest text-rose-700/60 uppercase select-none">
      <span>C</span><span>R</span><span>A</span><span>Y</span><span>O</span><span>N</span>
    </div>
  </div>
);

// 🍴 Fork Head prongs attached to right tip edge
export const ForkHead = () => (
  <div 
    className="w-6 h-12 bg-gradient-to-r from-slate-300 to-slate-400 border-y-4 border-r-4 border-l-2 border-slate-900 rounded-r-xl flex flex-col justify-between p-[3px] shadow-[4px_4px_0px_rgba(15,23,42,1)]"
    style={{ marginLeft: '-4px', zIndex: 10 }}
  >
    <div className="h-1 bg-slate-900 rounded-sm w-4 ml-auto" />
    <div className="h-1 bg-slate-900 rounded-sm w-4 ml-auto" />
    <div className="h-1 bg-slate-900 rounded-sm w-4 ml-auto" />
  </div>
);

// 🎀 Ribbon left decorative notched end
export const RibbonLeftTail = () => (
  <div 
    className="w-4 h-10 border-y-4 border-l-4 border-slate-900 shadow-[0px_4px_0px_rgba(15,23,42,1)]"
    style={{ clipPath: 'polygon(100% 0, 0 0, 70% 50%, 0 100%, 100% 100%)', backgroundColor: '#ec4899', marginRight: '-4px', zIndex: 10 }}
  />
);

// 🎀 Ribbon right decorative notched end
export const RibbonRightTail = () => (
  <div 
    className="w-4 h-10 border-y-4 border-r-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
    style={{ clipPath: 'polygon(0 0, 100% 0, 30% 50%, 100% 100%, 0 100%)', backgroundColor: '#ec4899', marginLeft: '-4px', zIndex: 10 }}
  />
);

// 🥢 Chopstick parallel twin stick renderer array
export const ChopstickPair = () => (
  <>
    <div className="h-3.5 bg-gradient-to-r from-amber-200 via-amber-300 to-orange-400 border-2 border-slate-900 rounded-l shadow-sm relative" style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }}>
      <div className="absolute inset-y-0 left-2 w-1.5 border-x border-slate-900/20" />
    </div>
    <div className="h-3.5 bg-gradient-to-r from-amber-200 via-amber-300 to-orange-400 border-2 border-slate-900 rounded-l shadow-sm relative" style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }}>
      <div className="absolute inset-y-0 left-2 w-1.5 border-x border-slate-900/20" />
    </div>
  </>
);