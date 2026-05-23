import React from 'react';
import { getVerticalEmoji } from './assets/VerticalAssets';

// Helper to map object labels to SVG filenames
const getHorizontalAsset = (label) => {
  const normalizedLabel = label.toLowerCase();
  if (normalizedLabel.includes('cutter')) return 'cutter.svg';
  if (normalizedLabel.includes('highlighter')) return 'highlighter.svg';
  if (normalizedLabel.includes('pen')) return 'pen.svg';
  if (normalizedLabel.includes('pencil')) return 'pencil.svg';
  if (normalizedLabel.includes('usbdrive')) return 'usbdrive.svg';
  return 'pen.svg'; 
};

export default function MeasurementUnit({ data, topic, difficulty }) {
  // 🦒 1. VERTICAL RENDERING ENGINE (UNCHANGED)
  const isVerticalOrientation = data?.items?.some(item => 
    (item.label || '').toLowerCase().includes('tall') || (item.label || '').toLowerCase().includes('height')
  );

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
                  <span className="block font-normal text-center select-none transform origin-bottom transition-all duration-300" style={{ fontSize: '48px', lineHeight: '1', height: '48px', transform: `scaleY(${(targetedHeight / 48).toFixed(3)})` }}>{emojiAsset}</span>
                </div>
                <div className="flex flex-col-reverse gap-[1px] bg-slate-50 border-2 border-slate-900 p-[2px] rounded-lg shadow-[2px_2px_0px_rgba(15,23,42,1)] z-10">
                  {Array.from({ length: mItem.length }).map((_, uIdx) => (
                    <div key={uIdx} className="w-6 h-[22px] bg-white border border-slate-200 rounded-sm flex items-center justify-center">
                      <img 
                        src={`/assets/measurement/${data.unitIcon || 'paperclip.svg'}`} 
                        alt="unit" 
                        className="w-4 h-4 object-contain" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 📐 2. HORIZONTAL ENGINE (SVG INTEGRATED)
  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto p-6 bg-white rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
      {data?.items?.map((mItem, idx) => {
        const offsetLeftPadding = (mItem.startOffset || 0) * 48;
        const targetWidth = mItem.length * 48;
        const assetFile = getHorizontalAsset(mItem.label);

        return (
          <div key={idx} className="space-y-4 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-28 text-right pr-2 shrink-0">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  {mItem.label}
                </span>
              </div>
              
              {/* Crayon/Pen SVG Container */}
              <div 
                className="relative flex items-center" 
                style={{ 
                  width: `${targetWidth}px`, 
                  height: '48px',
                  marginLeft: `${offsetLeftPadding}px` 
                }}
              >
                <img 
                  src={`/assets/measurement/${assetFile}`} 
                  alt={mItem.label}
                  className="w-full h-full"
                  style={{ objectFit: 'fill', display: 'block' }}
                />
              </div>
            </div>

            {/* Grid Ruler - Completely Borderless Asset Unit Track */}
            <div className="flex items-center gap-4">
              <div className="w-28 shrink-0" />
              <div className="flex gap-1">
                {Array.from({ length: mItem.length }).map((_, uIdx) => (
                  <div 
                    key={uIdx} 
                    className="w-[44px] h-10 flex items-center justify-center bg-transparent"
                  >
                    <img 
                      src={`/assets/measurement/${data.unitIcon || 'paperclip.svg'}`} 
                      alt="unit" 
                      className="w-10 h-10 object-contain" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}