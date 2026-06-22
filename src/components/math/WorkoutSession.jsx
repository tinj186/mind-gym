"use client";

import { useState, useEffect, useTransition, useMemo, useCallback } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { finalizeWorkoutAction, updateWorkoutProgressAction, saveAttemptAction } from '@/app/actions/workoutActions';
import { normalizeQuestionData, deriveVisualProps } from '@/lib/intelligence/workout-utils';
import VisualRenderer, { ESSENTIAL_VISUALS } from '@/components/math/VisualRenderer';
import GroupingWorkspace from '@/components/tools/GroupingWorkspace'; // Import the interactive tool
import MultiStepInput from '@/components/math/MultiStepInput'; // Multi-Step Input
import MathInput from '@/components/math/MathInput'; // Advanced Math Input
import confetti from 'canvas-confetti';

import ExamReviewBoard from '@/components/math/ExamReviewBoard';

export default function WorkoutSession({ studentId, level, initialQuestions = [], initialIndex = 0, initialLog = [], title = "Daily Training Sequence", mode = "daily", subtopicId, isSandbox = false }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [answersLog, setAnswersLog] = useState(initialLog);
  const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState("");
  const [startTime, setStartTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showBarModel, setShowBarModel] = useState(false);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState(null);
  const [singleInputAnswer, setSingleInputAnswer] = useState("");

  const isP1 = level === "Primary 1";
  
  const normalizedQuestion = useMemo(() => 
    normalizeQuestionData(initialQuestions[currentIndex]), 
  [currentIndex, initialQuestions]);

  const currentVisual = normalizedQuestion?.visualEngine?.componentToRender;
  
  const visualProps = useMemo(() => 
    deriveVisualProps(normalizedQuestion), 
  [normalizedQuestion]);

  const isTextAnswer = /[a-zA-Z]/.test(String(normalizedQuestion?.finalAnswer || ''));

  // 🛡️ Universal Content Guard: Validates based on the presence of DATA, not component names.
  const hasVisualContent = useMemo(() => {
    if (!currentVisual || currentVisual === "NONE" || normalizedQuestion?.modelData?.hideVisual) return false;

    // 1. MODERN VISUALS (Picture Graphs, Ordinal Lines, etc.)
    const componentData = normalizedQuestion?.visualEngine?.componentData;
    if (componentData && Object.keys(componentData).length > 0) return true;

    // 2. STATIC VISUALS (Clocks, Shapes, Number Bonds)
    const modelData = normalizedQuestion?.modelData;
    if (modelData && Object.keys(modelData).length > 0) return true;

    // 3. LEGACY VISUALS (Counting Objects)
    if (visualProps && visualProps.totalItems > 0) return true;

    // If no data payloads exist, the AI hallucinated an empty visual.
    return false; 
  }, [currentVisual, visualProps, normalizedQuestion]);

  // 🛡️ Universal Essential Guard: Data-driven display timing.
  // Assumes visuals are essential parts of the question unless the database explicitly flags them as a scaffold/hint.
  const isEssential = (
    normalizedQuestion?.visualEngine?.isEssential !== false &&
    normalizedQuestion?.metadata?.isScaffold !== true
  ) && hasVisualContent;

  const hasValidatedToken = React.useRef(false);

  // 🛡️ Forward-Button & Deep-Link Guard
  useEffect(() => {
    if (hasValidatedToken.current) return;
    if (isSandbox) {
      hasValidatedToken.current = true;
      return;
    }
    
    if (sessionStorage.getItem('allow_workout') !== 'true') {
      console.warn("Unauthorized/Stale entry detected. Redirecting to dashboard.");
      window.location.replace('/math');
      return;
    }
    hasValidatedToken.current = true;
    // Consume the token immediately so a refresh/forward action kicks them out
    sessionStorage.removeItem('allow_workout');
  }, [isSandbox]);

  // Injecting Console Debugger
  useEffect(() => {
    if (!normalizedQuestion) return;
    console.group(`🔍 [WorkoutSession] Question ${currentIndex + 1} Logic Trace`);
    console.log("Question ID:", normalizedQuestion?.id);
    console.log("Topic:", normalizedQuestion?.topic);
    console.log("Subtopic:", normalizedQuestion?.subtopic);
    console.log("Difficulty:", normalizedQuestion?.difficulty);
    console.log("Type:", normalizedQuestion?.type);
    console.log("Visual Context:", visualProps);
    
    // Troubleshooting common failure points
    if (isNaN(visualProps.totalItems)) console.error("❌ ERROR: totalItems is NaN.");
    if (visualProps.totalItems === 10) console.warn("💡 INFO: totalItems is 10 (Standard or Fallback).");
    
    if (!currentVisual && isEssential) console.error("❌ ERROR: componentToRender is missing for an Essential Visual!");
    
    console.groupEnd();
  }, [currentIndex, normalizedQuestion, visualProps, currentVisual, isEssential]);

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

  // --------------------------------------------------

  const moveToNext = useCallback((result) => {
    const nextIndex = currentIndex + 1;
    const newLog = [...answersLog, result];
    setAnswersLog(newLog);
    setAttempts(0);
    setStartTime(Date.now());
    setShowHint(false);
    setShowSolution(false);
    setShowBarModel(false);
    setFeedback(null);
    setSingleInputAnswer("");

    // Part 2: Real-Time Saving & Persistence
    if (!isSandbox) {
      startTransition(async () => {
        try {
          await saveAttemptAction(studentId, result);
          if (nextIndex < initialQuestions.length) {
            await updateWorkoutProgressAction(studentId, { currentIndex: nextIndex, answersLog: newLog });
            localStorage.setItem(`active_workout_${studentId}`, JSON.stringify({
              initialQuestions,
              currentIndex: nextIndex,
              answersLog: newLog,
              mode,
              subtopicId
            }));
          }
        } catch (e) { console.error("Real-time save failed:", e); }
      });
    }

    if (nextIndex < initialQuestions.length) {
      setCurrentIndex(nextIndex);
    } else {
      handleFinish(newLog);
    }
  }, [currentIndex, answersLog, initialQuestions.length, studentId]);

  const handleAnswer = async (submittedAnswer) => {
    let isCorrect = false;

    // Handle array of answers from MultiStepInput
    if (typeof submittedAnswer === 'object' && submittedAnswer !== null && !Array.isArray(submittedAnswer)) {
      const steps = normalizedQuestion.inputRequirement?.steps || [];
      // Fast-path strict matching
      isCorrect = true;
      for (let i = 0; i < steps.length; i++) {
        const studentVal = String(submittedAnswer[i] || '').replace(/\s+/g, '').toLowerCase();
        const expectedVal = String(steps[i].expectedAnswer).replace(/\s+/g, '').toLowerCase();
        if (studentVal !== expectedVal) {
          isCorrect = false;
          break;
        }
      }

      // If fast-path fails, call AI multi-step grader
      if (!isCorrect) {
        try {
          const res = await fetch('/api/grade-multi-step', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentAnswers: submittedAnswer,
              expectedSteps: steps,
              questionText: normalizedQuestion.question
            })
          });
          if (res.ok) {
            const data = await res.json();
            isCorrect = data.isCorrect;
          }
        } catch (e) {
          console.error("Multi-step AI grading failed", e);
        }
      }

      // Serialize answer for logs
      submittedAnswer = JSON.stringify(submittedAnswer);
    } else {
      const cleanString = (str) => {
        return String(str || '')
          .replace(/\\\s/g, ' ') // MathLive escaped spaces
          .replace(/\\text\{([^\}]+)\}/g, '$1') // MathLive text wrappers
          .replace(/\\operatorname\{\\mathrm\{([^\}]+)\}\}/g, '$1') // MathLive text wrappers
          .replace(/\\mathrm\{([^\}]+)\}/g, '$1') // MathLive text wrappers
          .replace(/\\/g, '') // Any remaining latex slashes
          .replace(/\s+/g, '') // Strip ALL spaces for resilient math grading
          .toLowerCase();
      };
      
      const studentAns = cleanString(submittedAnswer);
      const realAns = cleanString(normalizedQuestion.finalAnswer);
      const accepted = normalizedQuestion.acceptedAnswers ? normalizedQuestion.acceptedAnswers.map(a => cleanString(a)) : [];
      isCorrect = studentAns === realAns || accepted.includes(studentAns);
    }
    if (isCorrect) {
      setFeedback('correct');
      const result = {
        questionId: normalizedQuestion.id,
        subTopicId: normalizedQuestion.subtopic || "",
        topicId: normalizedQuestion.topic,
        level: normalizedQuestion.level,
        subject: normalizedQuestion.subject,
        isCorrect: attempts === 0, // Mastery is only "Success" if gotten right on the 1st try
        assistedCorrect: attempts > 0,
        actualCorrect: true,
        studentAnswer: submittedAnswer,
        attempts: attempts + 1,
        timeSpent: Math.floor((Date.now() - startTime) / 1000)
      };

      setTimeout(() => {
        moveToNext(result);
      }, 1500);
    } else {
      setLastSubmittedAnswer(submittedAnswer);
      setFeedback('wrong');
      const nextAttempt = attempts + 1;
      setAttempts(nextAttempt);

      if (nextAttempt === 1) {
        // STRIKE 1: Show conceptual hint
        setShowHint(true);
        if (isP1) setShowBarModel(true);
        
        // Automatically open the grouping tool for relevant question types
        if (!hasAutoOpened && ['COUNTING_OBJECTS', 'EQUAL_GROUPS', 'GROUPING_WORKSPACE'].includes(currentVisual)) {
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
    if (isSandbox) {
      setSummary({ averageGrowth: 0, rankUps: [] });
      return;
    }
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
      <ExamReviewBoard 
        summary={summary} 
        initialQuestions={initialQuestions} 
        answersLog={answersLog} 
        mode={mode}
      />
    );
  }

  // Safety Catch for empty workouts or loading errors
  if (!normalizedQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-8 bg-white border-4 border-slate-50 rounded-[3rem] shadow-xl">
        <div className="text-4xl mb-4">🏋️</div>
        <h2 className="text-2xl font-black text-slate-900">Arena Empty</h2>
        <p className="text-slate-400">We couldn't find enough exercises for your current level.</p>
        <div className="flex gap-4 justify-center pt-4">
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-blue-600 text-white rounded-full font-black text-sm hover:bg-blue-700 transition-colors">↻ Retry Load</button>
          <button onClick={() => window.location.replace('/math')} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-full font-black text-sm hover:bg-slate-200 transition-colors">Exit Arena</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      {/* Session Title Header */}
      <div className="flex flex-col mb-2">
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] block">
          Syllabus_Mode // {title.toUpperCase().replace(/\s/g, '_')}
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">{title}</h1>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {initialQuestions.map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full transition-colors ${i < currentIndex ? 'bg-green-500' : i === currentIndex ? 'bg-blue-500' : 'bg-slate-100'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="bg-white border-4 border-slate-50 rounded-[3rem] p-12 space-y-8 shadow-xl"
        >
          <h3 className="text-3xl font-black text-slate-900">{normalizedQuestion.question}</h3>
          {normalizedQuestion.inputRequirement?.inputType === 'MULTI_STEP_INPUT' && (
            <p className="text-slate-500 font-bold text-lg">✏️ Write your working and final answer below.</p>
          )}

          {/* 
            DEBUG LOG: Keep this active if issues persist. 
            Note: hideVisual: true in logs means the box is hidden by default. 
          */}

          {/* Robust Visual Engine - Guarded by Attempt count unless Essential */}
          {(attempts > 0 || isEssential) && currentVisual && currentVisual !== "NONE" && hasVisualContent && (
            <div className="mt-8 p-8 bg-white border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-500">
              
              <VisualRenderer 
                type={currentVisual} 
                data={normalizedQuestion?.visualEngine?.componentData || {}}
                modelData={normalizedQuestion.modelData} // Pass the full modelData
                visualProps={visualProps}
                setIsToolOpen={setIsToolOpen}
                questionId={normalizedQuestion.id}
                difficulty={normalizedQuestion.difficulty}
                topic={normalizedQuestion.topic}
                attempts={attempts}
              />
            </div>
          )}

          {feedback && feedback !== 'solution_revealed' && (
            <div className={`p-6 rounded-2xl text-center font-black text-white ${feedback === 'correct' ? 'bg-green-500' : 'bg-rose-500'}`}>
              {feedback === 'correct' ? 'PERFECT FORM!' : 'ADJUSTING GRIP...'}
            </div>
          )}

          {feedback !== 'solution_revealed' ? (
            normalizedQuestion.inputRequirement?.inputType === 'MULTI_STEP_INPUT' && normalizedQuestion.inputRequirement?.steps ? (
              <MultiStepInput 
                steps={normalizedQuestion.inputRequirement.steps} 
                onSubmit={handleAnswer} 
                disabled={feedback === 'correct'}
              />
            ) : normalizedQuestion.options && normalizedQuestion.options.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {normalizedQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={feedback === 'correct'}
                    onClick={() => handleAnswer(opt.replace(/^[A-D]:\s*/, '').trim())}
                    className="text-left p-6 border-4 border-slate-200 rounded-2xl text-xl font-black transition-all hover:border-slate-900 hover:bg-slate-50 active:scale-95 disabled:opacity-50"
                  >
                    <span className="inline-block w-8 h-8 rounded-full border-2 border-slate-900 text-center leading-7 mr-4 text-sm">{['A','B','C','D'][idx] || idx + 1}</span>
                    {opt.replace(/^[A-D]:\s*/, '')}
                  </button>
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <MathInput
                  key={`input-${currentIndex}-${attempts}`}
                  autoFocus
                  value={singleInputAnswer}
                  onChange={setSingleInputAnswer}
                  onEnter={() => handleAnswer(singleInputAnswer)}
                  disabled={feedback === 'correct'}
                />
              </div>
            )
          ) : (
            <button
              onClick={() => {
                const failedResult = {
                  questionId: normalizedQuestion.id,
                  subTopicId: normalizedQuestion.subtopic || "",
                  topicId: normalizedQuestion.topic,
                  level: normalizedQuestion.level,
                  subject: normalizedQuestion.subject,
                  isCorrect: false,
                  assistedCorrect: false,
                  actualCorrect: false,
                  studentAnswer: lastSubmittedAnswer,
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
              <p className="text-amber-900 font-bold text-sm">💡 HINT: {normalizedQuestion.hint || "Try counting carefully!"}</p>
            </div>
          )}

          {feedback === 'solution_revealed' && (
            <div className="p-6 bg-rose-50 rounded-2xl border-2 border-rose-200 animate-in zoom-in-95">
              <p className="text-rose-900 font-black text-xs uppercase tracking-widest mb-2">Form Check: Let's see the steps</p>
              <p className="text-slate-700 text-sm italic leading-relaxed whitespace-pre-wrap">{normalizedQuestion.solution}</p>
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
                  modelData={normalizedQuestion.modelData}
                  onClose={() => setIsToolOpen(false)}
                  questionId={normalizedQuestion.id}
                  difficulty={normalizedQuestion.difficulty}
                  mode={visualProps.mode}
                  totalItems={visualProps.totalItems}
                  icon={visualProps.icon}
                  expectedGroups={visualProps.expectedGroups}
                  targetGroupSize={visualProps.targetSize}
                  showTargetSize={normalizedQuestion.topic !== 'Division'}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}