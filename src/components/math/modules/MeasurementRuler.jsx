"use client";
import React, { useState, useRef } from 'react';
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
  const [hRulerPos, setHRulerPos] = useState({ x: 150, y: 180 }); 
  const [vRulerPos, setVRulerPos] = useState({ x: -280, y: -20 }); 
  const [isDraggingH, setIsDraggingH] = useState(false);
  const [isDraggingV, setIsDraggingV] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentHPos = useRef({ x: 150, y: 180 });
  const currentVPos = useRef({ x: -280, y: -20 });

  const handlePointerDown = (e, orientation) => {
    if (orientation === 'h') {
      setIsDraggingH(true);
      startPos.current = { x: e.clientX - currentHPos.current.x, y: e.clientY - currentHPos.current.y };
    } else {
      setIsDraggingV(true);
      startPos.current = { x: e.clientX - currentVPos.current.x, y: e.clientY - currentVPos.current.y };
    }
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e, orientation) => {
    if (orientation === 'h' && isDraggingH) {
      const newX = e.clientX - startPos.current.x;
      const newY = e.clientY - startPos.current.y;
      currentHPos.current = { x: newX, y: newY };
      setHRulerPos({ x: newX, y: newY });
    } else if (orientation === 'v' && isDraggingV) {
      const newX = e.clientX - startPos.current.x;
      const newY = e.clientY - startPos.current.y;
      currentVPos.current = { x: newX, y: newY };
      setVRulerPos({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e, orientation) => {
    if (orientation === 'h') setIsDraggingH(false);
    else setIsDraggingV(false);
    e.target.releasePointerCapture(e.pointerId);

    // Snap Logic
    const isPerim = data?.isPerimeter === true || data?.isPerimeter === "true";
    let perimSides = [];
    if (Array.isArray(data?.sides)) { perimSides = data.sides.map(Number); }
    else if (typeof data?.sides === 'string') { perimSides = data.sides.replace(/[\[\]]/g, '').split(',').map(s => parseInt(s.trim())); }
    
    if (isPerim && (perimSides.length === 1 || perimSides.length === 2)) {
    const targetWidth = 600;
    const targetHeight = 220;
    let mapScale = 80;
    if (perimSides.length > 0) {
      const scaleX = targetWidth / (perimSides[0] || 1);
      const scaleY = perimSides.length > 1 ? (targetHeight / (perimSides[1] || 1)) : scaleX;
      mapScale = Math.max(40, Math.min(scaleX, scaleY));
    }
      if (orientation === 'h') {
        const pathWidth = perimSides[0] * mapScale;
        const pathHeight = perimSides.length > 1 ? perimSides[1] * mapScale : 0;
        const startDotX = -(pathWidth / 2);
        // hRuler parent is top-0. Container is h-[320px] (center 160).
        // Path is at 160 - pathHeight/2. We want ruler just below it.
        const targetY = 160 - (pathHeight / 2) + 6; 
        
        const maxTicks = Math.ceil(perimSides[0]) + 3;
        const validOffsets = [0]; 
        for (let i = 0; i < maxTicks; i++) {
          validOffsets.push(42 + i * mapScale); 
        }

        let closestX = currentHPos.current.x;
        let minDistance = 200; 
        let didSnap = false;

        for (const offset of validOffsets) {
          const potentialTargetX = startDotX - offset;
          const distX = Math.abs(currentHPos.current.x - potentialTargetX);
          const distY = Math.abs(currentHPos.current.y - targetY);
          
          if (distX < 80 && distY < 150) {
            if (distX + distY < minDistance) {
              minDistance = distX + distY;
              closestX = potentialTargetX;
              didSnap = true;
            }
          }
        }

        if (didSnap) {
          setHRulerPos({ x: closestX, y: targetY });
          currentHPos.current = { x: closestX, y: targetY };
        }
      } else if (orientation === 'v' && perimSides.length === 2) {
        const pathWidth = perimSides[0] * mapScale;
        const pathHeight = perimSides[1] * mapScale;
        // vRuler parent is top-1/2 left-1/2.
        const startDotY = -(pathHeight / 2);
        const targetX = (pathWidth / 2) + 6; // Just to the right of the vertical segment
        
        const maxTicks = Math.ceil(perimSides[1]) + 3;
        const validOffsets = [0]; 
        for (let i = 0; i < maxTicks; i++) {
          validOffsets.push(42 + i * mapScale); 
        }

        let closestY = currentVPos.current.y;
        let minDistance = 200; 
        let didSnap = false;

        for (const offset of validOffsets) {
          const potentialTargetY = startDotY - offset;
          const distY = Math.abs(currentVPos.current.y - potentialTargetY);
          const distX = Math.abs(currentVPos.current.x - targetX);
          
          if (distY < 80 && distX < 150) {
            if (distX + distY < minDistance) {
              minDistance = distX + distY;
              closestY = potentialTargetY;
              didSnap = true;
            }
          }
        }

        if (didSnap) {
          setVRulerPos({ x: targetX, y: closestY });
          currentVPos.current = { x: targetX, y: closestY };
        }
      }
    }
  };

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
  
  const targetWidth = 600;
  const targetHeight = 220;
  let mapScale = 80;
  if (perimeterSides.length > 0) {
    const scaleX = targetWidth / (perimeterSides[0] || 1);
    const scaleY = perimeterSides.length > 1 ? (targetHeight / (perimeterSides[1] || 1)) : scaleX;
    mapScale = Math.max(40, Math.min(scaleX, scaleY));
  }

  if (isPerimeter && perimeterSides.length >= 1) {
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
      <div className={`${containerStyle} flex flex-col items-center justify-center py-10 relative`}>
        {data?.mapTheme || perimeterSides.length === 1 || perimeterSides.length === 2 ? (
          <div className="relative w-full max-w-full overflow-x-auto min-h-[320px] flex justify-center py-4">
            <div className="absolute inset-0 bg-[#eef2f3] rounded-[3rem] border-4 border-slate-300 shadow-inner overflow-hidden flex items-center justify-center min-w-[700px]">
              {/* Topographic SVG Pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="topography" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M0 30 Q15 15, 30 30 T60 30" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                  <path d="M0 45 Q15 30, 30 45 T60 45" fill="none" stroke="#0f172a" strokeWidth="1" />
                  <path d="M0 15 Q15 0, 30 15 T60 15" fill="none" stroke="#0f172a" strokeWidth="1" />
                  <path d="M15 0 Q30 15, 45 0" fill="none" stroke="#0f172a" strokeWidth="0.5" />
                  <path d="M15 60 Q30 45, 45 60" fill="none" stroke="#0f172a" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topography)" />
            </svg>
            
            {/* Map Compass/Grid aesthetics */}
            <div className="absolute top-4 left-6 border-l-4 border-t-4 border-slate-400 w-8 h-8 opacity-40 rounded-tl-lg"></div>
            <div className="absolute bottom-4 right-6 border-r-4 border-b-4 border-slate-400 w-8 h-8 opacity-40 rounded-br-lg"></div>
            <div className="absolute top-6 right-8 text-slate-400 font-mono text-sm font-bold opacity-60 tracking-widest">N 1°18'</div>
            <div className="absolute bottom-6 left-8 text-slate-400 font-mono text-sm font-bold opacity-60 tracking-widest">E 103°51'</div>
            {data.mapTheme === 'park' && (
              <>
                <div className="absolute bottom-8 right-[30%] text-5xl opacity-40 drop-shadow-sm">🌲</div>
                <div className="absolute top-10 left-[20%] text-6xl opacity-30 drop-shadow-sm">☁️</div>
                <div className="absolute top-4 right-[15%] text-4xl opacity-30 drop-shadow-sm">🌳</div>
              </>
            )}
            {data.mapTheme === 'river' && (
              <>
                <div className="absolute bottom-12 right-[20%] text-5xl opacity-50 drop-shadow-sm">🦆</div>
                <div className="absolute top-12 left-[15%] text-6xl opacity-40 drop-shadow-sm">🛶</div>
                <div className="absolute bottom-6 left-[30%] text-5xl opacity-30 drop-shadow-sm">🐸</div>
              </>
            )}
            {data.mapTheme === 'road' && (
              <>
                <div className="absolute bottom-8 right-[25%] text-5xl opacity-40 drop-shadow-sm">🚗</div>
                <div className="absolute top-10 left-[20%] text-5xl opacity-40 drop-shadow-sm">🏢</div>
                <div className="absolute top-6 right-[15%] text-4xl opacity-30 drop-shadow-sm">🚦</div>
              </>
            )}
            {(!data.mapTheme || data.mapTheme === 'park') && (
              <div className="absolute bottom-8 left-[10%] text-4xl opacity-30 drop-shadow-sm">🦆</div>
            )}

            {/* The Trail Path */}
            <div className="relative flex items-center justify-center">
              {perimeterSides.length === 1 ? (
                <div className="relative" style={{ width: `${perimeterSides[0] * mapScale}px`, height: '8px' }}>
                  <div className="absolute inset-0 top-1/2 -translate-y-1/2 border-t-8 border-dashed border-slate-600/60 drop-shadow-sm"></div>
                  
                  {/* Start Point */}
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                    {data.startLabel && <span className="mb-1 bg-white/90 text-slate-800 text-xs font-black px-2 py-1 rounded shadow-sm whitespace-nowrap">{data.startLabel}</span>}
                    <div className="text-5xl bg-white/80 rounded-full p-2 shadow-lg border-2 border-slate-200">🏁</div>
                  </div>
                  
                  {/* End Point */}
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                    {data.endLabel && <span className="mb-1 bg-white/90 text-slate-800 text-xs font-black px-2 py-1 rounded shadow-sm whitespace-nowrap">{data.endLabel}</span>}
                    <div className="text-5xl bg-white/80 rounded-full p-2 shadow-lg border-2 border-slate-200">📍</div>
                  </div>
                  
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-sm z-30 border-2 border-white -translate-x-1/2 ring-2 ring-red-500/30"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-sm z-30 border-2 border-white translate-x-1/2 ring-2 ring-red-500/30"></div>
                </div>
              ) : (
                <div className="relative" style={{ width: `${perimeterSides[0] * mapScale}px`, height: `${perimeterSides[1] * mapScale}px` }}>
                  {/* Horizontal Segment */}
                  <div className="absolute top-0 left-0 border-t-8 border-dashed border-slate-600/60 drop-shadow-sm" style={{ width: `${perimeterSides[0] * mapScale}px` }}></div>
                  {/* Vertical Segment */}
                  <div className="absolute top-0 right-0 border-r-8 border-dashed border-slate-600/60 drop-shadow-sm" style={{ height: `${perimeterSides[1] * mapScale}px`, marginRight: '-4px' }}></div>
                  
                  {/* Markers */}
                  <div className="absolute -left-8 -top-8 flex flex-col items-center z-20">
                    {data.startLabel && <span className="mb-1 bg-white/90 text-slate-800 text-xs font-black px-2 py-1 rounded shadow-sm whitespace-nowrap">{data.startLabel}</span>}
                    <div className="text-5xl bg-white/80 rounded-full p-2 shadow-lg border-2 border-slate-200">🏁</div>
                  </div>
                  <div className="absolute -right-8 top-0 -translate-y-1/2 translate-x-1/2 text-5xl bg-white/80 rounded-full p-1 shadow-lg z-20 border-2 border-slate-200">🚏</div>
                  <div className="absolute -right-8 -bottom-8 flex flex-col items-center z-20">
                    {data.endLabel && <span className="mb-1 bg-white/90 text-slate-800 text-xs font-black px-2 py-1 rounded shadow-sm whitespace-nowrap">{data.endLabel}</span>}
                    <div className="text-5xl bg-white/80 rounded-full p-2 shadow-lg border-2 border-slate-200">📍</div>
                  </div>
                  
                  {/* Coordinate Dots */}
                  <div className="absolute left-0 top-0 w-3 h-3 bg-red-500 rounded-full shadow-sm z-30 border-2 border-white -translate-x-1/2 -translate-y-1/2 ring-2 ring-red-500/30"></div>
                  <div className="absolute right-0 top-0 w-3 h-3 bg-red-500 rounded-full shadow-sm z-30 border-2 border-white translate-x-1/2 -translate-y-1/2 ring-2 ring-red-500/30"></div>
                  <div className="absolute right-0 bottom-0 w-3 h-3 bg-red-500 rounded-full shadow-sm z-30 border-2 border-white translate-x-1/2 translate-y-1/2 ring-2 ring-red-500/30"></div>
                </div>
              )}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-black tracking-widest text-slate-800 bg-white/80 px-6 py-2 rounded-xl border-2 border-slate-200 shadow-sm uppercase">{data.items?.[0]?.label || "Distance"}</div>
          </div>

          {/* Horizontal Draggable Interactive Ruler */}
          <div 
              className={`absolute top-0 left-1/2 z-30 cursor-grab touch-none ${isDraggingH ? 'cursor-grabbing opacity-90 transition-none' : 'opacity-100 hover:brightness-105 transition-all duration-150'}`}
              style={{ transform: `translate(${hRulerPos.x}px, ${hRulerPos.y}px)` }}
              onPointerDown={(e) => handlePointerDown(e, 'h')}
              onPointerMove={(e) => handlePointerMove(e, 'h')}
              onPointerUp={(e) => handlePointerUp(e, 'h')}
              onPointerCancel={(e) => handlePointerUp(e, 'h')}
            >
              <div className="relative bg-[#fdd835]/60 backdrop-blur-sm border-2 border-[#f57f17] shadow-xl flex items-start shadow-slate-900/30 rounded-sm"
                   style={{ width: `${Math.max(300, (Math.ceil(perimeterSides[0]) + 3) * mapScale)}px`, height: '50px' }}>
                <span className="absolute bottom-1 left-2 text-[10px] font-black text-slate-700/60 uppercase">km</span>
                {Array.from({ length: Math.ceil(perimeterSides[0]) + 3 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="absolute flex flex-col items-center top-0" style={{ left: `${(i) * mapScale + 40}px`, transform: 'translateX(-50%)' }}>
                      <div className="w-[1.5px] h-4 bg-slate-900"></div>
                      <span className="text-[12px] font-bold text-slate-900 mt-1">{i}</span>
                    </div>
                    {i < Math.ceil(perimeterSides[0]) + 2 && Array.from({ length: 9 }).map((_, j) => (
                      <div key={`minor-${i}-${j}`} className="absolute top-0 flex flex-col items-center" style={{ left: `${i * mapScale + 40 + (j + 1) * (mapScale / 10)}px`, transform: 'translateX(-50%)' }}>
                        <div className={`w-[1.5px] bg-slate-800 ${j === 4 ? 'h-3' : 'h-2'}`}></div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Vertical Draggable Interactive Ruler */}
            {perimeterSides.length === 2 && (
              <div 
                className={`absolute top-1/2 left-1/2 z-30 cursor-grab touch-none ${isDraggingV ? 'cursor-grabbing opacity-90 transition-none' : 'opacity-100 hover:brightness-105 transition-all duration-150'}`}
                style={{ transform: `translate(${vRulerPos.x}px, ${vRulerPos.y}px)` }}
                onPointerDown={(e) => handlePointerDown(e, 'v')}
                onPointerMove={(e) => handlePointerMove(e, 'v')}
                onPointerUp={(e) => handlePointerUp(e, 'v')}
                onPointerCancel={(e) => handlePointerUp(e, 'v')}
              >
                <div className="relative bg-[#fdd835]/60 backdrop-blur-sm border-2 border-[#f57f17] shadow-xl flex flex-col items-start shadow-slate-900/30 rounded-sm"
                     style={{ height: `${Math.max(300, (Math.ceil(perimeterSides[1]) + 3) * mapScale)}px`, width: '50px' }}>
                  <span className="absolute right-1 bottom-2 text-[10px] font-black text-slate-700/60 uppercase" style={{ writingMode: 'vertical-rl' }}>km</span>
                  {Array.from({ length: Math.ceil(perimeterSides[1]) + 3 }).map((_, i) => (
                    <React.Fragment key={i}>
                      <div className="absolute flex flex-row items-center left-0" style={{ top: `${(i) * mapScale + 40}px`, transform: 'translateY(-50%)' }}>
                        <div className="h-[1.5px] w-4 bg-slate-900"></div>
                        <span className="text-[12px] font-bold text-slate-900 ml-1">{i}</span>
                      </div>
                      {i < Math.ceil(perimeterSides[1]) + 2 && Array.from({ length: 9 }).map((_, j) => (
                        <div key={`minor-${i}-${j}`} className="absolute left-0 flex flex-row items-center" style={{ top: `${i * mapScale + 40 + (j + 1) * (mapScale / 10)}px`, transform: 'translateY(-50%)' }}>
                          <div className={`h-[1.5px] bg-slate-800 ${j === 4 ? 'w-3' : 'w-2'}`}></div>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-slate-50"
               style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}>
            <span className="text-slate-400 font-bold uppercase tracking-widest text-lg px-2 text-center">
              {data.items?.[0]?.label || "Path"}
            </span>
            
            {/* Top Side */}
            {perimeterSides.length >= 2 && (
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
        )}
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
