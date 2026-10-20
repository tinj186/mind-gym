"use client";

import React from 'react';
import ConversionGameShell from './ConversionGameShell';

export default function PoundsKgConversionGame() {
  const generateQuestion = () => {
    const isLbsToKg = Math.random() < 0.5;
    const val = (Math.floor(Math.random() * 50) + 1) * 10;

    let expectedEstimate, actualExact;
    if (isLbsToKg) {
      const halved = val / 2;
      expectedEstimate = halved - (halved * 0.1);
      actualExact = val * 0.453592;
    } else {
      const doubled = val * 2;
      expectedEstimate = doubled + (doubled * 0.1);
      actualExact = val * 2.20462;
    }

    return {
      num: val,
      label: isLbsToKg ? 'Pounds → Kilograms' : 'Kilograms → Pounds',
      expectedEstimate,
      actualExact,
      qSymbol: isLbsToKg ? `${val} lbs → kg` : `${val} kg → lbs`
    };
  };

  const proTip = (
    <>
      <div>
        <h4 className="text-emerald-400 font-bold mb-2">Pounds to Kilograms</h4>
        <p>1. Divide by 2.</p>
        <p>2. Then subtract 10% of that answer.</p>
        <p className="text-sm text-slate-400 mt-1">Example: 40 lbs → (40 ÷ 2) = 20 → 20 - 2 = 18 kg.</p>
      </div>
      <div className="border-t border-slate-700 pt-4">
        <h4 className="text-emerald-400 font-bold mb-2">Kilograms to Pounds</h4>
        <p>1. Double it (multiply by 2).</p>
        <p>2. Then add 10% of that answer.</p>
        <p className="text-sm text-slate-400 mt-1">Example: 40 kg → (40 × 2) = 80 → 80 + 8 = 88 lbs.</p>
      </div>
    </>
  );

  return (
    <ConversionGameShell
      icon="⚖️"
      title="Pounds ↔ Kilograms"
      storageKey="mentalCalcPoundsKgScores"
      proTipContent={proTip}
      generateQuestion={generateQuestion}
    />
  );
}
