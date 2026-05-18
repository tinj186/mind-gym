"use client";

import React from 'react';
import GroupingWorkspace from '@/components/tools/GroupingWorkspace';

// Define which components are ESSENTIAL (must show on Attempt 0) as they provide core context
export const ESSENTIAL_VISUALS = ["ORDINAL_LINE", "GROUPING_WORKSPACE", "NUMBER_CARDS", "NUMBER_BOND", "NUMBER_PATTERN", "BASE_TEN_BLOCKS", "SINGAPORE_MONEY"];

export default function VisualRenderer({ type, data, visualProps, setIsToolOpen, questionId, difficulty, topic, attempts, isExam = false }) {
  if (!type || type === "NONE" || type === "") return null;

  switch (type) {
    case 'COUNTING_OBJECTS':
      const countingItems = (data.items || data.groups?.flatMap(count => 
        Array(count).fill(data.icons?.[0] || '⭐')
      )) || [];
      
      // Performance Guard: Reduce emoji size if count is high (> 20) to prevent layout thrashing
      const countingSizeClass = countingItems.length > 50 ? 'text-2xl' : countingItems.length > 20 ? 'text-3xl' : 'text-5xl';

      return (
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-3">
            {countingItems.map((item, idx) => (
              <span key={idx} className={`${countingSizeClass} drop-shadow-sm`}>{item}</span>
            ))}
          </div>
          <button 
            onClick={() => setIsToolOpen(true)}
            className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
          >
            ✨ Open Grouping Tool to Help
          </button>
        </div>
      );

    case 'NUMBER_CARDS':
      return (
        <div className="flex flex-wrap justify-center gap-4 py-4 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] p-6">
          {(data.items || data.numbers || [])?.map((val, idx) => (
            <div key={idx} className="w-20 h-28 bg-white rounded-2xl border-4 border-indigo-200 flex flex-col items-center justify-center shadow-lg transform rotate-[-1deg] odd:rotate-[1deg] hover:rotate-0 transition-transform">
              <span className="text-2xl font-black text-slate-900">{val?.toString()}</span>
              <span className="text-[9px] font-bold text-indigo-400 mt-1 uppercase tracking-widest">Card Token</span>
            </div>
          ))}
        </div>
      );

    case 'SINGAPORE_MONEY': {
      const moneyItems = data?.items || data?.numbers || [];

      if (moneyItems.length === 0) {
        return (
          <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center">
            <p className="text-slate-400 text-[10px] font-black uppercase">No Money Items Found</p>
          </div>
        );
      }

      // Map currency tokens to physical assets located inside /public/assets/money/
      const assetMap = {
        '10¢':  { src: '/assets/money/sg-10c.png',  isCoin: true },
        '10':   { src: '/assets/money/sg-10c.png',  isCoin: true },
        '0.1':  { src: '/assets/money/sg-10c.png',  isCoin: true },
        '0.10': { src: '/assets/money/sg-10c.png',  isCoin: true },
        '20¢':  { src: '/assets/money/sg-20c.png',  isCoin: true },
        '20':   { src: '/assets/money/sg-20c.png',  isCoin: true },
        '0.2':  { src: '/assets/money/sg-20c.png',  isCoin: true },
        '0.20': { src: '/assets/money/sg-20c.png',  isCoin: true },
        '50¢':  { src: '/assets/money/sg-50c.png',  isCoin: true },
        '50':   { src: '/assets/money/sg-50c.png',  isCoin: true },
        '0.5':  { src: '/assets/money/sg-50c.png',  isCoin: true },
        '0.50': { src: '/assets/money/sg-50c.png',  isCoin: true },
        '$1':   { src: '/assets/money/sg-1d.png',   isCoin: true },
        '1':    { src: '/assets/money/sg-1d.png',   isCoin: true },
        '1.00': { src: '/assets/money/sg-1d.png',   isCoin: true },
        '$2':   { src: '/assets/money/sg-2d.png',   isCoin: false },
        '2':    { src: '/assets/money/sg-2d.png',   isCoin: false },
        '2.00': { src: '/assets/money/sg-2d.png',   isCoin: false },
        '$5':   { src: '/assets/money/sg-5d.png',   isCoin: false },
        '5':    { src: '/assets/money/sg-5d.png',   isCoin: false },
        '5.00': { src: '/assets/money/sg-5d.png',   isCoin: false },
        '$10':  { src: '/assets/money/sg-10d.png',  isCoin: false },
        '10':   { src: '/assets/money/sg-10d.png',  isCoin: false },
        '10.00':{ src: '/assets/money/sg-10d.png',  isCoin: false }
      };

      return (
        <div className="flex flex-wrap items-center justify-center gap-6 p-6 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem]">
          {moneyItems.map((item, idx) => {
            const cleanToken = item?.toString()?.trim()?.replace(/['"\s]/g, '') || '';
            if (!cleanToken) return null;

            let normalizedToken = cleanToken.endsWith('c') && !cleanToken.endsWith('¢') 
              ? cleanToken.replace('c', '¢') 
              : cleanToken;
            
            if (normalizedToken.startsWith('$$')) normalizedToken = normalizedToken.slice(1);

            const asset = assetMap[normalizedToken];

            return (
              <div key={idx} className="flex flex-col items-center gap-1 hover:scale-105 transition-transform">
                {asset ? (
                  <img 
                    src={asset.src} 
                    alt={cleanToken} 
                    className={`${asset.isCoin ? 'w-16 h-16 rounded-full' : 'w-32 h-16 rounded-md object-cover'} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                  />
                ) : (
                  <div className="w-20 h-16 bg-white rounded-xl border-4 border-slate-200 flex items-center justify-center shadow-md">
                    <span className="text-sm font-black text-slate-900">{cleanToken}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    case 'NUMBER_PATTERN':
      return (
        <div className="flex flex-wrap justify-center items-center gap-2 py-4 select-none">
          {(data.items || [])?.map((val, idx) => (
            <React.Fragment key={idx}>
              <div className={`w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl border-2 flex items-center justify-center shadow-sm transition-all ${
                val === '?' ? 'border-blue-500 bg-blue-50 text-blue-600 animate-pulse' : 'border-slate-200 text-slate-900'
              }`}>
                <span className="text-xl font-black">{val}</span>
              </div>
              
              {/* Visual Arrow logic between numbers */}
              {idx < (data.items?.length || 0) - 1 && (
                <div className="flex flex-col items-center px-1">
                  {/* Reveal the rule as a pedagogical hint after the first strike */}
                  {!isExam && attempts > 0 && data.rule && (
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter bg-blue-50 px-1.5 py-0.5 rounded-md mb-1 animate-in fade-in slide-in-from-bottom-1">
                      {data.rule}
                    </span>
                  )}
                  <div className="w-8 h-px bg-slate-200 relative">
                    <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-4 border-transparent border-l-slate-200"></div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      );

    case 'EQUAL_GROUPS':
      const numGroups = Number(data.numGroups || data.groups || data.groupCount || 0);
      const itemsPerGroup = Number(data.itemsPerGroup || data.size || 1);
      const totalCount = numGroups * itemsPerGroup;
      
      // Performance Guard: Reduce emoji size for large sets
      const groupEmojiSizeClass = totalCount > 50 ? 'text-xl' : totalCount > 20 ? 'text-2xl' : 'text-4xl';

      return (
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-8">
            {Array.from({ length: numGroups }).map((_, gIdx) => (
              <div key={gIdx} className="relative p-6 bg-white rounded-[2rem] border-4 border-dashed border-slate-200 flex gap-3 shadow-inner">
                <span className="absolute -top-3 -left-2 bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase z-10">
                  Grp {gIdx + 1}
                </span>
                {Array.from({ length: itemsPerGroup }).map((_, iIdx) => (
                  <span key={iIdx} className={`${groupEmojiSizeClass} animate-in zoom-in duration-300`} style={{ animationDelay: `${totalCount > 50 ? 0 : (gIdx * 5 + iIdx) * 50}ms` }}>
                    {data.emoji || data.icon || '🎈'}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setIsToolOpen(true)}
            className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
          >
            ✨ Open Grouping Tool to Help
          </button>
        </div>
      );

    case 'GROUPING_WORKSPACE':
      const totalItemsForGrouping = visualProps.totalItems;
      const iconForGrouping = visualProps.icon;
      
      // Performance Guard: Reduce emoji size if count is high (> 20)
      const groupingSizeClass = totalItemsForGrouping > 50 ? 'text-2xl' : totalItemsForGrouping > 20 ? 'text-3xl' : 'text-5xl';

      return (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: totalItemsForGrouping }).map((_, idx) => (
              <span key={idx} className={`${groupingSizeClass} drop-shadow-sm`}>{iconForGrouping}</span>
            ))}
          </div>
          <button 
            onClick={() => setIsToolOpen(true)}
            className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
          >
            ✨ Open Grouping Tool to Help
          </button>
        </div>
      );

    case 'ORDINAL_LINE':
      const ordinalItems = data.items || [];
      const displayTotal = ordinalItems.length > 0 ? ordinalItems.length : Number(data.total || 0);
      const targetPos = Number(data.position);
      const direction = data.direction || 'left'; // Default to counting from left
      const label = data.label || "";

      if (displayTotal === 0 || isNaN(targetPos)) return null;

      const shouldShowLabels = isExam || attempts > 0; // Labels are essential exam parameters

      return (
        <div className="relative flex items-center gap-4 overflow-x-auto py-12 px-8 no-scrollbar bg-slate-50 rounded-[2rem] border-4 border-slate-100">
          {label && <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm z-10">{label}</div>}

          {/* Spatial Orientation Labels */}
          <div className="absolute left-6 top-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">← LEFT</div>
          <div className="absolute right-6 top-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">RIGHT →</div>

          {Array.from({ length: displayTotal }).map((_, idx) => {
            const isTargetHighlighted = !isExam && attempts > 0 && idx === targetPos;
            // Calculate ordinal number based on direction
            const ordinalValue = direction === 'right' ? (displayTotal - idx) : (idx + 1);
            const suffix = ordinalValue === 1 ? 'st' : ordinalValue === 2 ? 'nd' : ordinalValue === 3 ? 'rd' : 'th';

            return (
              <div key={idx} className="flex flex-col items-center gap-4 min-w-[70px]">
                {/* THE ANIMAL CIRCLE */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-md transition-all ${isTargetHighlighted ? 'bg-white border-4 border-blue-500 scale-110 z-10' : 'bg-white border-2 border-slate-100'
                }`}>
                  {ordinalItems[idx] || (idx === targetPos ? (data.icon || '🦊') : '•')}
                </div>
                
                {/* THE POSITION LABEL (1st, 2nd, 3rd...) - Only show as a hint after first strike */}
                {shouldShowLabels && (
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full animate-in fade-in slide-in-from-top-2 ${
                    isTargetHighlighted ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {ordinalValue}{suffix}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );

    case 'BASE_TEN_BLOCKS':
      const tensCount = data.items?.filter(i => i === '▮').length || 0;
      const onesCount = data.items?.filter(i => i === '▪').length || 0;

      return (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex flex-wrap justify-center gap-4 items-end bg-slate-50/50 p-6 rounded-[2rem] border-2 border-slate-100 shadow-inner">
            {/* Render Tens Rods */}
            <div className="flex flex-wrap gap-1 items-end">
              {Array.from({ length: tensCount }).map((_, i) => (
                <span key={i} className="text-5xl text-blue-600 drop-shadow-sm leading-none select-none" title="1 Ten">▮</span>
              ))}
            </div>
            
            {/* Divider if both exist */}
            {tensCount > 0 && onesCount > 0 && <div className="w-px h-12 bg-slate-200 mx-2" />}

            {/* Render Ones Blocks */}
            <div className="flex flex-wrap gap-1 max-w-[120px] items-end">
              {Array.from({ length: onesCount }).map((_, i) => (
                <span key={i} className="text-4xl text-amber-500 drop-shadow-sm leading-none select-none" title="1 One">▪</span>
              ))}
            </div>
          </div>
          {!isExam && attempts > 0 && ( // Only show labels as hints in training mode
            <div className="flex gap-4 animate-in fade-in slide-in-from-top-1">
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                 {tensCount} Tens
               </span>
               <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-md">
                 {onesCount} Ones
               </span>
            </div>
          )}
        </div>
      );

    case 'NUMBER_BOND':
      return (
        <div className="flex flex-col items-center gap-2 py-4">
          {/* Whole */}
          <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-lg transition-all ${
            data.whole === '?' ? 'border-blue-500 bg-blue-50 text-blue-700 animate-pulse' : 'border-slate-200 bg-white text-slate-900'
          }`}>
            <span className="text-2xl font-black">{data.whole}</span>
          </div>

          {/* Connections */}
          <div className="flex justify-center -my-2">
             <svg width="120" height="40" viewBox="0 0 120 40" className="text-slate-200">
                <line x1="60" y1="0" x2="30" y2="40" stroke="currentColor" strokeWidth="4" />
                <line x1="60" y1="0" x2="90" y2="40" stroke="currentColor" strokeWidth="4" />
             </svg>
          </div>

          {/* Parts */}
          <div className="flex gap-8">
            <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-lg transition-all ${
              !isExam && data.part1 === '?' ? 'border-blue-500 bg-blue-50 text-blue-700 animate-pulse' : 'border-slate-200 bg-white text-slate-900'
            }`}>
              <span className="text-xl font-black">{data.part1}</span>
            </div>
            <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-lg transition-all ${
              !isExam && data.part2 === '?' ? 'border-blue-500 bg-blue-50 text-blue-700 animate-pulse' : 'border-slate-200 bg-white text-slate-900'
            }`}>
              <span className="text-xl font-black">{data.part2}</span>
            </div>
          </div>
          {data.icon && <div className="text-2xl mt-4 opacity-30">{data.icon}</div>}
        </div>
      );

    case 'SHAPE':
      return (
        <div className="space-y-6 py-4">
          {data.puzzle?.map((eq, idx) => (
            <div key={idx} className="flex items-center justify-center gap-6 text-3xl font-black text-slate-900">
              <div className="flex items-center gap-4">
                {eq.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-center gap-4">
                    <span className="w-12 h-12 flex items-center justify-center border-4 border-slate-100 rounded-2xl bg-white shadow-sm">
                      {item === 'triangle' ? '▲' : item === 'circle' ? '●' : item === 'square' ? '■' : item}
                    </span>
                    {iIdx < eq.items.length - 1 && <span className="text-slate-300">+</span>}
                  </div>
                ))}
              </div>
              <span className="text-slate-300">=</span>
              <span className="w-16 h-16 flex items-center justify-center bg-slate-900 text-white rounded-2xl shadow-lg">{eq.sum}</span>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Unknown Visual Signature</p>
          <code className="text-[10px] bg-white p-2 rounded-lg text-slate-400">
            {JSON.stringify(data)}
          </code>
        </div>
      );
  }
}
