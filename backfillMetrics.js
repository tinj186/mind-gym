import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function calculateSynapseStrength(recentAttempts, oldMastery) {
  if (!recentAttempts || recentAttempts.length === 0) {
    return { score: oldMastery, metrics: { correctness: 0, efficiency: 0, consistency: 0 } };
  }
  const BENCHMARK_SEC = 30;
  const correctCount = recentAttempts.filter(a => a.isCorrect).length;
  const correctnessScore = (correctCount / recentAttempts.length) * 100;
  const efficiencyScores = recentAttempts.map(a => {
    const time = a.timeSpentSecs || BENCHMARK_SEC;
    if (time <= BENCHMARK_SEC) return 100;
    const penalty = ((time - BENCHMARK_SEC) / BENCHMARK_SEC) * 100;
    return Math.max(0, 100 - penalty);
  });
  const efficiencyScore = efficiencyScores.reduce((sum, val) => sum + val, 0) / efficiencyScores.length;
  const binaryScores = recentAttempts.map(a => a.isCorrect ? 1 : 0);
  const meanBinary = binaryScores.reduce((sum, val) => sum + val, 0) / binaryScores.length;
  const variance = binaryScores.reduce((sum, val) => sum + Math.pow(val - meanBinary, 2), 0) / binaryScores.length;
  const consistencyScore = Math.max(0, 100 - (variance / 0.25) * 100);
  return {
    metrics: {
      correctness: Math.round(correctnessScore),
      efficiency: Math.round(efficiencyScore),
      consistency: Math.round(consistencyScore)
    }
  };
}

async function run() {
  const masteries = await prisma.studentMastery.findMany();
  let count = 0;
  for (const m of masteries) {
    if (!m.fluencyMetrics) {
      const logs = await prisma.attemptLog.findMany({
        where: { studentId: m.studentId, question: { topic: m.topicId, subtopic: m.subTopicId } },
        orderBy: { createdAt: 'desc' },
        take: 10
      });
      if (logs.length > 0) {
        const { metrics } = calculateSynapseStrength(logs, m.synapseStrength);
        await prisma.studentMastery.update({
          where: { id: m.id },
          data: { fluencyMetrics: metrics }
        });
        count++;
      }
    }
  }
  console.log(`Updated ${count} masteries.`);
}
run().then(() => prisma.$disconnect());
