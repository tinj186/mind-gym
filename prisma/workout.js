import { prisma } from '@/lib/db';

/**
 * Generates a curated 10-question workout based on the 20/60/20 Rep Structure.
 * 
 * Structure:
 * - 20% Warm-up: High mastery (Synapse > 80)
 * - 60% Core Workout: Mastery bottlenecks (Synapse 30-60)
 * - 20% Challenge: New/Unmastered topics (Synapse < 30)
 * 
 * @param {string} studentId - The unique ID of the student.
 * @param {string} level - The primary level (e.g., "Primary 1").
 */
export async function getDailyWorkout(studentId, level) {
  const totalQuestions = 10;
  
  // 1. Fetch Student Mastery records
  const masteryRecords = await prisma.studentMastery.findMany({
    where: { studentId },
    select: { subTopicId: true, synapseStrength: true }
  });

  const warmUpTopics = masteryRecords.filter(m => m.synapseStrength >= 80).map(m => m.subTopicId);
  const coreTopics = masteryRecords.filter(m => m.synapseStrength >= 30 && m.synapseStrength < 60).map(m => m.subTopicId);
  const challengeTopics = masteryRecords.filter(m => m.synapseStrength < 30).map(m => m.subTopicId);

  const workout = [];

  // Helper to fetch random questions from specific subtopics
  const fetchRandomQuestions = async (subtopicIds, limit, excludeIds = []) => {
    if (subtopicIds.length === 0) return [];
    return prisma.$queryRaw`
      SELECT * FROM "QuestionBank" 
      WHERE "level" = ${level} 
      AND "subtopic" IN (${subtopicIds})
      AND "isApproved" = true
      AND "difficulty" IN ('Foundation', 'Standard', 'Advanced')
      AND "id" NOT IN (${excludeIds.length > 0 ? excludeIds : ['']})
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;
  };

  // 2. 20% Warm-up (2 Reps)
  const warmUpQuestions = await fetchRandomQuestions(warmUpTopics, 2);
  workout.push(...warmUpQuestions);

  // 3. 60% Core Workout (6 Reps)
  const coreQuestions = await fetchRandomQuestions(coreTopics, 6, workout.map(q => q.id));
  workout.push(...coreQuestions);

  // 4. 20% Challenge (2 Reps)
  // Includes topics with low synapse OR topics the student hasn't tried yet
  const allSubtopics = await prisma.questionBank.findMany({
    where: { 
      level,
      isApproved: true,
      difficulty: { in: ['Foundation', 'Standard', 'Advanced'] }
    },
    distinct: ['subtopic'],
    select: { subtopic: true }
  });
  
  const attemptedSubtopics = masteryRecords.map(m => m.subTopicId);
  const unattemptedTopics = allSubtopics
    .map(s => s.subtopic)
    .filter(name => !attemptedSubtopics.includes(name));

  const challengePool = [...challengeTopics, ...unattemptedTopics];
  const challengeQuestions = await fetchRandomQuestions(challengePool, 2, workout.map(q => q.id));
  workout.push(...challengeQuestions);

  // 5. Fallback logic: If we don't have enough specific questions, fill with random ones for that level
  if (workout.length < totalQuestions) {
    const remaining = totalQuestions - workout.length;
    const fillers = await prisma.questionBank.findMany({
      where: { 
        level,
        isApproved: true,
        difficulty: { in: ['Foundation', 'Standard', 'Advanced'] },
        id: { notIn: workout.map(q => q.id) }
      },
      take: remaining
    });
    workout.push(...fillers);
  }

  return workout.map(q => ({
    ...q,
    modelData: typeof q.modelData === 'string' ? JSON.parse(q.modelData) : q.modelData,
    options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
  }));
}