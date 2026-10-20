"use client";

import React from 'react';
import ConversionGameShell from './ConversionGameShell';

export default function FahrenheitCelsiusConversionGame() {
  const generateQuestion = () => {
    const isFToC = Math.random() < 0.5;
    // Even numbers between -10 and 100 for clean mental math
    const val = (Math.floor(Math.random() * 55) - 5) * 2;

    let expectedEstimate, actualExact;
    if (isFToC) {
      expectedEstimate = (val - 30) / 2;
      actualExact = (val - 32) * 5 / 9;
    } else {
      expectedEstimate = (val * 2) + 30;
      actualExact = (val * 9 / 5) + 32;
    }

    return {
      num: val,
      label: isFToC ? 'Fahrenheit → Celsius' : 'Celsius → Fahrenheit',
      expectedEstimate,
      actualExact,
      qSymbol: isFToC ? `${val} °F → °C` : `${val} °C → °F`
    };
  };

  const proTip = (
    <>
      <div>
        <h4 className="text-emerald-400 font-bold mb-2">Fahrenheit to Celsius</h4>
        <p>1. Subtract 30.</p>
        <p>2. Then halve it (divide by 2).</p>
        <p className="text-sm text-slate-400 mt-1">Example: 80 °F → (80 - 30) = 50 → 50 ÷ 2 = 25 °C.</p>
      </div>
      <div className="border-t border-slate-700 pt-4">
        <h4 className="text-emerald-400 font-bold mb-2">Celsius to Fahrenheit</h4>
        <p>1. Double it (multiply by 2).</p>
        <p>2. Then add 30.</p>
        <p className="text-sm text-slate-400 mt-1">Example: 25 °C → (25 × 2) = 50 → 50 + 30 = 80 °F.</p>
      </div>
    </>
  );

  return (
    <ConversionGameShell
      icon="🌡️"
      title="Fahrenheit ↔ Celsius"
      storageKey="mentalCalcFahrenheitCelsiusScores"
      proTipContent={proTip}
      generateQuestion={generateQuestion}
    />
  );
}
