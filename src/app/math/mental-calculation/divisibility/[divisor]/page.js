import React from 'react';
import DivisibilityGame from '@/components/math/mental-calc/DivisibilityGame';
import { notFound } from 'next/navigation';

const HINTS = {
  '2': 'The last digit must be even (0, 2, 4, 6, or 8).',
  '3': 'The sum of all digits must be divisible by 3.',
  '4': 'The last two digits form a number that is divisible by 4.',
  '5': 'The last digit must be 0 or 5.',
  '6': 'The number must be divisible by both 2 and 3.',
  '7': 'Subtract a multiple of 7 (zeroing the ones position). The remaining number is divisible by 7.',
  '8': 'The last three digits form a number that is divisible by 8.',
  '9': 'The sum of all digits must be divisible by 9.',
  '11': 'Alternating subtract and add the digits. If the result is divisible by 11, the original number is too.'
};

export default async function DivisibilityRoute({ params }) {
  const resolvedParams = await params;
  const divisorStr = resolvedParams.divisor;
  const divisor = parseInt(divisorStr, 10);
  const hint = HINTS[divisorStr];

  if (isNaN(divisor) || !hint) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <DivisibilityGame divisor={divisor} hint={hint} />
    </div>
  );
}
