import React, { useMemo } from 'react';

export default function SingaporeMoney({ data, attempts }) { // Added 'attempts' prop
  const moneyItems = data?.items || data?.numbers || [];

  // ✅ BUG 3 FIXED: Using useMemo prevents React from recalculating variables needlessly
  const renderedAssets = useMemo(() => {
    if (moneyItems.length === 0) return null;

    // Asset Dictionary
    const assetMap = {
      '5¢':   { src: '/assets/money/sg-5c.png',   isCoin: true },
      '0.05': { src: '/assets/money/sg-5c.png',   isCoin: true },
      '$0.05':{ src: '/assets/money/sg-5c.png',   isCoin: true },
      '10¢':  { src: '/assets/money/sg-10c.png',  isCoin: true },
      '0.1':  { src: '/assets/money/sg-10c.png',  isCoin: true },
      '0.10': { src: '/assets/money/sg-10c.png',  isCoin: true },
      '$0.10':{ src: '/assets/money/sg-10c.png',  isCoin: true },
      '20¢':  { src: '/assets/money/sg-20c.png',  isCoin: true },
      '20':   { src: '/assets/money/sg-20c.png',  isCoin: true },
      '0.2':  { src: '/assets/money/sg-20c.png',  isCoin: true },
      '0.20': { src: '/assets/money/sg-20c.png',  isCoin: true },
      '$0.20':{ src: '/assets/money/sg-20c.png',  isCoin: true },
      '50¢':  { src: '/assets/money/sg-50c.png',  isCoin: true },
      '50':   { src: '/assets/money/sg-50c.png',  isCoin: true },
      '0.5':  { src: '/assets/money/sg-50c.png',  isCoin: true },
      '0.50': { src: '/assets/money/sg-50c.png',  isCoin: true },
      '$0.50':{ src: '/assets/money/sg-50c.png',  isCoin: true },
      '$1':   { src: '/assets/money/sg-1d.png', isCoin: true },
      '1':    { src: '/assets/money/sg-1d.png', isCoin: true },
      '1.00': { src: '/assets/money/sg-1d.png', isCoin: true },
      '$1.00':{ src: '/assets/money/sg-1d.png', isCoin: true },
      '$2':   { src: '/assets/money/sg-2d.png',   isCoin: false },
      '2':    { src: '/assets/money/sg-2d.png',   isCoin: false },
      '2.00': { src: '/assets/money/sg-2d.png',   isCoin: false },
      '$2.00':{ src: '/assets/money/sg-2d.png',   isCoin: false },
      '$5':   { src: '/assets/money/sg-5d.png',   isCoin: false },
      '5':    { src: '/assets/money/sg-5d.png',   isCoin: false },
      '5.00': { src: '/assets/money/sg-5d.png',   isCoin: false },
      '$5.00':{ src: '/assets/money/sg-5d.png',   isCoin: false },
      '$10':  { src: '/assets/money/sg-10d.png',  isCoin: false },
      '10':   { src: '/assets/money/sg-10d.png',  isCoin: false },
      '10.00':{ src: '/assets/money/sg-10d.png',  isCoin: false },
      '$10.00':{ src: '/assets/money/sg-10d.png', isCoin: false },
      '$50':  { src: '/assets/money/sg-50d.png',  isCoin: false },
      '50.00':{ src: '/assets/money/sg-50d.png',  isCoin: false },
      '$100': { src: '/assets/money/sg-100d.png', isCoin: false },
    };

    return moneyItems.map((token, idx) => {
      const cleanToken = String(token).trim().toLowerCase();
      if (!cleanToken) return null;

      let normalizedToken = cleanToken.endsWith('c') && !cleanToken.endsWith('¢') 
        ? cleanToken.replace('c', '¢') 
        : cleanToken;
      
      if (normalizedToken.startsWith('$$')) normalizedToken = normalizedToken.slice(1);

      let asset = assetMap[normalizedToken];
      if (!asset && normalizedToken.startsWith('$')) {
        asset = assetMap[normalizedToken.slice(1)];
      }
      if (!asset && !isNaN(normalizedToken)) {
        asset = assetMap[`${normalizedToken}.00`] || assetMap[`$${normalizedToken}.00`];
      }

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
              <span className="text-xs font-black text-slate-400">{cleanToken}</span>
            </div>
          )}
        </div>
      );
    });
  }, [moneyItems]);

  if (moneyItems.length === 0) {
    return (
      <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase">No Money Items Found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center items-end gap-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100">
      {renderedAssets}
    </div>
  );
}