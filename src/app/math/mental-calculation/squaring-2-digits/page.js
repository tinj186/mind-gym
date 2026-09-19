import React from 'react';
import SquaringGame from '@/components/math/mental-calc/SquaringGame';

export default function Squaring2DigitsRoute() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <SquaringGame digits={2} />
    </div>
  );
}
