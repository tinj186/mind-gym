"use client";

import React from 'react';
import ConversionGameShell from './ConversionGameShell';

export default function MilesKmConversionGame() {
  const generateQuestion = () => {
    const isMilesToKm = Math.random() < 0.5;
    const val = (Math.floor(Math.random() * 50) + 1) * 10;

    let expectedEstimate, actualExact;
    if (isMilesToKm) {
      expectedEstimate = val + (val * 0.5) + (val * 0.1);
      actualExact = val * 1.60934;
    } else {
      expectedEstimate = (val * 0.5) + (val * 0.1);
      actualExact = val * 0.621371;
    }

    return {
      num: val,
      label: isMilesToKm ? 'Miles → Kilometers' : 'Kilometers → Miles',
      expectedEstimate,
      actualExact,
      qSymbol: isMilesToKm ? `${val} mi → km` : `${val} km → mi`
    };
  };

  const proTip = (
    <>
      <div>
        <h4 className="text-emerald-400 font-bold mb-2">Miles to Kilometers (Approx. x1.6)</h4>
        <p>1. Add half of the miles to the original miles.</p>
        <p>2. Then add 10% of the original miles.</p>
        <p className="text-sm text-slate-400 mt-1">Example: 40 miles → 40 + 20 + 4 = 64 km.</p>
      </div>
      <div className="border-t border-slate-700 pt-4">
        <h4 className="text-emerald-400 font-bold mb-2">Kilometers to Miles (Approx. x0.6)</h4>
        <p>1. Halve the kilometers.</p>
        <p>2. Then add 10% of the original kilometers.</p>
        <p className="text-sm text-slate-400 mt-1">Example: 40 km → 20 + 4 = 24 miles.</p>
      </div>
    </>
  );

  return (
    <ConversionGameShell
      icon="🚗"
      title="Miles ↔ Kilometers"
      storageKey="mentalCalcMilesKmScores"
      proTipContent={proTip}
      generateQuestion={generateQuestion}
    />
  );
}
