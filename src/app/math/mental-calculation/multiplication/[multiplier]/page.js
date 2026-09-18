import React from 'react';
import MultiplicationGame from '@/components/math/mental-calc/MultiplicationGame';
import { notFound } from 'next/navigation';

export default async function MultiplicationRoute({ params }) {
  const p = await params;
  const multiplier = parseInt(p.multiplier, 10);
  
  if (isNaN(multiplier)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <MultiplicationGame multiplier={multiplier} />
    </div>
  );
}
