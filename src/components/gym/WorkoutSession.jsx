"use client";

import { useState, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { finalizeWorkoutAction } from '@/lib/intelligence/workoutActions';
import GroupingWorkspace from '@/components/tools/GroupingWorkspace'; // Import the interactive tool

export default function WorkoutSession({ studentId, level, initialQuestions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersLog, setAnswersLog] = useState([]);
  const [startTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showBarModel, setShowBarModel] = useState(false);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState(null);

  const currentQuestion = initialQuestions[currentIndex];
  const isP1 = level === "Primary 1";

  // --- PHASE 3: TROUBLESHOOTING & PROP DERIVATION ---
  // We extract these to variables to allow logging and prevent NaN issues
  const modelData = currentQuestion?.modelData || {};
  
  const derivedTotal = 
    modelData.totalItems || 
    modelData.total || 
    (Array.isArray(modelData.groups) ? modelData.groups.reduce((sum, c) => sum + (Number(c) || 0), 0) : null) ||
    (Array.isArray(modelData.items) ? modelData.items.length : null) ||
    (Array.isArray(modelData.numbers) ? modelData.numbers.length : null) ||
    (modelData.numGroups && modelData.itemsPerGroup ? (modelData.numGroups * modelData.itemsPerGroup) : null) ||
    (Number(currentQuestion.finalAnswer) || 10);

  const derivedIcon = 
    modelData.emoji || 
    modelData.icon || 
    (Array.isArray(modelData.icons) ? modelData.icons[0] : null) || 
    (Array.isArray(modelData.items) ? modelData.items[0] : null) || 
    '🎈';

  const derivedMode = (currentQuestion.subtopic?.includes('Division') || currentQuestion.topic?.includes('Division')) 
    ? 'SHARING' : (modelData.mode || 'GROUPING');

  const derivedExpectedGroups = modelData.numGroups || modelData.groups || modelData.groupCount;
  
  const derivedTargetSize = modelData.targetGroupSize || modelData.itemsPerGroup || modelData.size || 10;

  // Injecting Console Debugger
  useEffect(() => {
    console.group(`🔍 [WorkoutSession] Question ${currentIndex + 1} Logic Trace`);
    console.log("Question ID:", currentQuestion?.id);
    console.log("Topic / Subtopic:", `${currentQuestion?.topic} / ${currentQuestion?.subtopic}`);
    console.log("Difficulty:", currentQuestion?.difficulty);
    console.log("Raw ModelData:", modelData);
    console.log("Derived Values:", {
      totalItems: derivedTotal,
      icon: derivedIcon,
      mode: derivedMode,
      expectedGroups: derivedExpectedGroups,
      targetSize: derivedTargetSize
    });
    
    // Troubleshooting common failure points
    if (isNaN(derivedTotal)) console.error("❌ ERROR: totalItems is NaN. Check finalAnswer conversion.");
    if (derivedTotal === 100) console.warn("⚠️ WARNING: totalItems is 100. This is likely a fallback.");
    if (!modelData.type) console.error("❌ ERROR: modelData.type is missing! Visuals will not render.");
    
    console.groupEnd();
  }, [currentIndex, currentQuestion]);
  // --------------------------------------------------

  const moveToNext = (result) => {
    const nextIndex = currentIndex + 1;
    const newLog = [...answersLog, result];
    setAnswersLog(newLog);
    setAttempts(0);
    setShowHint(false);
    setShowSolution(false);
    setFeedback(null);

    if (nextIndex < initialQuestions.length) {
      setCurrentIndex(nextIndex);
    } else {
      handleFinish(newLog);
    }
  };

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
        actualCorrect: true,
        attempts: attempts + 1,
        timeSpent: Math.floor((Date.now() - startTime) / 1000)
      };

      setTimeout(() => {
        moveToNext(result);
      }, 1500);
    } else {
      setFeedback('wrong');
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 2) {
        // "Double-Strike" - Show solution and move to next question
        setShowSolution(true);
        const failedResult = {
          questionId: currentQuestion.id,
          subTopicId: currentQuestion.subtopic || "",
          topicId: currentQuestion.topic,
          level: currentQuestion.level,
          subject: currentQuestion.subject,
          isCorrect: false, // Mastery will decay for this sub-topic
          actualCorrect: false,
          attempts: newAttempts,
          timeSpent: Math.floor((Date.now() - startTime) / 1000)
        };
        
        setTimeout(() => {
          moveToNext(failedResult);
        }, 3000); // Give them 3s to see the solution before moving on
      } else {
        setShowHint(true);
        setTimeout(() => setFeedback(null), 1500);
      }
    }
  };

  const handleFinish = (finalLog) => {
    startTransition(async () => {
      const summaryData = await finalizeWorkoutAction(studentId, finalLog);
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
          {currentQuestion.modelData && (
            <div className="space-y-4">
              {/* Spotter UI: Visual Assist Toggle for P1 */}
              {isP1 && currentQuestion.modelData.hideVisual && (
                <button 
                  onClick={() => setShowBarModel(!showBarModel)} 
                  className="text-xs font-black text-blue-500 uppercase tracking-widest"
                >
                  {showBarModel ? 'Hide Visual Assist' : 'Show Visual Assist 🔬'}
                </button>
              )}

              {(!currentQuestion.modelData.hideVisual || (isP1 && showBarModel)) && (
                <div className="p-8 bg-slate-50 rounded-[2rem] min-h-[200px] flex flex-col items-center justify-center border-2 border-slate-100">
                  
                  {/* 1. Standard Counting Type */}
                  {currentQuestion.modelData.type === 'COUNTING_OBJECTS' && (
                    <div className="flex flex-wrap justify-center gap-3">
                      {(currentQuestion.modelData.items || 
                        currentQuestion.modelData.groups?.flatMap(count => 
                          Array(count).fill(currentQuestion.modelData.icons?.[0] || '⭐')
                        ))?.map((item, idx) => (
                        <span key={idx} className="text-5xl drop-shadow-sm">{item}</span>
                      ))}
                    </div>
                  )}

                  {/* 1.5 Number Cards Renderer (Comparing / Patterns / Equations) */}
                  {currentQuestion.modelData.type === 'NUMBER_CARDS' && (
                    <div className="flex flex-wrap justify-center gap-4 py-2">
                      {(currentQuestion.modelData.items || currentQuestion.modelData.numbers || [])?.map((val, idx) => (
                        <div key={idx} className="w-20 h-28 md:w-24 md:h-32 bg-white rounded-2xl border-4 border-slate-200 flex items-center justify-center shadow-lg transform rotate-[-1deg] odd:rotate-[1deg] hover:rotate-0 transition-transform">
                          <span className="text-3xl font-black text-slate-900">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 1.6 Number Pattern Renderer */}
                  {currentQuestion.modelData.type === 'NUMBER_PATTERN' && (
                    <div className="flex flex-wrap justify-center items-center gap-4 py-2">
                      {(currentQuestion.modelData.items || [])?.map((val, idx) => (
                        <div key={idx} className={`w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl border-4 flex items-center justify-center shadow-lg transition-all ${
                          val === '?' ? 'border-blue-500 bg-blue-50 text-blue-700 animate-pulse' : 'border-slate-200 text-slate-900'
                        }`}>
                          <span className="text-3xl font-black">{val}</span>
                        </div>
                      ))}
                      {currentQuestion.modelData.rule && <p className="text-sm text-slate-500 mt-4">Rule: {currentQuestion.modelData.rule}</p>}
                    </div>
                  )}

                  {/* Trigger for Interactive Tool (The Spotter) */}
                  {['COUNTING_OBJECTS', 'EQUAL_GROUPS'].includes(currentQuestion.modelData.type) && (
                    <button 
                      onClick={() => setIsToolOpen(true)}
                      className="mt-6 px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
                    >
                      ✨ Open Grouping Tool to Help
                    </button>
                  )}

                  {/* 2. Equal Groups / Grouping Workspace (Multiplication/Division) */}
                  {/* Render for EQUAL_GROUPS (pre-grouped, static visual) */}
                  {currentQuestion.modelData.type === 'EQUAL_GROUPS' && (
                    <div className="flex flex-wrap justify-center gap-8">
                      {Array.from({ 
                        length: currentQuestion.modelData.numGroups || 
                                currentQuestion.modelData.groups || 
                                currentQuestion.modelData.groupCount || 0 
                      }).map((_, gIdx) => (
                        <div key={gIdx} className="relative p-6 bg-white rounded-[2rem] border-4 border-dashed border-slate-200 flex gap-3 shadow-inner">
                          {/* Group Label (Helper) */}
                          <span className="absolute -top-3 -left-2 bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                            Grp {gIdx + 1}
                          </span>
                          
                          {Array.from({ 
                            length: currentQuestion.modelData.itemsPerGroup || 
                                    currentQuestion.modelData.size || 
                                    // Infer size from final answer if missing (e.g. 40 total / 4 groups)
                                    (currentQuestion.modelData.finalAnswer / (currentQuestion.modelData.groupCount || 1)) ||
                                    1 
                          }).map((_, iIdx) => (
                            <span 
                              key={iIdx} 
                              className="text-4xl animate-in zoom-in duration-300" 
                              style={{ animationDelay: `${(gIdx * 5 + iIdx) * 50}ms` }}
                            >
                              {currentQuestion.modelData.emoji || 
                               currentQuestion.modelData.icon || 
                               currentQuestion.modelData.items?.[0] || 
                               '🎈'}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render the INTERACTIVE GROUPING_WORKSPACE tool */}
                  {currentQuestion.modelData.type === 'GROUPING_WORKSPACE' && (
                    <GroupingWorkspace
                      modelData={currentQuestion.modelData}
                      onClose={() => { /* No explicit close needed for workout session */ }}
                      questionId={currentQuestion.id}
                      difficulty={currentQuestion.difficulty}
                      mode={derivedMode}
                      totalItems={derivedTotal}
                      expectedGroups={derivedExpectedGroups}
                      targetGroupSize={derivedTargetSize}
                      showTargetSize={currentQuestion.topic !== 'Division'} // Assuming 'Division' topic implies target size is the answer
                      icon={derivedIcon}
                    />
                  )}

                  {/* 3. Safety Catch: If nothing renders, show the raw data keys to debug */}
                  {(!currentQuestion.modelData.type || 
                    !['COUNTING_OBJECTS', 'EQUAL_GROUPS', 'GROUPING_WORKSPACE', 'NUMBER_CARDS', 'NUMBER_PATTERN'].includes(currentQuestion.modelData.type)) && (
                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Unknown Visual Signature</p>
                      <code className="text-[10px] bg-white p-2 rounded-lg text-slate-400">
                        {JSON.stringify(currentQuestion.modelData)}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {feedback && (
            <div className={`p-6 rounded-2xl text-center font-black text-white ${feedback === 'correct' ? 'bg-green-500' : 'bg-rose-500'}`}>
              {feedback === 'correct' ? 'PERFECT FORM!' : 'ADJUSTING GRIP...'}
            </div>
          )}

          <input 
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleAnswer(e.target.value)}
            className="w-full text-4xl font-black p-8 bg-slate-50 rounded-3xl outline-none text-center"
            placeholder="?"
          />

          {showHint && (
            <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-100">
              <p className="text-blue-900 font-bold text-sm">{currentQuestion.solution.split('\n')[0]}</p>
            </div>
          )}

          {showSolution && (
            <div className="p-6 bg-slate-900 text-white rounded-2xl border-4 border-slate-800">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Trainer's Solution</p>
              <p className="font-bold text-sm leading-relaxed">{currentQuestion.solution}</p>
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
                      mode={derivedMode}
                      totalItems={derivedTotal}
                      icon={derivedIcon}
                      expectedGroups={derivedExpectedGroups}
                      targetGroupSize={derivedTargetSize}
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