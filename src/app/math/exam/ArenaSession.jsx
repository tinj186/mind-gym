"use client";

import { useState, useEffect, useMemo } from 'react';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VisualRenderer from '@/components/math/VisualRenderer';
import { normalizeQuestionData, deriveVisualProps } from '@/lib/intelligence/workout-utils';

export default function ArenaSession({ studentId, level, examPaper, durationMinutes }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [activeSection, setActiveSection] = useState('mcq'); // mcq | short | structured
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Stores questionId -> studentInput response map
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [scoreSummary, setScoreSummary] = useState(null);

  // Flatten questions to handle simple global master index loops
  const currentQuestionsList = examPaper[activeSection] || [];
  const activeQuestion = currentQuestionsList[currentIndex];

  const normalizedQuestion = useMemo(() => {
    return normalizeQuestionData(activeQuestion);
  }, [activeQuestion]);

  const visualProps = useMemo(() => {
    return deriveVisualProps(normalizedQuestion);
  }, [normalizedQuestion]);

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
      if (activeSection === 'mcq' && examPaper.short.length > 0) {
        setActiveSection('short');
        setCurrentIndex(0);
      } else if (activeSection === 'short' && examPaper.structured.length > 0) {
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
        const studentAns = String(answers[q.id] || '').trim().toLowerCase();
        const realAns = String(q.finalAnswer || '').trim().toLowerCase();
        return studentAns === realAns;
      }).length;
      return { correct: correctCount, total: questions.length };
    };

    const mcq = calculateScore(examPaper.mcq);
    const short = calculateScore(examPaper.short);
    const structured = calculateScore(examPaper.structured);
    
    const totalCorrect = mcq.correct + short.correct + structured.correct;
    const totalQuestions = mcq.total + short.total + structured.total;

    setScoreSummary({
      total: { correct: totalCorrect, total: totalQuestions, percent: Math.round((totalCorrect / totalQuestions) * 100) },
      sections: { mcq, short, structured }
    });

    setIsSubmitted(true);
    setShowReport(true);
  };

  if (showReport && scoreSummary) {
    return (
      <div className="max-w-4xl mx-auto p-12 bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] font-bold uppercase text-black space-y-12">
        <div className="text-[10px] tracking-widest font-black text-slate-400">NEURAL_REPORT // {studentId.toUpperCase()}</div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tighter italic">Simulation Finalized</h1>
          <div className="text-3xl font-black text-blue-600">Total Score: {scoreSummary.total.percent}% ({scoreSummary.total.correct}/{scoreSummary.total.total})</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(scoreSummary.sections).map(([name, stats]) => (
            <div key={name} className="border-4 border-black p-6 bg-slate-50">
              <div className="text-[10px] text-slate-400 mb-2">{name}</div>
              <div className="text-2xl font-black">{Math.round((stats.correct / stats.total) * 100) || 0}%</div>
              <div className="text-xs text-slate-500 mt-1">{stats.correct} / {stats.total} Correct</div>
              <div className="w-full h-2 bg-slate-200 mt-4 border-2 border-black overflow-hidden">
                <div 
                  className="h-full bg-black" 
                  style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t-4 border-black">
          <p className="text-sm text-slate-500 mb-8">Performance data has been synchronized with the master synapse map. Repaired pathways will be reflected on the dashboard.</p>
          
          <button 
            onClick={() => router.replace('/math')}
            className="inline-block bg-black text-white px-12 py-4 text-xl font-black tracking-widest hover:bg-slate-800 transition-all border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Exit Arena →
          </button>
        </div>
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

          {activeQuestion ? (
            <div className="space-y-8">
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
                  <label className="block text-[10px] font-black mb-2 uppercase text-slate-400 tracking-tighter">Student Workspace Input Response</label>
                  <input
                    type="text"
                    value={answers[activeQuestion.id] || ''}
                    onChange={(e) => handleSelectAnswer(activeQuestion.id, e.target.value)}
                    placeholder="Type numerical answer..."
                    className="w-full border-4 border-black p-6 text-3xl outline-none bg-slate-50 font-black focus:bg-white transition-colors"
                  />
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