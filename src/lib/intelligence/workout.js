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

function formatWorkoutQuestion(q) {
  if (!q) return null;
  return {
    ...q,
    modelData: (() => {
      let data = typeof q.modelData === 'string' ? JSON.parse(q.modelData) : (q.modelData || { type: 'NONE' });
      if ((!data.items || data.items.length === 0) && q.visualItems) {
        try {
          const legacyItems = typeof q.visualItems === 'string' ? JSON.parse(q.visualItems) : q.visualItems;
          data.items = Array.isArray(legacyItems) ? legacyItems : [];
        } catch (e) { console.error(`[Bridge Error] Question ${q.id}:`, e); }
      }
      return data;
    })(),
    options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
  };
}

export async function getDailyWorkout(studentId, primaryLevel, options = { mode: 'daily', subtopicId: null }) {
  const totalQuestions = 10;
  
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentId }
  });

  // 0. SESSION LOCK: Check if a workout is already in progress
  if (profile?.activeWorkout) {
    const active = profile.activeWorkout;
    if (active.questionIds?.length > 0) {
      // Safety: If current index is out of bounds, clear and start fresh
      if (active.currentIndex >= active.questionIds.length) {
        await prisma.studentProfile.update({ where: { id: studentId }, data: { activeWorkout: null } });
      } else {
        const existingQuestions = await prisma.questionBank.findMany({ where: { id: { in: active.questionIds } } });
        const ordered = active.questionIds.map(id => existingQuestions.find(q => q.id === id)).filter(Boolean);
        if (ordered.length === active.questionIds.length) {
          console.log(`[Trainer] Resuming locked session for student ${studentId}`);
          return ordered.map(formatWorkoutQuestion);
        } else {
          // If some questions are missing, clear the session to prevent partial workouts
          await prisma.studentProfile.update({ where: { id: studentId }, data: { activeWorkout: null } });
        }
      }
    }
  }

  if (options?.mode === 'isolation' && options?.subtopicId) {
    // STRICT TARGETING: Fetch 10 questions exclusively matching this subtopic ID
    
    // Capitalize difficulty from URL (e.g., 'foundation' -> 'Foundation')
    const difficultyFilter = options.difficulty 
      ? options.difficulty.charAt(0).toUpperCase() + options.difficulty.slice(1) 
      : undefined;

    const questions = await prisma.questionBank.findMany({
      where: {
        level: primaryLevel,
        isApproved: true,
        subtopic: options.subtopicId,
        ...(difficultyFilter ? { difficulty: difficultyFilter } : {})
      },
      take: 10
    });
    
    return questions.map(formatWorkoutQuestion);
  }

  // 1. Fetch Student Mastery records
  const masteryRecords = await prisma.studentMastery.findMany({
    where: { studentId },
    select: { subTopicId: true, synapseStrength: true }
  });

  const warmUpTopics = masteryRecords.filter(m => m.synapseStrength >= 80).map(m => m.subTopicId);
  const coreTopics = masteryRecords.filter(m => m.synapseStrength >= 30 && m.synapseStrength < 60).map(m => m.subTopicId);
  const challengeTopics = masteryRecords.filter(m => m.synapseStrength < 30).map(m => m.subTopicId);

  console.log(`[Trainer Logic] Warmup: ${warmUpTopics.length}, Core: ${coreTopics.length}, Challenge: ${challengeTopics.length}`);

  const workout = [];

  // ENHANCED: Fetch with Random Offset to prevent static repetition
  const fetchRandomQuestions = async (subtopicIds, limit, excludeIds = []) => {
    if (subtopicIds.length === 0) return [];
    
    const where = {
      level: primaryLevel,
      isApproved: true,
      difficulty: { in: ['Foundation', 'Standard', 'Advanced'] },
      id: { notIn: excludeIds },
      subtopic: { in: subtopicIds }
    };

    const count = await prisma.questionBank.count({ where });
    if (count === 0) return [];

    const randomSkip = Math.floor(Math.random() * Math.max(0, count - limit));

    return prisma.questionBank.findMany({
      where,
      skip: randomSkip,
      take: limit
    });
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
      level: primaryLevel, 
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
    const fallbackCount = await prisma.questionBank.count({
      where: { level: primaryLevel, isApproved: true, id: { notIn: workout.map(q => q.id) } }
    });
    const fallbackSkip = Math.floor(Math.random() * Math.max(0, fallbackCount - remaining));

    const fillers = await prisma.questionBank.findMany({
      where: { level: primaryLevel, isApproved: true, id: { notIn: workout.map(q => q.id) } },
      skip: fallbackSkip,
      take: remaining
    });
    workout.push(...fillers);
  }

  const finalWorkout = workout.map(formatWorkoutQuestion);

  await prisma.studentProfile.upsert({
    where: { id: studentId },
    update: {
      activeWorkout: {
        // Ensure all fields are explicitly set to prevent partial updates
        questionIds: finalWorkout.map(q => q.id), 
        currentIndex: 0,
        answersLog: []
      }
    },
    create: {
      id: studentId,
      name: studentId === "default-student" ? "Default Student" : "New Student",
      externalId: studentId === "default-student" ? "default-external-id" : studentId,
      primaryLevel: primaryLevel,
      activeWorkout: {
        questionIds: finalWorkout.map(q => q.id),
        currentIndex: 0,
        answersLog: []
      }
    }
  });

  return finalWorkout;
}