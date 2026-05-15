"use client";

import { useState, useEffect, useTransition, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { finalizeWorkoutAction, updateWorkoutProgressAction, saveAttemptAction } from '@/lib/intelligence/workoutActions';
import GroupingWorkspace from '@/components/tools/GroupingWorkspace'; // Import the interactive tool
import confetti from 'canvas-confetti';

/**
 * Neural Scaffold Visual Renderer
 * Handles specific rendering logic for various tool types in the syllabus.
 */
function VisualRenderer({ type, data, visualProps, setIsToolOpen, questionId, difficulty, topic }) {
  if (!type || type === "NONE") return null;

  switch (type) {
    case 'COUNTING_OBJECTS':
      return (
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-3">
            {(data.items || data.groups?.flatMap(count => 
              Array(count).fill(data.icons?.[0] || '⭐')
            ))?.map((item, idx) => (
              <span key={idx} className="text-5xl drop-shadow-sm">{item}</span>
            ))}
          </div>
          <button 
            onClick={() => setIsToolOpen(true)}
            className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
          >
            ✨ Open Grouping Tool to Help
          </button>
        </div>
      );

    case 'NUMBER_CARDS':
      return (
        <div className="flex flex-wrap justify-center gap-4 py-2">
          {(data.items || data.numbers || [])?.map((val, idx) => (
            <div key={idx} className="w-20 h-28 md:w-24 md:h-32 bg-white rounded-2xl border-4 border-slate-200 flex items-center justify-center shadow-lg transform rotate-[-1deg] odd:rotate-[1deg] hover:rotate-0 transition-transform">
              <span className="text-3xl font-black text-slate-900">{val}</span>
            </div>
          ))}
        </div>
      );

    case 'NUMBER_PATTERN':
      return (
        <div className="flex flex-wrap justify-center items-center gap-4 py-2">
          {(data.items || [])?.map((val, idx) => (
            <div key={idx} className={`w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl border-4 flex items-center justify-center shadow-lg transition-all ${
              val === '?' ? 'border-blue-500 bg-blue-50 text-blue-700 animate-pulse' : 'border-slate-200 text-slate-900'
            }`}>
              <span className="text-3xl font-black">{val}</span>
            </div>
          ))}
          {data.rule && <p className="text-sm text-slate-500 mt-4">Rule: {data.rule}</p>}
        </div>
      );

    case 'EQUAL_GROUPS':
      const numGroups = data.numGroups || data.groups || data.groupCount || 0;
      const itemsPerGroup = data.itemsPerGroup || data.size || 1;
      return (
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-8">
            {Array.from({ length: numGroups }).map((_, gIdx) => (
              <div key={gIdx} className="relative p-6 bg-white rounded-[2rem] border-4 border-dashed border-slate-200 flex gap-3 shadow-inner">
                <span className="absolute -top-3 -left-2 bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                  Grp {gIdx + 1}
                </span>
                {Array.from({ length: itemsPerGroup }).map((_, iIdx) => (
                  <span key={iIdx} className="text-4xl animate-in zoom-in duration-300" style={{ animationDelay: `${(gIdx * 5 + iIdx) * 50}ms` }}>
                    {data.emoji || data.icon || '🎈'}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setIsToolOpen(true)}
            className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
          >
            ✨ Open Grouping Tool to Help
          </button>
        </div>
      );

    case 'GROUPING_WORKSPACE':
      return (
        <GroupingWorkspace
          modelData={data}
          onClose={() => {}}
          questionId={questionId}
          difficulty={difficulty}
          mode={visualProps.mode}
          totalItems={visualProps.totalItems}
          expectedGroups={visualProps.expectedGroups}
          targetGroupSize={visualProps.targetSize}
          showTargetSize={topic !== 'Division'}
          icon={visualProps.icon}
        />
      );

    default:
      return (
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Unknown Visual Signature</p>
          <code className="text-[10px] bg-white p-2 rounded-lg text-slate-400">
            {JSON.stringify(data)}
          </code>
        </div>
      );
  }
}

export default function WorkoutSession({ studentId, level, initialQuestions = [], initialIndex = 0, initialLog = [] }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [answersLog, setAnswersLog] = useState(initialLog);
  const [startTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showBarModel, setShowBarModel] = useState(false);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState(null);

  const currentQuestion = initialQuestions[currentIndex];
  const isP1 = level === "Primary 1";

  // --- PHASE 4: MEMOIZED PROP DERIVATION ---
  const visualProps = useMemo(() => {
    const modelData = currentQuestion?.modelData || {};
    
    const total = 
      modelData.totalItems || 
      modelData.total || 
      (Array.isArray(modelData.groups) ? modelData.groups.reduce((sum, c) => sum + (Number(c) || 0), 0) : null) ||
      (Array.isArray(modelData.items) ? modelData.items.length : null) ||
      (Array.isArray(modelData.numbers) ? modelData.numbers.length : null) ||
      (modelData.numGroups && modelData.itemsPerGroup ? (modelData.numGroups * modelData.itemsPerGroup) : null) ||
      (Number(currentQuestion?.finalAnswer) || 10);

    const icon = 
      modelData.emoji || 
      modelData.icon || 
      (Array.isArray(modelData.icons) ? modelData.icons[0] : null) || 
      (Array.isArray(modelData.items) ? modelData.items[0] : null) || 
      '🎈';

    const mode = (currentQuestion?.subtopic?.includes('Division') || currentQuestion?.topic?.includes('Division')) 
      ? 'SHARING' : (modelData.mode || 'GROUPING');

    return {
      modelData,
      totalItems: total,
      icon,
      mode,
      expectedGroups: modelData.numGroups || modelData.groups || modelData.groupCount,
      targetSize: modelData.targetGroupSize || modelData.itemsPerGroup || modelData.size || 10
    };
  }, [currentQuestion]);

  // Injecting Console Debugger
  useEffect(() => {
    if (!currentQuestion) return;
    console.group(`🔍 [WorkoutSession] Question ${currentIndex + 1} Logic Trace`);
    console.log("Question ID:", currentQuestion?.id);
    console.log("Visual Context:", visualProps);
    
    // Troubleshooting common failure points
    if (isNaN(visualProps.totalItems)) console.error("❌ ERROR: totalItems is NaN.");
    if (visualProps.totalItems === 100) console.warn("⚠️ WARNING: totalItems is 100 (Fallback detected).");
    if (!visualProps.modelData.type) console.error("❌ ERROR: modelData.type is missing!");
    
    console.groupEnd();
  }, [currentIndex, currentQuestion, visualProps]);

  // Part 2: Resume Logic (Mount check)
  useEffect(() => {
    const saved = localStorage.getItem(`active_workout_${studentId}`);
    if (saved) {
      const data = JSON.parse(saved);
      // Only resume if the saved session is incomplete and has more progress
      if (data.answersLog?.length > answersLog.length && data.answersLog?.length < 10) {
        setAnswersLog(data.answersLog);
        setCurrentIndex(data.currentIndex);
        console.log("💪 Workout resumed from local storage.");
      }
    }
  }, [studentId]);

  // Handle Rank Up Celebration
  useEffect(() => {
    if (summary && summary.rankUps.length > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b']
      });
    }
  }, [summary]);
  // --------------------------------------------------

  // --- TOOL AUTO-OPEN LOGIC ---
  useEffect(() => {
    // Reset for the new question
    setHasAutoOpened(false);
    setIsToolOpen(false);
  }, [currentIndex]);

  useEffect(() => {
    const isWorkspace = currentQuestion?.visualEngine?.componentToRender === "GROUPING_WORKSPACE" || 
                       currentQuestion?.modelData?.type === "GROUPING_WORKSPACE";
    
    // Only auto-open if it hasn't opened for this specific question yet
    if (isWorkspace && !hasAutoOpened && attempts === 0) {
      setIsToolOpen(true);
      setHasAutoOpened(true); // Mark as triggered so it won't fight the Close button
    }
  }, [currentQuestion, hasAutoOpened, attempts]);
  // --------------------------------------------------

  const moveToNext = useCallback((result) => {
    const nextIndex = currentIndex + 1;
    const newLog = [...answersLog, result];
    setAnswersLog(newLog);
    setAttempts(0);
    setShowHint(false);
    setShowSolution(false);
    setShowBarModel(false);
    setFeedback(null);

    // Part 2: Real-Time Saving & Persistence
    startTransition(async () => {
      try {
        await saveAttemptAction(studentId, result);
        if (nextIndex < initialQuestions.length) {
          await updateWorkoutProgressAction(studentId, { currentIndex: nextIndex, answersLog: newLog });
          localStorage.setItem(`active_workout_${studentId}`, JSON.stringify({
            initialQuestions,
            currentIndex: nextIndex,
            answersLog: newLog
          }));
        }
      } catch (e) { console.error("Real-time save failed:", e); }
    });

    if (nextIndex < initialQuestions.length) {
      setCurrentIndex(nextIndex);
    } else {
      handleFinish(newLog);
    }
  }, [currentIndex, answersLog, initialQuestions.length, studentId]);

  const handleAnswer = async (submittedAnswer) => {
    const isCorrect = String(submittedAnswer).trim().toLowerCase() === String(currentQuestion.finalAnswer).trim().toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      const result = {
        questionId: currentQuestion.id,
        subTopicId: currentQuestion.subtopic || "",
        topicId: currentQuestion.topic,
        level: currentQuestion.level,
        subject: currentQuestion.subject,
        isCorrect: attempts === 0, // Mastery is only "Success" if gotten right on the 1st try
        assistedCorrect: attempts > 0,
        actualCorrect: true,
        attempts: attempts + 1,
        timeSpent: Math.floor((Date.now() - startTime) / 1000)
      };

      setTimeout(() => {
        moveToNext(result);
      }, 1500);
    } else {
      setFeedback('wrong');
      const nextAttempt = attempts + 1;
      setAttempts(nextAttempt);

      if (nextAttempt === 1) {
        // STRIKE 1: Show conceptual hint
        setShowHint(true);
        if (isP1) setShowBarModel(true);
        
        // Automatically open the grouping tool for relevant question types
        if (!hasAutoOpened && ['COUNTING_OBJECTS', 'EQUAL_GROUPS'].includes(currentQuestion.modelData?.type)) {
          setIsToolOpen(true);
          setHasAutoOpened(true);
        }
        
        setTimeout(() => setFeedback(null), 1500);
      } else {
        // STRIKE 2: Reveal solution and block further input
        setShowHint(false);
        setShowSolution(true);
        setFeedback('solution_revealed');
      }
    }
  };

  const handleFinish = (finalLog) => {
    startTransition(async () => {
      const summaryData = await finalizeWorkoutAction(studentId, finalLog);
      // CLEAR SESSION: Remove the lock once complete
      await updateWorkoutProgressAction(studentId, null);
      localStorage.removeItem(`active_workout_${studentId}`);
      setSummary(summaryData);
    });
  };

  if (summary) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-8">
        <h2 className="text-5xl font-black text-slate-900">Workout Summary</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-blue-50 p-8 rounded-3xl">
            <p className="text-sm font-black text-blue-500 uppercase">Growth</p>
            <p className="text-4xl font-black text-blue-900">+{summary.averageGrowth}%</p>
          </div>
        </div>
        {summary.rankUps.length > 0 && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-500 text-white p-6 rounded-3xl font-black text-xl"
          >
            🏆 RANK UP! Next Tier Unlocked.
          </motion.div>
        )}
        <button onClick={() => window.location.href = '/gym'} className="px-12 py-4 bg-slate-900 text-white rounded-full font-black">Finish Training</button>
      </div>
    );
  }

  // Safety Catch for empty workouts or loading errors
  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-8 bg-white border-4 border-slate-50 rounded-[3rem] shadow-xl">
        <div className="text-4xl mb-4">🏋️</div>
        <h2 className="text-2xl font-black text-slate-900">Arena Empty</h2>
        <p className="text-slate-400">We couldn't find enough exercises for your current level.</p>
        <div className="flex gap-4 justify-center pt-4">
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-blue-600 text-white rounded-full font-black text-sm hover:bg-blue-700 transition-colors">↻ Retry Load</button>
          <button onClick={() => window.location.href = '/gym'} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-full font-black text-sm hover:bg-slate-200 transition-colors">Exit Arena</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {initialQuestions.map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full transition-colors ${i < currentIndex ? 'bg-green-500' : i === currentIndex ? 'bg-blue-500' : 'bg-slate-100'}`} />
          ))}
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
          <span>Regenerate Workout</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="bg-white border-4 border-slate-50 rounded-[3rem] p-12 space-y-8 shadow-xl"
        >
          <h3 className="text-3xl font-black text-slate-900">{currentQuestion.question}</h3>

          {/* 
            DEBUG LOG: Keep this active if issues persist. 
            Note: hideVisual: true in logs means the box is hidden by default. 
          */}

          {/* Robust Visual Engine */}
          {currentQuestion.visualEngine && 
           currentQuestion.visualEngine.componentToRender !== "NONE" && (
            <div className="mt-8 p-8 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                NEURAL_SCAFFOLD // VISUAL AID
              </p>
              
              <VisualRenderer 
                type={currentQuestion.visualEngine.componentToRender} 
                data={currentQuestion.visualEngine.componentData}
                visualProps={visualProps}
                setIsToolOpen={setIsToolOpen}
                questionId={currentQuestion.id}
                difficulty={currentQuestion.difficulty}
                topic={currentQuestion.topic}
              />
            </div>
          )}

          {feedback && feedback !== 'solution_revealed' && (
            <div className={`p-6 rounded-2xl text-center font-black text-white ${feedback === 'correct' ? 'bg-green-500' : 'bg-rose-500'}`}>
              {feedback === 'correct' ? 'PERFECT FORM!' : 'ADJUSTING GRIP...'}
            </div>
          )}

          {feedback !== 'solution_revealed' ? (
            <input 
              key={`input-${currentIndex}-${attempts}`}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAnswer(e.target.value)}
              className="w-full text-4xl font-black p-8 bg-slate-50 rounded-3xl outline-none text-center"
              placeholder="?"
              disabled={feedback === 'correct'}
            />
          ) : (
            <button
              onClick={() => {
                const failedResult = {
                  questionId: currentQuestion.id,
                  subTopicId: currentQuestion.subtopic || "",
                  topicId: currentQuestion.topic,
                  level: currentQuestion.level,
                  subject: currentQuestion.subject,
                  isCorrect: false,
                  assistedCorrect: false,
                  actualCorrect: false,
                  attempts: attempts,
                  timeSpent: Math.floor((Date.now() - startTime) / 1000)
                };
                moveToNext(failedResult);
              }}
              className="w-full py-8 bg-slate-900 text-white rounded-3xl font-black text-2xl hover:bg-slate-800 transition-all active:scale-95"
            >
              NEXT REP →
            </button>
          )}

          {showHint && (
            <div className="p-6 bg-amber-50 rounded-2xl border-2 border-amber-200 animate-in fade-in slide-in-from-bottom-4">
              <p className="text-amber-900 font-bold text-sm">💡 HINT: {currentQuestion.hint || "Try counting carefully!"}</p>
            </div>
          )}

          {feedback === 'solution_revealed' && (
            <div className="p-6 bg-rose-50 rounded-2xl border-2 border-rose-200 animate-in zoom-in-95">
              <p className="text-rose-900 font-black text-xs uppercase tracking-widest mb-2">Form Check: Let's see the steps</p>
              <p className="text-slate-700 text-sm italic leading-relaxed">{currentQuestion.solution}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Interactive Tool Modal Overlay */}
      <AnimatePresence>
        {isToolOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden relative border-8 border-slate-100 shadow-2xl"
            >
              <button 
                onClick={() => setIsToolOpen(false)}
                className="absolute top-8 right-8 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black hover:bg-slate-200 z-50 text-xl"
              >
                ✕
              </button>
              <div className="p-12 overflow-y-auto max-h-[85vh]">
                <GroupingWorkspace
                  modelData={currentQuestion.modelData}
                  onClose={() => setIsToolOpen(false)}
                  questionId={currentQuestion.id}
                  difficulty={currentQuestion.difficulty}
                  mode={visualProps.mode}
                  totalItems={visualProps.totalItems}
                  icon={visualProps.icon}
                  expectedGroups={visualProps.expectedGroups}
                  targetGroupSize={visualProps.targetSize}
                  showTargetSize={currentQuestion.topic !== 'Division'}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}