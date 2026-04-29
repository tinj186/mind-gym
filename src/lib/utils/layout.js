/**
 * Generates deterministic coordinates for items based on a seed (Question ID).
 * Coordinates are returned as percentages (0-100) to allow scaling between different container sizes.
 */
export function generatePositions(groups, seed, difficulty = 'Standard') {
  const safeSeed = seed ? String(seed) : 'seed-0';
  const seedNum = [...safeSeed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let currentSeed = seedNum;
  
  const random = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  const allPositions = [];
  if (!Array.isArray(groups)) return [];

  const totalItems = groups.reduce((a, b) => a + b, 0);
  
  // Configuration for an orderly grid (10 items per row)
  const itemsPerRow = 10;
  const rowCount = Math.ceil(totalItems / itemsPerRow);
  
  // Spacing in percentages (0-100) - scale down gaps dynamically to ensure high counts fit
  const hGap = totalItems > 60 ? 7 : 8; 
  const vGap = totalItems > 60 ? 8 : 12;

  // Calculate total grid dimensions to center it
  const gridW = (Math.min(totalItems, itemsPerRow) - 1) * hGap;
  const gridH = (rowCount - 1) * vGap;

  const startX = 50 - (gridW / 2);
  const startY = 50 - (gridH / 2);

  let globalIdx = 0;
  groups.forEach((count, gIdx) => {
    for (let i = 0; i < count; i++) {
      const row = Math.floor(globalIdx / itemsPerRow);
      const col = globalIdx % itemsPerRow;

      const x = startX + (col * hGap);
      const y = startY + (row * vGap);

      allPositions.push({ id: `item-${gIdx}-${i}`, x, y });
      globalIdx++;
    }
  });

  return allPositions;
}