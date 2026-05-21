import React from 'react';
import { lookupHorizontalTheme } from './assets/VectorRegistry';
import { getVerticalEmoji } from './assets/VerticalAssets';
import * as HAsset from './assets/HorizontalAssets';

export default function MeasurementUnit({ data, topic, difficulty }) {
  // Check if ANY item requires a vertical height alignment architecture layout representation
  const isVerticalOrientation = data?.items?.some(item => 
    (item.label || '').toLowerCase().includes('tall') || (item.label || '').toLowerCase().includes('height')
  );

  // 🦒 1. DECOUPLED VERTICAL LAYOUT CANVAS ENGINE
  if (isVerticalOrientation) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6">
        <div className="flex items-end justify-center gap-16 pt-20 pb-2 border-b-4 border-slate-900 min-h-[340px] relative">
          {data.items?.map((mItem, idx) => {
            const emojiAsset = getVerticalEmoji(mItem.label);
            const targetedHeight = mItem.length * 24; 

            return (
              <div key={idx} className="flex items-end gap-3 relative">
                <div className="w-16 flex items-end justify-center relative select-none overflow-visible origin-bottom" style={{ height: `${targetedHeight}px` }}>
                  <span 
                    className="block font-normal text-center select-none transform origin-bottom transition-all duration-300"
                    style={{ fontSize: '48px', lineHeight: '1', height: '48px', transform: `scaleY(${(targetedHeight / 48).toFixed(3)})` }}
                  >
                    {emojiAsset}
                  </span>
                </div>

                {/* Vertical Block Tower */}
                <div className="flex flex-col-reverse gap-[1px] bg-slate-50 border-2 border-slate-900 p-[2px] rounded-lg shadow-[2px_2px_0px_rgba(15,23,42,1)] z-10">
                  {Array.from({ length: mItem.length }).map((_, uIdx) => (
                    <div key={uIdx} className="w-6 h-[22px] bg-white border border-slate-200 rounded-sm flex items-center justify-center text-[11px]">
                      <span className="select-none">{data.unitIcon || '🧱'}</span>
                    </div>
                  ))}
                </div>

                <div className="absolute -bottom-8 left-0 right-0 text-center pointer-events-none">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-tight whitespace-nowrap">
                    {mItem.label.replace('Tall ', '')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Ground Baseline Aligned</span>
        </div>
      </div>
    );
  }

  // 📐 2. DECOUPLED HORIZONTAL LAYOUT CANVAS ENGINE
  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto p-6 bg-white rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
      {data?.items?.map((mItem, idx) => {
        const rawLabel = (mItem.label || '').toLowerCase();
        const theme = lookupHorizontalTheme(mItem.label);
        
        // Dynamic cycle color fallback logic
        const cycleColors = ['bg-emerald-400', 'bg-cyan-400', 'bg-violet-400', 'bg-pink-400'];
        const fallbackStyles = `border-4 border-slate-900 rounded-l-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${cycleColors[idx % cycleColors.length]}`;
        const finalStyles = theme ? theme.styles : fallbackStyles;

        // CRITICAL RANGE SANITIZATION: Check if this specific item has an offset
        const hasActiveOffset = typeof mItem.startOffset === 'number' && !isNaN(mItem.startOffset);
        const offsetLeftPadding = hasActiveOffset ? mItem.startOffset * 48 : 0;
        
        // The base ruler always spans 10 units for offsets, or locks to item length for standard
        const gridLengthCount = hasActiveOffset ? 10 : mItem.length;

        return (
          <div key={idx} className="space-y-3 group pb-2 last:border-b-0 last:pb-0">
            
            <div className="flex flex-col space-y-4 w-full">
              
              {/* Row 1: Item Vector Line Description Track */}
              <div className="flex items-center gap-4">
                {/* Clean Object Label Header */}
                <div className="w-28 text-right pr-2 shrink-0">
                  <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                    {mItem.label.split(/[([\s]/)[0]} {mItem.label.includes('A') ? 'A' : mItem.label.includes('B') ? 'B' : ''}
                  </span>
                </div>
                
                {/* Object Vector Frame Container (Floats right based on layout specifications) */}
                <div 
                  className="flex items-center select-none relative transition-all duration-300"
                  style={{ marginLeft: `${offsetLeftPadding}px` }}
                >
                  {rawLabel.includes('ribbon') && <HAsset.RibbonLeftTail />}

                  <div className={`h-10 ${finalStyles}`} style={{ width: `${mItem.length * 48}px` }}>
                    {rawLabel.includes('chopstick') ? (
                      <HAsset.ChopstickPair />
                    ) : (
                      <>
                        {rawLabel.includes('straw') && <div className="w-full h-full pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #ef4444, #ef4444 6px, #ffffff 6px, #ffffff 12px)' }} />}
                        {theme?.teethStyle && <div style={theme.teethStyle} className="pointer-events-none" />}
                        {rawLabel.includes('brush') && <HAsset.PaintbrushBristles />}
                        {rawLabel.includes('crayon') && <HAsset.CrayonDetails />}
                        {rawLabel.includes('ruler') && <div className="absolute inset-x-0 bottom-0 h-3 border-t border-slate-900/30 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, #0f172a 2px, transparent 2px)', backgroundSize: '12px 100%' }} />}
                        <div className="absolute top-1 left-2 right-2 h-1 bg-white/30 rounded-full pointer-events-none z-20" />
                      </>
                    )}
                  </div>

                  {/* Trailing Attached Structural Add-on Elements */}
                  {(rawLabel.includes('pencil') || rawLabel.includes('pen')) && <HAsset.PencilTip />}
                  {rawLabel.includes('fork') && <HAsset.ForkHead />}
                  {rawLabel.includes('ribbon') && <HAsset.RibbonRightTail />}
                </div>
              </div>

              {/* Row 2: Non-Standard Unit Tracking Grid Blocks */}
              <div className="flex items-center gap-4">
                {/* Spacer to align precisely underneath Row 1 labels */}
                <div className="w-28 shrink-0" />
                
                {/* 🧱 FIXED CORE RULER GRID: Container borders and backgrounds are made entirely transparent */}
                <div className="flex items-center bg-transparent border-0 shadow-none p-1.5 gap-1">
                  {Array.from({ length: gridLengthCount }).map((_, uIdx) => {
                    
                    return (
                      <div 
                        key={uIdx} 
                        // The individual block boxes keep their clear, solid high-contrast borders and white backgrounds
                        className="w-[44px] h-10 border-2 border-slate-900 bg-white rounded-xl flex flex-col items-center justify-center text-xl font-bold relative shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                      >
                        {/* Always display the tracking unit cube block */}
                        <span className="select-none text-sm">{data.unitIcon || '🧱'}</span>
                        
                        {/* Clean marker axis digit ticks underneath (1, 2, 3...) */}
                        <span className="absolute -bottom-5 Richmond text-[9px] text-slate-700 font-sans font-black tracking-tighter">
                          {uIdx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}