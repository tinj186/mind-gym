/**
 * Calculates the updated Synapse Confidence (formerly Mastery) using a Multidimensional Weighted Approach.
 * 
 * Components:
 * - Correctness (60%): First-try success rate.
 * - Efficiency (20%): Time-to-solve compared to a 30s benchmark.
 * - Consistency (20%): Low variance in correctness over recent reps.
 * 
 * Fluency Cap:
 * - If first-try correct rate is < 80%, score is capped at 85 (Standard).
 * - Requires consistent, fast, accurate performance to reach 100 (Advanced).
 * 
 * @param {Array} recentAttempts - Array of objects: { isCorrect: boolean, timeSpentSecs: number }
 * @param {number} oldMastery - The previous mastery level (0 to 100).
 * @returns {Object} { score: number, metrics: { correctness, efficiency, consistency } }
 */
export function calculateSynapseStrength(recentAttempts, oldMastery) {
  if (!recentAttempts || recentAttempts.length === 0) {
    return { score: oldMastery, metrics: { correctness: 0, efficiency: 0, consistency: 0 } };
  }

  const BENCHMARK_SEC = 30;

  // 1. Correctness (60%)
  const correctCount = recentAttempts.filter(a => a.isCorrect).length;
  const correctnessScore = (correctCount / recentAttempts.length) * 100;

  // 2. Efficiency (20%)
  // If time <= 30s, score is 100. If > 30s, scales down to 0 at 60s.
  const efficiencyScores = recentAttempts.map(a => {
    const time = a.timeSpentSecs || BENCHMARK_SEC; // fallback if missing
    if (time <= BENCHMARK_SEC) return 100;
    const penalty = ((time - BENCHMARK_SEC) / BENCHMARK_SEC) * 100;
    return Math.max(0, 100 - penalty);
  });
  const efficiencyScore = efficiencyScores.reduce((sum, val) => sum + val, 0) / efficiencyScores.length;

  // 3. Consistency (20%)
  // Calculate variance of the binary correctness array (1 for correct, 0 for incorrect)
  const binaryScores = recentAttempts.map(a => a.isCorrect ? 1 : 0);
  const meanBinary = binaryScores.reduce((sum, val) => sum + val, 0) / binaryScores.length;
  const variance = binaryScores.reduce((sum, val) => sum + Math.pow(val - meanBinary, 2), 0) / binaryScores.length;
  // Max variance for a binary set is 0.25 (e.g., [1,0,1,0]).
  // Consistency Score maps variance 0 -> 100, variance 0.25 -> 0
  const consistencyScore = Math.max(0, 100 - (variance / 0.25) * 100);

  // 4. Calculate Raw Multidimensional Score
  const rawScore = (correctnessScore * 0.6) + (efficiencyScore * 0.2) + (consistencyScore * 0.2);

  // 5. Exponential Moving Average to smooth growth
  const weightCurrent = 0.3;
  const weightOld = 0.7;
  let newMastery = (rawScore * weightCurrent) + (oldMastery * weightOld);

  // 6. The Fluency Cap
  // Prevent grinding volume from artificially hitting 100% without mastery.
  if (correctnessScore < 80) {
    newMastery = Math.min(newMastery, 85);
  }

  return {
    score: Math.min(100, Math.max(0, Math.round(newMastery))),
    metrics: {
      correctness: Math.round(correctnessScore),
      efficiency: Math.round(efficiencyScore),
      consistency: Math.round(consistencyScore)
    }
  };
}