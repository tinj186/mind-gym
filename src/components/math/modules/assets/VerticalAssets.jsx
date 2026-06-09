import React from 'react';

export function getVerticalEmoji(labelText) {
  const norm = labelText.toLowerCase();
  
  if (norm.includes('giraffe')) return "🦒";
  if (norm.includes('tree') || norm.includes('plant')) return "🌳";
  if (norm.includes('ladder')) return "🪜";
  if (norm.includes('boy') || norm.includes('man') || norm.includes('person') || norm.includes('child')) return "🧍‍♂️";
  if (norm.includes('building') || norm.includes('house') || norm.includes('apartment')) return "🏢";
  if (norm.includes('lamp')) return "💡";
  
  return "🏢"; // Logical fallback vector asset
}