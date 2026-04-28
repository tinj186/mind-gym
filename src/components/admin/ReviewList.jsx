'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DiagramRenderer from '@/components/math/DiagramRenderer';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json());

export default function ReviewList({ initialQuestions, isViewOnly }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync the SWR fetch key with the current URL search parameters
  const swrKey = useMemo(() => {
    const query = searchParams.toString();
    return `/api/admin/questions?${query || 'approved=false'}`;
  }, [searchParams]);

  // Implement SWR for production-ready polling and caching
  const { data, error, mutate, isValidating } = useSWR(
    swrKey,
    fetcher,
    {
      refreshInterval: 3000, // Auto-refresh every 3 seconds
      revalidateOnFocus: true, // Refresh when the admin switches back to the tab
      dedupingInterval: 2000, // Prevent multiple identical requests
      fallbackData: initialQuestions
    }
  );

  const questions = data || [];
  const [processingId, setProcessingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Function to fetch the latest unapproved questions
  const refreshQuestions = async () => {
    mutate(); // Trigger a fresh sync
  };

  // Helper to map technical modelData keys to pedagogical labels
  const MAP_KEY = (key) => {
    const mapping = {
      whole: "Total Amount",
      parts: "Segments",
      part1: "First Part",
      part2: "Second Part",
      tens: "Tens Count",
      ones: "Ones Count",
      hundreds: "Hundreds Count",
      icon: "Primary Icon",
      icons: "Emoji Set",
      groups: "Logical Grouping",
      itemsPerGroup: "Quantity per Group",
      crossOut: "Subtracted Items",
      sequence: "Number Chain",
      rule: "Pattern Logic",
      numbers: "Card Values",
      sets: "Comparison Sets",
      items: "Queue Items",
    };
    return mapping[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleQuestions = questions.slice(startIndex, startIndex + itemsPerPage);

  // Handle page shifts when items are removed
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleApproveAll = async () => {
    const ids = visibleQuestions.map(q => q.id);
    if (ids.length === 0) return;
    
    setProcessingId('bulk');
    try {
      await Promise.all(ids.map(id => 
        fetch(`/api/admin/questions/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isApproved: true }),
        })
      ));
      mutate(); // Revalidate SWR cache immediately
      router.refresh();
    } catch (err) {
      alert("Batch approval failed.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteAll = async () => {
    const ids = visibleQuestions.map(q => q.id);
    if (ids.length === 0 || !window.confirm(`Delete all ${ids.length} questions on this page?`)) return;
    
    setProcessingId('bulk');
    try {
      await Promise.all(ids.map(id => 
        fetch(`/api/admin/questions/${id}`, { method: 'DELETE' })
      ));
      mutate(); // Revalidate SWR cache immediately
      router.refresh();
    } catch (err) {
      alert("Batch deletion failed.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true }),
      });
      if (res.ok) {
        mutate(); // Revalidate SWR cache immediately
        router.refresh();
      }
    } catch (err) {
      alert("Failed to approve question.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        mutate(); // Revalidate SWR cache immediately
        router.refresh();
      }
    } catch (err) {
      alert("Failed to delete question.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRegenerate = async (q) => {
    setProcessingId(q.id);
    try {
      // Triggers the generation API for 1 new question with same metadata
      await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          quantity: 1, 
          syllabus: q.level.match(/1|2/) ? 'P1_P2' : q.level.match(/3|4/) ? 'P3_P4' : 'P5_P6',
          metadata: { 
            level: q.level, 
            topic: q.topic, 
            subtopic: q.subtopic, 
            type: q.type, 
            difficulty: q.difficulty,
            heuristic: q.heuristic 
          }
        }),
      });
      // Delete the current "bad" generation after triggering new one
      await fetch(`/api/admin/questions/${q.id}`, { method: 'DELETE' });
      mutate(); // Revalidate SWR cache immediately
      router.refresh();
      alert("Regeneration triggered. New question will appear in inventory shortly.");
    } catch (err) {
      alert("Regeneration failed.");
    } finally {
      setProcessingId(null);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
        <div className="text-4xl mb-4">✨</div>
        <p className="text-slate-400 font-bold uppercase tracking-widest">Queue Clear</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pagination & Bulk Actions Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Size</span>
          {[5, 10, 15].map(size => (
            <button
              key={size}
              onClick={() => { setItemsPerPage(size); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${itemsPerPage === size ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:text-slate-900'}`}
            >
              {size}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {isValidating && <span className="text-[10px] font-black text-blue-500 animate-pulse uppercase tracking-widest mr-2">Syncing...</span>}
          <button
            onClick={refreshQuestions}
            disabled={processingId !== null}
            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            ↻ Refresh Queue
          </button>
          <button
            disabled={processingId !== null}
            onClick={handleDeleteAll}
            className="px-6 py-2 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-xl hover:bg-red-100 transition-all disabled:opacity-50"
          >
            Delete Page ({visibleQuestions.length})
          </button>
          {!isViewOnly && (
            <button
              disabled={processingId !== null}
              onClick={handleApproveAll}
              className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-green-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              Approve Page ({visibleQuestions.length})
            </button>
          )}
        </div>
      </div>

      {visibleQuestions.map((q) => {
        // Parse model data to determine where to render it
        const modelData = typeof q.modelData === 'string' ? JSON.parse(q.modelData) : q.modelData;
        const visualType = modelData?.type;

        // Define visual categories
        const isQuestionVisual = ['COUNTING_OBJECTS', 'BASE_TEN_BLOCKS', 'EQUAL_GROUPS', 'SHAPE', 'PLACE_VALUE_CHART', 'NUMBER_PATTERN', 'NUMBER_CARDS', 'ORDINAL_LINE', 'COMPARE_OBJECTS', 'NUMBER_BOND'].includes(visualType);
        const isSolutionVisual = ['PART_WHOLE', 'COMPARISON', 'REMAINDER_MODEL', 'NUMBER_PATTERN', 'COUNTING_OBJECTS', 'EQUAL_GROUPS'].includes(visualType);
        const isBusy = processingId === q.id || processingId === 'bulk';

        return (
          <div key={q.id} className={`bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden transition-opacity ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">The Question</span>
                    <p className="text-xl font-bold text-slate-900 leading-tight">{q.question}</p>
                  </div>
                  {visualType && (
                    <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg shrink-0">
                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter">
                        {visualType.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Question-level Visuals (Concrete) */}
                {isQuestionVisual && (
                  <div className="pt-4">
                    <DiagramRenderer modelData={q.modelData} isQuestion={true} questionId={q.id} difficulty={q.difficulty} />
                  </div>
                )}

                {/* Metadata Grid (The redesigned section) */}
                {modelData && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-50">
                    {Object.entries(modelData).filter(([k]) => k !== 'type').map(([key, val]) => (
                      <div key={key} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          {MAP_KEY(key)}
                        </p>
                        <p className="text-xs font-bold text-slate-700 truncate">
                          {Array.isArray(val) ? val.join(', ') : String(val)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            {q.type === 'MCQ' && q.options && Array.isArray(q.options) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {q.options.map((opt, i) => {
                  // Highlight the option that matches the final answer
                  const isCorrect = opt.includes(q.finalAnswer) || opt.startsWith(q.finalAnswer + ':');
                  return (
                    <div 
                      key={i} 
                      className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                        isCorrect 
                          ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' 
                          : 'bg-slate-50 border-slate-100 text-slate-600'
                      }`}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Solution</span>
                  {/* Solution-level Visuals (Abstract Bar Models) */}
                  {isSolutionVisual && <DiagramRenderer modelData={q.modelData} isQuestion={false} questionId={q.id} difficulty={q.difficulty} />}
                <p className="text-sm text-slate-600 leading-relaxed italic whitespace-pre-line">{q.solution}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Final Answer</span>
                {q.type === 'Structured' ? (
                  <div className="space-y-3">
                    {(() => {
                      try {
                        const data = typeof q.finalAnswer === 'string' ? JSON.parse(q.finalAnswer) : q.finalAnswer;
                        const eqParts = data.equation.split(/[\+\-=]/).map(p => p.trim());
                        const op = data.equation.includes('+') ? '+' : '-';
                        return (
                          <>
                            <div className="p-4 bg-green-50 border-2 border-green-100 rounded-2xl flex items-center justify-center gap-2 font-black text-green-800">
                              <div className="w-12 h-10 flex items-center justify-center bg-white border-2 border-green-200 rounded-xl">{eqParts[0]}</div>
                              <div className="w-10 h-10 flex items-center justify-center bg-white border-2 border-green-200 rounded-xl text-lg">{op}</div>
                              <div className="w-12 h-10 flex items-center justify-center bg-white border-2 border-green-200 rounded-xl">{eqParts[1]}</div>
                              <span>=</span>
                              <div className="w-16 h-10 flex items-center justify-center bg-white border-2 border-green-400 rounded-xl shadow-sm">{data.value}</div>
                            </div>
                            <div className="p-4 bg-green-50 border-2 border-green-100 rounded-2xl text-left italic font-bold text-green-900">
                              Answer: {data.statement}
                            </div>
                          </>
                        );
                      } catch (e) {
                        return <div className="p-4 bg-green-50 border-2 border-green-100 rounded-2xl text-center text-3xl font-black text-green-700">{q.finalAnswer}</div>;
                      }
                    })()}
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border-2 border-green-100 rounded-2xl text-center">
                    <div className="text-3xl font-black text-green-700">{q.finalAnswer}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 px-8 py-4 flex justify-between items-center border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {q.id}</span>
            <div className="flex gap-3">
              <button 
                onClick={() => handleDelete(q.id)}
                className="px-4 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                Delete
              </button>
              <button 
                onClick={() => handleRegenerate(q)}
                className="px-4 py-2 text-[10px] font-black uppercase text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
              >
                Regenerate
              </button>
              {!isViewOnly && (
                <button 
                  onClick={() => handleApprove(q.id)}
                  className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-green-600 transition-all shadow-lg active:scale-95"
                >
                  Approve Question
                </button>
              )}
            </div>
          </div>
        </div>
        );
      })}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-12 h-12 rounded-2xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white shadow-xl scale-110' : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}