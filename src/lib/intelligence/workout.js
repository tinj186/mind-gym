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
          let sessionMatchesRequest = true;
          
          const requestedMode = options?.mode || 'daily';
          const activeMode = active.mode; // Will be undefined for legacy sessions

          if (activeMode) {
            if (activeMode !== requestedMode) {
              console.log(`[Trainer] Discarding locked session because mode changed from ${activeMode} to ${requestedMode}`);
              sessionMatchesRequest = false;
            } else if (requestedMode === 'isolation' && options?.subtopicId) {
              if (active.subtopicId !== options.subtopicId) {
                console.log(`[Trainer] Discarding locked session because isolation target changed`);
                sessionMatchesRequest = false;
              }
            }
          } else {
            // Legacy handling for old sessions without a mode
            if (requestedMode === 'isolation' && options?.subtopicId) {
              const isMatchingIsolation = ordered.every(q => q.subtopic === options.subtopicId);
              if (!isMatchingIsolation) {
                console.log(`[Trainer] Discarding legacy locked session to start new isolation target: ${options.subtopicId}`);
                sessionMatchesRequest = false;
              }
            } else if (requestedMode === 'daily') {
              // If requested mode is daily, discard legacy isolation sessions
              const isAllSameSubtopic = ordered.length > 3 && ordered.every(q => q.subtopic === ordered[0].subtopic);
              if (isAllSameSubtopic) {
                console.log(`[Trainer] Discarding legacy locked session because it appears to be an isolation session, but daily was requested`);
                sessionMatchesRequest = false;
              }
            }
          }

          // Check if the student changed their primary level
          const sessionLevel = ordered[0]?.level;
          if (sessionLevel && sessionLevel !== primaryLevel) {
            console.log(`[Trainer] Discarding locked session because level changed from ${sessionLevel} to ${primaryLevel}`);
            sessionMatchesRequest = false;
          }

          if (sessionMatchesRequest) {
            console.log(`[Trainer] Resuming locked session for student ${studentId}`);
            return ordered.map(formatWorkoutQuestion);
          } else {
            // Let it fall through to generate a new workout
          }
        } else {
          // If some questions are missing, clear the session to prevent partial workouts
          await prisma.studentProfile.update({ where: { id: studentId }, data: { activeWorkout: null } });
        }
      }
    }
  }

  const workout = [];

  if (options?.mode === 'isolation' && options?.subtopicId) {
    // STRICT TARGETING: Fetch 10 questions exclusively matching this subtopic ID
    
    // Capitalize difficulty from URL (e.g., 'foundation' -> 'Foundation')
    const difficultyFilter = options.difficulty 
      ? options.difficulty.charAt(0).toUpperCase() + options.difficulty.slice(1) 
      : undefined;

    const whereClause = {
      level: primaryLevel,
      isApproved: true,
      isArchived: false,
      subtopic: options.subtopicId,
      ...(difficultyFilter ? { difficulty: difficultyFilter } : {})
    };

    const allIds = await prisma.questionBank.findMany({
      where: whereClause,
      select: { id: true }
    });
    
    if (allIds.length > 0) {
      // Fisher-Yates shuffle for true randomness
      for (let i = allIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
      }
      
      const selectedIds = allIds.slice(0, 10).map(item => item.id);
      const questions = await prisma.questionBank.findMany({
        where: { id: { in: selectedIds } }
      });
      const ordered = selectedIds.map(id => questions.find(q => q.id === id)).filter(Boolean);
      workout.push(...ordered);
    }
  } else {
    // 1. Fetch Student Mastery records
    const masteryRecords = await prisma.studentMastery.findMany({
      where: { studentId },
      select: { subTopicId: true, synapseStrength: true }
    });

    const warmUpTopics = masteryRecords.filter(m => m.synapseStrength >= 80).map(m => m.subTopicId);
    const coreTopics = masteryRecords.filter(m => m.synapseStrength >= 30 && m.synapseStrength < 60).map(m => m.subTopicId);
    const challengeTopics = masteryRecords.filter(m => m.synapseStrength < 30).map(m => m.subTopicId);

    console.log(`[Trainer Logic] Warmup: ${warmUpTopics.length}, Core: ${coreTopics.length}, Challenge: ${challengeTopics.length}`);

    // ENHANCED: Fetch IDs and shuffle them in memory to prevent consecutive row selection
    const fetchRandomQuestions = async (subtopicIds, limit, excludeIds = []) => {
      if (subtopicIds.length === 0) return [];
      
      const where = {
        level: primaryLevel,
        isApproved: true,
        isArchived: false,
        difficulty: { in: ['Foundation', 'Standard', 'Advanced'] },
        id: { notIn: excludeIds },
        subtopic: { in: subtopicIds }
      };

      const allIds = await prisma.questionBank.findMany({
        where,
        select: { id: true }
      });
      
      if (allIds.length === 0) return [];

      // Fisher-Yates shuffle
      for (let i = allIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
      }

      const selectedIds = allIds.slice(0, limit).map(item => item.id);

      const questions = await prisma.questionBank.findMany({
        where: { id: { in: selectedIds } }
      });
      return selectedIds.map(id => questions.find(q => q.id === id)).filter(Boolean);
    };

    // 2. 20% Warm-up (2 Reps)
    const warmUpQuestions = await fetchRandomQuestions(warmUpTopics, 2);
    workout.push(...warmUpQuestions);

    // 3. 60% Core Workout (6 Reps)
    const coreQuestions = await fetchRandomQuestions(coreTopics, 6, workout.map(q => q.id));
    workout.push(...coreQuestions);

    // 4. 20% Challenge (2 Reps)
    const allSubtopics = await prisma.questionBank.findMany({
      where: { 
        level: primaryLevel, 
        isApproved: true,
        isArchived: false,
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
  }

  // 5. Fallback logic: If we don't have enough specific questions, fill with random ones for that level
  // ONLY for daily mode! Isolation mode should never mix in random topics.
  if (options?.mode !== 'isolation' && workout.length < totalQuestions) {
    const remaining = totalQuestions - workout.length;
    const fallbackWhere = { level: primaryLevel, isApproved: true, isArchived: false, id: { notIn: workout.map(q => q.id) } };
    
    const fallbackIds = await prisma.questionBank.findMany({
      where: fallbackWhere,
      select: { id: true }
    });

    if (fallbackIds.length > 0) {
      for (let i = fallbackIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fallbackIds[i], fallbackIds[j]] = [fallbackIds[j], fallbackIds[i]];
      }

      const selectedFallbackIds = fallbackIds.slice(0, remaining).map(item => item.id);
      const fillers = await prisma.questionBank.findMany({
        where: { id: { in: selectedFallbackIds } }
      });
      const orderedFillers = selectedFallbackIds.map(id => fillers.find(q => q.id === id)).filter(Boolean);
      workout.push(...orderedFillers);
    }
  }

  const finalWorkout = workout.map(formatWorkoutQuestion);

  await prisma.studentProfile.upsert({
    where: { id: studentId },
    update: {
      activeWorkout: {
        // Ensure all fields are explicitly set to prevent partial updates
        questionIds: finalWorkout.map(q => q.id), 
        currentIndex: 0,
        answersLog: [],
        mode: options?.mode || 'daily',
        subtopicId: options?.subtopicId || null
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
        answersLog: [],
        mode: options?.mode || 'daily',
        subtopicId: options?.subtopicId || null
      }
    }
  });

  return finalWorkout;
}