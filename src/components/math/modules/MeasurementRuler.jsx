import React from 'react';
import { getVerticalEmoji } from './assets/VerticalAssets';

const getHorizontalAsset = (label) => {
  const normalizedLabel = label.toLowerCase();
  if (normalizedLabel.includes('cutter')) return 'cutter.svg';
  if (normalizedLabel.includes('highlighter')) return 'highlighter.svg';
  if (normalizedLabel.includes('paperclip')) return 'paperclip.svg';
  if (normalizedLabel.includes('paperpin') || normalizedLabel.includes('pin')) return 'paperpin.svg';
  if (normalizedLabel.includes('pencil')) return 'pencil.svg';
  if (normalizedLabel.includes('pen')) return 'pen.svg';
  if (normalizedLabel.includes('usbdrive')) return 'usbdrive.svg';
  return 'pen.svg'; 
};

// ASSET TUNING MATRIX - Adapts individual items for internal SVG canvas margins and proportional scaling
const ASSET_TUNING = {
  'cutter.svg':       { scaleX: 1.00, translateX: 0, baseLength: 4, stretchFactor: 0.15 },
  'highlighter.svg':  { scaleX: 1.00, translateX: 0, baseLength: 4, stretchFactor: 0.15 },
  'paperclip.svg':    { scaleX: 1.00, translateX: 0, baseLength: 4, stretchFactor: 0.15 },
  'paperpin.svg':     { scaleX: 1.00, translateX: 0, baseLength: 4, stretchFactor: 0.15 },
  'pen.svg':          { scaleX: 1.00, translateX: 0, baseLength: 5, stretchFactor: 0.12 },
  'pencil.svg':       { scaleX: 1.00, translateX: 0, baseLength: 5, stretchFactor: 0.12 },
  'usbdrive.svg':     { scaleX: 1.00, translateX: 0, baseLength: 4, stretchFactor: 0.20 }
};

export default function MeasurementRuler({ data, topic, difficulty, hideCardStyles = false }) {
  // 🦒 1. VERTICAL RENDERING ENGINE
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
    const gap = 0; // No gap for continuous ruler
    
    const maxHorizontal = Math.max(perimeterSides[0] || 0, perimeterSides[2] || 0);
    const maxVertical = Math.max(perimeterSides[1] || 0, perimeterSides[3] || 0);
    const frameWidth = maxHorizontal * unitSize;
    const frameHeight = maxVertical * unitSize;

    const renderRulerSegment = (length, isVertical) => (
      <div className={`relative bg-[#fdd835] border border-[#f57f17] flex ${isVertical ? 'flex-col' : ''}`}
           style={{ width: isVertical ? '30px' : `${length * unitSize}px`, height: isVertical ? `${length * unitSize}px` : '30px' }}>
        {Array.from({ length: length + 1 }).map((_, i) => (
          <div key={i} className="absolute" 
               style={isVertical 
                 ? { top: `${i * unitSize}px`, left: 0, width: '10px', height: '1px', backgroundColor: '#000' }
                 : { left: `${i * unitSize}px`, top: 0, width: '1px', height: '10px', backgroundColor: '#000' }}>
            <span className="absolute text-[8px] font-bold text-slate-800"
                  style={isVertical ? { left: '12px', top: '-6px' } : { top: '12px', left: '-3px' }}>
              {i}
            </span>
          </div>
        ))}
      </div>
    );

    return (
      <div className={`${containerStyle} flex flex-col items-center justify-center py-20`}>
        <div className="relative border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-slate-50"
             style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}>
          <span className="text-slate-400 font-bold uppercase tracking-widest text-lg px-2 text-center">
            {data.items?.[0]?.label || "Path"}
          </span>
          
          {/* Top Side */}
          {perimeterSides.length >= 1 && (
            <div className="absolute -top-[30px] left-0 w-full flex justify-center">
              {renderRulerSegment(perimeterSides[0], false)}
            </div>
          )}
          {/* Right Side */}
          {perimeterSides.length >= 2 && (
            <div className="absolute top-0 -right-[30px] h-full flex flex-col justify-center">
              {renderRulerSegment(perimeterSides[1], true)}
            </div>
          )}
          {/* Bottom Side */}
          {perimeterSides.length >= 3 && (
            <div className="absolute -bottom-[30px] left-0 w-full flex justify-center">
              {renderRulerSegment(perimeterSides[2], false)}
            </div>
          )}
          {/* Left Side */}
          {perimeterSides.length === 4 && (
            <div className="absolute top-0 -left-[30px] h-full flex flex-col justify-center">
              {renderRulerSegment(perimeterSides[3], true)}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isVerticalOrientation) {
    return (
      <div className={`${containerStyle} space-y-6`}>
        <div className="flex items-end justify-center gap-16 pt-20 pb-2 mb-10 border-b-4 border-slate-900 min-h-[340px] relative">
          {data.items?.map((mItem, idx) => {
            const emojiAsset = getVerticalEmoji(mItem.label);
            const targetedHeight = mItem.length * 24; 
            return (
              <div key={idx} className="flex items-end gap-3 relative">
                <div className="w-16 flex items-end justify-center relative select-none overflow-visible origin-bottom" style={{ height: `${targetedHeight}px` }}>
                  <span className="block font-normal text-center select-none transform origin-bottom transition-all duration-300" style={{ fontSize: '48px', lineHeight: '1', height: '48px', transform: `scaleY(${(targetedHeight / 48).toFixed(3)})` }}>{emojiAsset}</span>
                </div>
                
                {/* Vertical Ruler */}
                <div className="relative bg-[#fdd835] border-2 border-[#f57f17] rounded-sm w-8 z-10" style={{ height: `${targetedHeight}px` }}>
                   {Array.from({ length: mItem.length + 1 }).map((_, uIdx) => (
                    <div key={uIdx} className="absolute w-full" style={{ bottom: `${uIdx * 24}px` }}>
                      <div className="w-3 h-0.5 bg-black absolute right-0"></div>
                      <span className="absolute right-4 -translate-y-1/2 text-[10px] font-bold text-slate-800">{uIdx}</span>
                    </div>
                  ))}
                </div>

                {/* Label for vertical objects */}
                <div className="absolute -bottom-10 w-full flex justify-center whitespace-nowrap">
                  <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                    {mItem.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 📐 2. DYNAMIC HORIZONTAL ENGINE
  const maxTotalUnits = Math.max(
    10,
    ...(data?.items || []).map(item => (item.startOffset || 0) + item.length)
  );

  const unitSize = Math.min(48, Math.floor(480 / maxTotalUnits));

  return (
    <div className={`${containerStyle} space-y-8`}>
      {data?.items?.map((mItem, idx) => {
        const offsetLeftPadding = (mItem.startOffset || 0) * unitSize;
        const targetWidth = mItem.length * unitSize;
        const assetFile = getHorizontalAsset(mItem.label);
        const gridLengthCount = data.showFullRuler ? maxTotalUnits : mItem.length;
        const gridOffset = data.showFullRuler ? 0 : offsetLeftPadding;
        const tuning = ASSET_TUNING[assetFile] || { scaleX: 1.0, translateX: 0, baseLength: 4, stretchFactor: 0.15 };
        const dynamicScaleY = Math.max(0.6, Math.min(2.0, 1 + (mItem.length - tuning.baseLength) * tuning.stretchFactor));
        const rulerStartNum = data.showFullRuler ? 0 : (mItem.startOffset || 0);

        return (
          <div key={idx} className="space-y-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-28 text-right pr-2 shrink-0">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  {mItem.label}
                </span>
              </div>
              
              {/* Measurement Object Wrapper */}
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
                    transform: `translateX(${tuning.translateX}px) scaleX(${tuning.scaleX}) scaleY(${dynamicScaleY})`
                  }}
                />
              </div>
            </div>

            {/* Continuous Ruler Track */}
            <div className="flex items-center gap-4">
              <div className="w-28 shrink-0" />
              <div 
                className="relative bg-[#fdd835] border-2 border-[#f57f17] rounded-sm shadow-sm"
                style={{ 
                  width: `${gridLengthCount * unitSize}px`, 
                  height: '40px',
                  marginLeft: `${gridOffset}px` 
                }}
              >
                {Array.from({ length: gridLengthCount + 1 }).map((_, uIdx) => (
                  <div 
                    key={uIdx} 
                    className="absolute top-0 flex flex-col items-center"
                    style={{ left: `${uIdx * unitSize}px`, transform: 'translateX(-50%)' }}
                  >
                    <div className="w-0.5 h-3 bg-black"></div>
                    {/* Add half-cm tick */}
                    {uIdx < gridLengthCount && (
                      <div className="absolute top-0 left-0 flex justify-center" style={{ width: `${unitSize}px`, marginLeft: '1px' }}>
                         <div className="w-[1px] bg-slate-600/50 h-2"></div>
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-slate-800 mt-1">
                      {rulerStartNum + uIdx}
                    </span>
                  </div>
                ))}
                <div className="absolute bottom-1 right-2 text-[10px] font-black text-slate-800">cm</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
