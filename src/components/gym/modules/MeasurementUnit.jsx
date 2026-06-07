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

// ASSET TUNING MATRIX - Adapts individual items for internal SVG canvas margins
const ASSET_TUNING = {
  'cutter.svg':       { scaleX: 1.00, translateX: 0 },
  'highlighter.svg':  { scaleX: 1.00, translateX: 0 },
  'pen.svg':          { scaleX: 1.00, translateX: 0 },
  'pencil.svg':       { scaleX: 1.00, translateX: 0 },
  'usbdrive.svg':     { scaleX: 1.00, translateX: 0 }
};

export default function MeasurementUnit({ data, topic, difficulty, hideCardStyles = false }) {
  // 🦒 1. VERTICAL RENDERING ENGINE (UNCHANGED)
  const isVerticalOrientation = data?.items?.some(item => 
    (item.label || '').toLowerCase().includes('tall') || (item.label || '').toLowerCase().includes('height')
  );

  const containerStyle = hideCardStyles
    ? "w-full bg-transparent p-0 border-0 shadow-none"
    : "w-full max-w-2xl mx-auto p-6 bg-white rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]";

  // 🔲 0. PERIMETER ENGINE
  const isPerimeterRaw = data?.isPerimeter;
  const isPerimeter = isPerimeterRaw === true || isPerimeterRaw === "true";
  
  let perimeterSides = [];
  if (Array.isArray(data?.sides)) {
    perimeterSides = data.sides.map(Number);
  } else if (typeof data?.sides === 'string') {
    perimeterSides = data.sides.replace(/[\[\]]/g, '').split(',').map(s => parseInt(s.trim()));
  }

  if (isPerimeter && perimeterSides.length >= 2) {
    const unitSize = 40;
    const innerGraphicSize = 32;
    const gap = 6;
    
    const maxHorizontal = Math.max(perimeterSides[0] || 0, perimeterSides[2] || 0);
    const maxVertical = Math.max(perimeterSides[1] || 0, perimeterSides[3] || 0);
    const frameWidth = maxHorizontal * (unitSize + gap) - gap;
    const frameHeight = maxVertical * (unitSize + gap) - gap;

    return (
      <div className={`${containerStyle} flex flex-col items-center justify-center py-20`}>
        <div className="relative border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-slate-50"
             style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}>
          <span className="text-slate-400 font-bold uppercase tracking-widest text-lg px-2 text-center">
            {data.items?.[0]?.label || "Path"}
          </span>
          
          {/* Top Side */}
          {perimeterSides.length >= 1 && (
            <div className="absolute -top-[56px] left-0 w-full flex justify-center gap-[6px]">
              {Array.from({ length: perimeterSides[0] }).map((_, uIdx) => (
                <div key={`top-${uIdx}`} className="flex items-center justify-center bg-white border-2 border-slate-200 rounded-md shadow-sm shrink-0" style={{ width: `${unitSize}px`, height: `${unitSize}px` }}>
                  <img src={`/assets/measurement/${data.unitIcon || 'paperclip.svg'}`} alt="unit" style={{ width: `${innerGraphicSize}px`, height: `${innerGraphicSize}px` }} className="object-contain" />
                </div>
              ))}
            </div>
          )}

          {/* Right Side */}
          {perimeterSides.length >= 2 && (
            <div className="absolute top-0 -right-[56px] h-full flex flex-col justify-center gap-[6px]">
              {Array.from({ length: perimeterSides[1] }).map((_, uIdx) => (
                <div key={`right-${uIdx}`} className="flex items-center justify-center bg-white border-2 border-slate-200 rounded-md shadow-sm shrink-0" style={{ width: `${unitSize}px`, height: `${unitSize}px` }}>
                  <img src={`/assets/measurement/${data.unitIcon || 'paperclip.svg'}`} alt="unit" style={{ width: `${innerGraphicSize}px`, height: `${innerGraphicSize}px` }} className="object-contain rotate-90" />
                </div>
              ))}
            </div>
          )}

          {/* Bottom Side */}
          {perimeterSides.length >= 3 && (
            <div className="absolute -bottom-[56px] left-0 w-full flex justify-center gap-[6px]">
              {Array.from({ length: perimeterSides[2] }).map((_, uIdx) => (
                <div key={`bottom-${uIdx}`} className="flex items-center justify-center bg-white border-2 border-slate-200 rounded-md shadow-sm shrink-0" style={{ width: `${unitSize}px`, height: `${unitSize}px` }}>
                  <img src={`/assets/measurement/${data.unitIcon || 'paperclip.svg'}`} alt="unit" style={{ width: `${innerGraphicSize}px`, height: `${innerGraphicSize}px` }} className="object-contain" />
                </div>
              ))}
            </div>
          )}

          {/* Left Side */}
          {perimeterSides.length === 4 && (
            <div className="absolute top-0 -left-[56px] h-full flex flex-col justify-center gap-[6px]">
              {Array.from({ length: perimeterSides[3] }).map((_, uIdx) => (
                <div key={`left-${uIdx}`} className="flex items-center justify-center bg-white border-2 border-slate-200 rounded-md shadow-sm shrink-0" style={{ width: `${unitSize}px`, height: `${unitSize}px` }}>
                  <img src={`/assets/measurement/${data.unitIcon || 'paperclip.svg'}`} alt="unit" style={{ width: `${innerGraphicSize}px`, height: `${innerGraphicSize}px` }} className="object-contain rotate-90" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isVerticalOrientation) {
    return (
      <div className={`${containerStyle} space-y-6`}>
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
                    <div key={uIdx} className="w-6 h-[22px] bg-white border border-slate-200 rounded-sm flex items-center justify-center text-[11px]">
                      <img 
                        src={`/assets/measurement/${data.unitIcon || 'paperclip.svg'}`} 
                        alt="unit" 
                        className="w-4 h-4 object-contain select-none" 
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

  // 📐 2. DYNAMIC HORIZONTAL ENGINE (RESPONSIVE RESIZING BASELINE)
  // Determine the highest structural unit span present across the active data elements
  const maxTotalUnits = Math.max(
    10,
    ...(data?.items || []).map(item => (item.startOffset || 0) + item.length)
  );

  // Set standard width limits inside the layout viewport container
  // If required blocks exceed 10 units, grid steps smoothly scale down from 48px
  const unitSize = Math.min(48, Math.floor(480 / maxTotalUnits));
  const innerGraphicSize = Math.floor(unitSize * 0.83); // Keeps asset graphics uniformly isolated

  return (
    <div className={`${containerStyle} space-y-8`}>
      {data?.items?.map((mItem, idx) => {
        const offsetLeftPadding = (mItem.startOffset || 0) * unitSize;
        const targetWidth = mItem.length * unitSize;
        const assetFile = getHorizontalAsset(mItem.label);
        const gridLengthCount = data.showFullRuler ? maxTotalUnits : mItem.length;
        const gridOffset = data.showFullRuler ? 0 : offsetLeftPadding;
        const tuning = ASSET_TUNING[assetFile] || { scaleX: 1.0, translateX: 0 };

        return (
          <div key={idx} className="space-y-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-28 text-right pr-2 shrink-0">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  {mItem.label}
                </span>
              </div>
              
              {/* Measurement Object Wrapper - shrink-0 locks rendering parameters */}
              <div 
                className="relative flex items-center overflow-visible shrink-0" 
                style={{ 
                  width: `${targetWidth}px`, 
                  height: `${unitSize}px`,
                  marginLeft: `${offsetLeftPadding}px` 
                }}
              >
                <img 
                  src={`/assets/measurement/${assetFile}`} 
                  alt={mItem.label}
                  className="w-full h-full"
                  style={{ 
                    objectFit: 'fill', 
                    display: 'block',
                    transformOrigin: 'left center',
                    transform: `translateX(${tuning.translateX}px) scaleX(${tuning.scaleX})`
                  }}
                />
              </div>
            </div>

            {/* Grid Ruler Track - Fluid responsive scaling engine alignment */}
            <div className="flex items-center gap-4">
              <div className="w-28 shrink-0" />
              <div 
                className="flex gap-0"
                style={{ marginLeft: `${gridOffset}px` }}
              >
                {Array.from({ length: gridLengthCount }).map((_, uIdx) => (
                  <div 
                    key={uIdx} 
                    style={{ width: `${unitSize}px`, height: `${unitSize}px` }}
                    className="flex flex-col items-center justify-center bg-transparent relative shrink-0"
                  >
                    <img 
                      src={`/assets/measurement/${data.unitIcon || 'paperclip.svg'}`} 
                      alt="unit" 
                      style={{ width: `${innerGraphicSize}px`, height: `${innerGraphicSize}px` }}
                      className="object-contain" 
                    />
                    {data.showFullRuler && (
                      <>
                        {uIdx === 0 && (
                          <span className="absolute -bottom-5 left-0 -translate-x-1/2 text-[10px] font-bold text-slate-400">0</span>
                        )}
                        <span className="absolute -bottom-5 right-0 translate-x-1/2 text-[10px] font-bold text-slate-400">{uIdx + 1}</span>
                      </>
                    )}
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