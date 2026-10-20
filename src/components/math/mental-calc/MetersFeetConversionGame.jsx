"use client";

import React from 'react';
import ConversionGameShell from './ConversionGameShell';

export default function MetersFeetConversionGame() {
  const generateQuestion = () => {
    const isMetersToFeet = Math.random() < 0.5;
    const val = (Math.floor(Math.random() * 50) + 1) * 10;

    let expectedEstimate, actualExact;
    if (isMetersToFeet) {
      const multiplied = val * 3;
      expectedEstimate = multiplied + (multiplied * 0.1);
      actualExact = val * 3.28084;
    } else {
      expectedEstimate = (val / 10) * 3;
      actualExact = val * 0.3048;
    }

    return {
      num: val,
      label: isMetersToFeet ? 'Meters → Feet' : 'Feet → Meters',
      expectedEstimate,
      actualExact,
      qSymbol: isMetersToFeet ? `${val} m → ft` : `${val} ft → m`
    };
  };

  const proTip = (
    <>
      <div>
        <h4 className="text-emerald-400 font-bold mb-2">Meters to Feet</h4>
        <p>1. Multiply by 3.</p>
        <p>2. Then add 10% of that answer.</p>
        <p className="text-sm text-slate-400 mt-1">Example: 40 m → (40 × 3) = 120 → 120 + 12 = 132 ft.</p>
      </div>
      <div className="border-t border-slate-700 pt-4">
        <h4 className="text-emerald-400 font-bold mb-2">Feet to Meters</h4>
        <p>1. Divide by 10.</p>
        <p>2. Then multiply by 3.</p>
        <p className="text-sm text-slate-400 mt-1">Example: 40 ft → (40 ÷ 10) = 4 → 4 × 3 = 12 m.</p>
      </div>
    </>
  );

  return (
    <ConversionGameShell
      icon="📏"
      title="Meters ↔ Feet"
      storageKey="mentalCalcMetersFeetScores"
      proTipContent={proTip}
      generateQuestion={generateQuestion}
    />
  );
}
