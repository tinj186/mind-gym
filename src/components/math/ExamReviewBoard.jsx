import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExamReviewBoard({ summary, initialQuestions, answersLog, mode }) {
  // 1. Calculate Score
  const totalQuestions = answersLog.length;
  const correctCount = answersLog.filter(log => log.actualCorrect).length;

  // 2. Group Questions by Type
  const groupedQuestions = initialQuestions.reduce((acc, question) => {
    const type = question.type || 'UNCATEGORIZED';
    if (!acc[type]) acc[type] = [];
    
    // Find the student's answer for this question
    const logEntry = answersLog.find(log => log.questionId === question.id);
    
    acc[type].push({
      ...question,
      logEntry
    });
    
    return acc;
  }, {});

  // Convert Type Enum to Readable Label
  const formatTypeLabel = (type) => {
    switch(type) {
      case 'MULTIPLE_CHOICE': return 'Multiple Choice';
      case 'SHORT_ANSWER': return 'Short Answer';
      case 'STRUCTURED': return 'Structured / Word Problem';
      default: return 'General Questions';
    }
  };

  // State for Accordion
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (type) => {
    if (expandedSection === type) setExpandedSection(null);
    else setExpandedSection(type);
  };

  return (
    <div className="max-w-4xl mx-auto p-12 text-center space-y-8">
      {/* HEADER: Score & Growth */}
      <div className="space-y-4 mb-12">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Exam Results</h2>
        <p className="text-slate-500 font-bold">Review your answers and performance</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        <div className="bg-white border-2 border-slate-200 p-8 rounded-[2.5rem] min-w-[240px] shadow-sm">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Final Score</p>
          <p className="text-5xl font-black text-slate-900">{correctCount} <span className="text-2xl text-slate-400">/ {totalQuestions}</span></p>
        </div>
        
        {summary && summary.averageGrowth && (
          <div className="bg-blue-50 border-2 border-blue-100 p-8 rounded-[2.5rem] min-w-[240px] shadow-sm">
            <p className="text-sm font-black text-blue-500 uppercase tracking-widest mb-2">Growth</p>
            <p className="text-5xl font-black text-blue-900">+{summary.averageGrowth}%</p>
          </div>
        )}
      </div>

      {summary && summary.rankUps && summary.rankUps.length > 0 && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-50 border-2 border-green-200 text-green-700 p-6 rounded-3xl font-black text-xl mb-12"
        >
          🏆 RANK UP! You've unlocked new mastery tiers.
        </motion.div>
      )}

      {/* ACCORDION SECTIONS (Only for Mock Exams) */}
      {mode === 'mock_exam' && (
        <div className="space-y-4 text-left">
          {Object.entries(groupedQuestions).map(([type, questions]) => {
            const isExpanded = expandedSection === type;
            const sectionCorrect = questions.filter(q => q.logEntry?.actualCorrect).length;
            
            return (
              <div key={type} className="border-2 border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm transition-all">
                {/* Section Header (Clickable) */}
                <button 
                  onClick={() => toggleSection(type)}
                  className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl font-black text-slate-600">
                      {isExpanded ? '−' : '+'}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">{formatTypeLabel(type)}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Section Score</span>
                    <p className="text-xl font-black text-slate-900">{sectionCorrect} / {questions.length}</p>
                  </div>
                </button>
                
                {/* Expandable Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t-2 border-slate-100 bg-slate-50"
                    >
                      <div className="p-8 space-y-6">
                        {questions.map((q, idx) => {
                          const isCorrect = q.logEntry?.actualCorrect;
                          const studentAns = q.logEntry?.studentAnswer || "No Answer";
                          
                          return (
                            <div key={q.id || idx} className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 shadow-sm">
                              {/* Status Icon */}
                              <div className="flex-shrink-0 pt-1">
                                {isCorrect ? (
                                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-black text-sm">✓</div>
                                ) : (
                                  <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-black text-sm">✕</div>
                                )}
                              </div>
                              
                              {/* Question Details */}
                              <div className="flex-grow space-y-4">
                                <div>
                                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Question {idx + 1}</span>
                                  <p className="text-lg font-bold text-slate-800">{q.question}</p>
                                </div>
                                
                                {/* Answer Comparison */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className={`p-4 rounded-xl border-2 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-rose-50 border-rose-200'}`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${isCorrect ? 'text-green-600/70' : 'text-rose-600/70'}`}>Your Answer</span>
                                    <p className={`text-lg font-black ${isCorrect ? 'text-green-700' : 'text-rose-700'}`}>{studentAns}</p>
                                  </div>
                                  
                                  {!isCorrect && (
                                    <div className="p-4 rounded-xl border-2 bg-slate-100 border-slate-200">
                                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Correct Answer</span>
                                      <p className="text-lg font-black text-slate-900">{q.finalAnswer}</p>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Solution / Working */}
                                {!isCorrect && q.solution && (
                                  <div className="pt-4 mt-4 border-t-2 border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Step-by-Step Solution</span>
                                    <p className="text-sm font-bold text-slate-600 italic leading-relaxed whitespace-pre-wrap">{q.solution}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-8">
        <button 
          onClick={() => window.location.replace('/math')} 
          className="px-12 py-5 bg-slate-900 text-white rounded-full font-black text-xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl hover:shadow-2xl"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
