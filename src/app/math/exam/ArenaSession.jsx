"use client";

import { useState, useEffect, useMemo } from 'react';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VisualRenderer from '@/components/math/VisualRenderer';
import { normalizeQuestionData, deriveVisualProps } from '@/lib/intelligence/workout-utils';
import ExamReviewBoard from '@/components/math/ExamReviewBoard';
import { saveMockExamAction } from '@/app/actions/examActions';
import MathInput from '@/components/math/MathInput';

export default function ArenaSession({ studentId, level, examPaper, durationMinutes }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [activeSection, setActiveSection] = useState('mcq'); // mcq | short | structured
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Stores questionId -> studentInput response map
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [scoreSummary, setScoreSummary] = useState(null);

  // Normalize entire exam paper ONCE on mount so that random variables 
  // and final answers are stable for grading and review.
  const [normalizedExamPaper] = useState(() => {
    const normalizeList = (list = []) => list.map(q => normalizeQuestionData(q));
    return {
      mcq: normalizeList(examPaper.mcq),
      short: normalizeList(examPaper.short),
      structured: normalizeList(examPaper.structured)
    };
  });

  // Flatten questions to handle simple global master index loops
  const currentQuestionsList = normalizedExamPaper[activeSection] || [];
  const activeQuestion = currentQuestionsList[currentIndex];
  const normalizedQuestion = activeQuestion;

  const visualProps = useMemo(() => {
    if (!normalizedQuestion) return null;
    return deriveVisualProps(normalizedQuestion);
  }, [normalizedQuestion]);

  const isTextAnswer = /[a-zA-Z]/.test(String(normalizedQuestion?.finalAnswer || ''));

  const hasValidatedToken = React.useRef(false);

  // 🛡️ Forward-Button & Deep-Link Guard
  useEffect(() => {
    if (hasValidatedToken.current) return;

    if (sessionStorage.getItem('allow_workout') !== 'true') {
      console.warn("Unauthorized/Stale entry detected. Redirecting to dashboard.");
      window.location.replace('/math');
      return;
    }
    hasValidatedToken.current = true;
    sessionStorage.removeItem('allow_workout');
  }, []);

  // Global Countdown Controller
  useEffect(() => {
    if (timeLeft <= 0) {
      handleExamSubmission();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < currentQuestionsList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Section jumper logic
      if (activeSection === 'mcq' && normalizedExamPaper.short.length > 0) {
        setActiveSection('short');
        setCurrentIndex(0);
      } else if (activeSection === 'short' && normalizedExamPaper.structured.length > 0) {
        setActiveSection('structured');
        setCurrentIndex(0);
      }
    }
  };

  const handleExamSubmission = async () => {
    // Calculate scores across all sections
    const calculateScore = (questions) => {
      if (!questions.length) return { correct: 0, total: 0 };
      const correctCount = questions.filter(q => {
        const inputType = q.inputRequirement?.inputType || 'STANDARD_TEXT';
        const rawAns = answers[q.id];

        const cleanString = (str) => {
          return String(str || '')
            .replace(/\\\s/g, ' ')
            .replace(/\\text\{([^\}]+)\}/g, '$1')
            .replace(/\\operatorname\{\\mathrm\{([^\}]+)\}\}/g, '$1')
            .replace(/\\mathrm\{([^\}]+)\}/g, '$1')
            .replace(/\\/g, '')
            .replace(/\s+/g, '')
            .toLowerCase();
        };

        if (inputType === 'MULTI_STEP_INPUT') {
          const steps = q.inputRequirement?.steps || [];
          const studentObj = typeof rawAns === 'object' && rawAns !== null ? rawAns : {};
          return steps.every((step, idx) => {
            let sAns = cleanString(studentObj[idx]);
            let rAns = cleanString(step.expectedAnswer);
            return sAns === rAns;
          });
        } else {
          const studentAns = cleanString(rawAns);
          const realAns = cleanString(q.finalAnswer);
          const accepted = q.acceptedAnswers ? q.acceptedAnswers.map(a => cleanString(a)) : [];
          return studentAns === realAns || accepted.includes(studentAns);
        }
      }).length;
      return { correct: correctCount, total: questions.length };
    };

    const mcq = calculateScore(normalizedExamPaper.mcq);
    const short = calculateScore(normalizedExamPaper.short);
    const structured = calculateScore(normalizedExamPaper.structured);
    
    const totalCorrect = mcq.correct + short.correct + structured.correct;
    const totalQuestions = mcq.total + short.total + structured.total;

    const scoreSummaryData = {
      total: { correct: totalCorrect, total: totalQuestions, percent: Math.round((totalCorrect / totalQuestions) * 100) },
      sections: { mcq, short, structured }
    };

    setScoreSummary(scoreSummaryData);

    // Prepare data to send to database
    const flattenedQuestions = [
      ...normalizedExamPaper.mcq.map(q => ({ ...q, type: 'MULTIPLE_CHOICE' })),
      ...normalizedExamPaper.short.map(q => ({ ...q, type: 'SHORT_ANSWER' })),
      ...normalizedExamPaper.structured.map(q => ({ ...q, type: 'STRUCTURED' }))
    ];
    
    const generatedAnswersLog = flattenedQuestions.map(q => {
      const inputType = q.inputRequirement?.inputType || 'STANDARD_TEXT';
      const rawAns = answers[q.id];
      let isCorrect = false;
      let displayAnswer = rawAns || '';

      const cleanString = (str) => {
        let s = String(str || '')
          .replace(/\\\s/g, ' ')
          .replace(/\\text\{([^}]*)\}/g, '$1')
          .replace(/\\operatorname\{\\mathrm\{([^}]*)\}\}/g, '$1')
          .replace(/\\mathrm\{([^}]*)\}/g, '$1')
          .replace(/\\times/g, '*')
          .replace(/\\div/g, '/')
          .replace(/\\cdot/g, '*')
          .replace(/[\u200B-\u200D\uFEFF]/g, '')
          .replace(/’/g, "'")
          .replace(/\\/g, '')
          .toLowerCase();

        // 1. Protect and standardize place values and conjunctions first
        s = s.replace(/\band\b/g, '');
        s = s.replace(/,/g, '');
        s = s.replace(/\bten\b/g, 'tens');
        s = s.replace(/\bone\b/g, 'ones');

        // 2. Map English word numbers to digits for robust grading
        const wordMap = {
          'first': '1st', 'second': '2nd', 'third': '3rd', 'fourth': '4th',
          'fifth': '5th', 'sixth': '6th', 'seventh': '7th', 'eighth': '8th',
          'ninth': '9th', 'tenth': '10th', 'eleventh': '11th', 'twelfth': '12th',
          // Note: 'one' and 'ten' are intentionally omitted to protect "ones" and "tens" place values
          'two': '2', 'three': '3', 'four': '4', 'five': '5',
          'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
          'eleven': '11', 'twelve': '12'
        };

        Object.keys(wordMap).forEach(key => {
          s = s.replace(new RegExp(`\\b${key}\\b`, 'g'), wordMap[key]);
        });

        return s.replace(/\s+/g, '');
      };

      if (inputType === 'MULTI_STEP_INPUT') {
        const steps = q.inputRequirement?.steps || [];
        const studentObj = typeof rawAns === 'object' && rawAns !== null ? rawAns : {};
        isCorrect = steps.every((step, idx) => {
          let sAns = cleanString(studentObj[idx]);
          let rAns = cleanString(step.expectedAnswer);
          return sAns === rAns;
        });
        
        displayAnswer = steps.map((step, idx) => {
          const label = step.stepLabel || `Step ${idx + 1}`;
          const val = cleanString(studentObj[idx]);
          return `${label}: ${val}`;
        }).join(' | ');
        
      } else {
        const studentAns = cleanString(rawAns);
        const realAns = cleanString(q.finalAnswer);
        const accepted = q.acceptedAnswers ? q.acceptedAnswers.map(a => cleanString(a)) : [];
        isCorrect = studentAns === realAns || accepted.includes(studentAns);
        displayAnswer = cleanString(rawAns);
      }

      return {
        questionId: q.id,
        studentAnswer: displayAnswer,
        actualCorrect: isCorrect
      };
    });

    // Save to PostgreSQL backend
    saveMockExamAction(studentId, scoreSummaryData, flattenedQuestions, generatedAnswersLog).catch(console.error);

    setIsSubmitted(true);
    setShowReport(true);
  };

  if (showReport && scoreSummary) {
    const flattenedQuestions = [
      ...normalizedExamPaper.mcq.map(q => ({ ...q, type: 'MULTIPLE_CHOICE' })),
      ...normalizedExamPaper.short.map(q => ({ ...q, type: 'SHORT_ANSWER' })),
      ...normalizedExamPaper.structured.map(q => ({ ...q, type: 'STRUCTURED' }))
    ];
    
    const generatedAnswersLog = flattenedQuestions.map(q => {
      const inputType = q.inputRequirement?.inputType || 'STANDARD_TEXT';
      const rawAns = answers[q.id];
      let isCorrect = false;
      let displayAnswer = rawAns || '';

      const cleanString = (str) => {
        return String(str || '')
          .replace(/\\\s/g, ' ')
          .replace(/\\text\{([^\}]+)\}/g, '$1')
          .replace(/\\operatorname\{\\mathrm\{([^\}]+)\}\}/g, '$1')
          .replace(/\\mathrm\{([^\}]+)\}/g, '$1')
          .replace(/\\times/g, '*')
          .replace(/\\div/g, '/')
          .replace(/\\cdot/g, '*')
          .replace(/\\/g, '')
          .replace(/\s+/g, '')
          .toLowerCase();
      };

      if (inputType === 'MULTI_STEP_INPUT') {
        const steps = q.inputRequirement?.steps || [];
        const studentObj = typeof rawAns === 'object' && rawAns !== null ? rawAns : {};
        isCorrect = steps.every((step, idx) => {
          let sAns = cleanString(studentObj[idx]);
          let rAns = cleanString(step.expectedAnswer);
          return sAns === rAns;
        });
        
        displayAnswer = steps.map((step, idx) => {
          const label = step.stepLabel || `Step ${idx + 1}`;
          const val = cleanString(studentObj[idx]);
          return `${label}: ${val}`;
        }).join(' | ');
        
      } else {
        const studentAns = cleanString(rawAns);
        const realAns = cleanString(q.finalAnswer);
        const accepted = q.acceptedAnswers ? q.acceptedAnswers.map(a => cleanString(a)) : [];
        isCorrect = studentAns === realAns || accepted.includes(studentAns);
        displayAnswer = cleanString(rawAns);
      }

      return {
        questionId: q.id,
        studentAnswer: displayAnswer,
        actualCorrect: isCorrect
      };
    });

    return (
      <div className="animate-in fade-in zoom-in-95 duration-500 w-full">
        <ExamReviewBoard 
          summary={null} 
          initialQuestions={flattenedQuestions}
          answersLog={generatedAnswersLog}
          mode="mock_exam"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
      
      {/* 1. LEFT CONTAINER: THE QUESTION BOOKLET VIEWPORT */}
      <div className="lg:col-span-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col justify-between min-h-[70vh]">
        <div>
          <div className="flex justify-between items-end border-b-4 border-black pb-4 mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MOE_SIMULATION_MODE</span>
              <span className="bg-black text-white px-3 py-1 text-xs font-black uppercase inline-block w-fit mt-1">
                BOOKLET // SECTION_{activeSection.toUpperCase()}
              </span>
            </div>
            <span className={`text-2xl font-black ${timeLeft < 300 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
              ⏱️ {formatTime(timeLeft)}
            </span>
          </div>

          <div className="mb-8 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-start gap-4 shadow-sm">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-black text-rose-900 text-sm uppercase tracking-wide">Continuous Session Warning</h3>
              <p className="text-rose-700 text-xs mt-1 font-medium">
                Do not refresh this page, close the tab, or hit the back button. Mock Exams do not save mid-way progress. Exiting will permanently end your session.
              </p>
            </div>
          </div>

          {activeQuestion ? (
            <div className="space-y-8 relative">
              <div className="absolute right-0 top-0 text-[10px] font-mono text-slate-300 select-all" title="Question ID">{normalizedQuestion.id}</div>
              <div className="space-y-2">
                <span className="text-xs font-black text-blue-600 uppercase">Question {currentIndex + 1}</span>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">
                  {normalizedQuestion.question}
                </h2>
              </div>

              {normalizedQuestion?.visualEngine?.componentToRender && normalizedQuestion.visualEngine.componentToRender !== "NONE" && (
                <div className="mt-6 p-6 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <VisualRenderer 
                    type={normalizedQuestion.visualEngine.componentToRender} 
                    data={normalizedQuestion.visualEngine.componentData}
                    visualProps={visualProps}
                    setIsToolOpen={() => {}} // Disabled for exams
                    questionId={normalizedQuestion.id}
                    difficulty={normalizedQuestion.difficulty}
                    topic={normalizedQuestion.topic}
                    attempts={0} // Reset to zero so it stays un-highlighted
                    isExam={true} // NEW EXAM ENVIRONMENT FIREWALL
                  />
                </div>
              )}
              
              {/* Conditional Multi-Choice Layout Interface */}
              {activeSection === 'mcq' && (
                <div className="grid grid-cols-1 gap-4 pt-4">
                  {(activeQuestion.options || []).map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(activeQuestion.id, opt)}
                      className={`text-left p-6 border-4 border-black text-lg font-black transition-all transform active:scale-[0.98] ${
                        answers[activeQuestion.id] === opt 
                          ? 'bg-black text-white shadow-none translate-x-1 translate-y-1' 
                          : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50'
                      }`}
                    >
                      <span className="inline-block w-8 h-8 rounded-full border-2 border-current text-center leading-7 mr-4 text-sm font-mono">{idx + 1}</span>
                      {opt.replace(/^[A-D]:\s*/, '')}
                    </button>
                  ))}
                </div>
              )}

              {/* Short / Structured Input Layout Interface */}
              {activeSection !== 'mcq' && (
                <div className="pt-4">
                  {normalizedQuestion?.inputRequirement?.inputType === 'MULTI_STEP_INPUT' ? (
                    <div className="space-y-4 w-full">
                      {(normalizedQuestion.inputRequirement?.steps || []).map((step, index) => {
                        const currentMultiAnswers = typeof answers[activeQuestion.id] === 'object' ? answers[activeQuestion.id] : {};
                        return (
                          <div key={index} className="flex flex-col bg-slate-50 p-6 border-4 border-black">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                              {step.stepLabel || step.label}
                            </label>
                            <MathInput
                              id={`multi-step-${index}`}
                              value={currentMultiAnswers[index] || ''}
                              onChange={(val) => {
                                const updated = { ...currentMultiAnswers, [index]: val };
                                handleSelectAnswer(activeQuestion.id, updated);
                              }}
                              level={level}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-black mb-2 uppercase text-slate-400 tracking-tighter">Student Workspace Input Response</label>
                      <MathInput
                        value={typeof answers[activeQuestion.id] === 'string' ? answers[activeQuestion.id] : ''}
                        onChange={(val) => handleSelectAnswer(activeQuestion.id, val)}
                        level={level}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400 font-bold">No active questions available in this subsection tracker.</p>
          )}
        </div>

        {/* Booklet Pagination Footing */}
        <div className="flex justify-between items-center border-t-2 border-slate-100 pt-6 mt-8">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(p => p - 1)}
            className="border-4 border-black px-6 py-2 text-xs font-black uppercase disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            ← Prev
          </button>
          <button
            disabled={activeSection === 'structured' && currentIndex === currentQuestionsList.length - 1}
            onClick={handleNextQuestion}
            className="bg-black text-white px-6 py-2 text-xs font-black uppercase disabled:opacity-30 hover:bg-slate-800 transition-colors border-4 border-black"
          >
            {currentIndex === currentQuestionsList.length - 1 && activeSection !== 'structured' ? 'Next Section →' : 'Next →'}
          </button>
        </div>
      </div>

      {/* 2. RIGHT CONTAINER: THE DIGITAL OPTICAL ANSWER SHEET (OAS) */}
      <div className="bg-slate-50 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col justify-between h-fit lg:sticky lg:top-24">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest border-b-4 border-black pb-2 mb-6">
            Exam Sheet Matrices
          </h3>
          
          {/* Section Selector Hub */}
          <div className="grid grid-cols-3 gap-2 mb-8 text-[9px] font-black">
            {['mcq', 'short', 'structured'].map(sec => (
              <button
                key={sec}
                onClick={() => { setActiveSection(sec); setCurrentIndex(0); }}
                className={`py-3 text-center border-2 border-black uppercase transition-all ${
                  activeSection === sec ? 'bg-black text-white' : 'bg-white hover:bg-slate-100'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Quick Matrix Progress Grid Tracker */}
          <div className="grid grid-cols-5 gap-3 max-h-[40vh] overflow-y-auto p-1 bg-white border-2 border-black p-4">
            {currentQuestionsList.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-10 border-2 text-[10px] font-black flex items-center justify-center transition-all ${
                  currentIndex === idx ? 'bg-blue-600 text-white border-blue-600 shadow-none' : 'border-black bg-white'
                } ${answers[q.id] ? 'ring-2 ring-inset ring-green-500' : ''}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <p className="text-[9px] font-bold text-slate-400 mt-4 text-center">
            Green rings indicate recorded responses.
          </p>
        </div>

        <button
          onClick={handleExamSubmission}
          className="w-full bg-rose-600 text-white py-4 font-black uppercase text-sm border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all mt-12"
        >
          Finalize Simulation
        </button>
      </div>

    </div>
  );
}