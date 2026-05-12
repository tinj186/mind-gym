/**
 * Calculates the updated Synapse Strength (Mastery) using a Weighted Moving Average.
 * Formula: NewMastery = (CurrentScore * 0.2) + (OldMastery * 0.8)
 * 
 * @param {number} currentScore - The score for the current session (0 to 100).
 * @param {number} oldMastery - The previous mastery level (0 to 100).
 * @returns {number} The updated mastery level, rounded to the nearest integer.
 */
export function calculateSynapseStrength(currentScore, oldMastery) {
  const weightCurrent = 0.2;
  const weightOld = 0.8;
  
  const newMastery = (currentScore * weightCurrent) + (oldMastery * weightOld);
  return Math.min(100, Math.max(0, Math.round(newMastery)));
}