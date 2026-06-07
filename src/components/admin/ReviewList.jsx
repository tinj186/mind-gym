'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VisualRenderer from '@/components/gym/VisualRenderer'; // Updated to use the modern VisualRenderer
import GroupingWorkspace from '@/components/tools/GroupingWorkspace'; // Import the interactive tool
import useSWR from 'swr';
import { toggleArchiveQuestionAction } from '@/app/actions/workoutActions';
import { normalizeQuestionData, deriveVisualProps } from '@/lib/intelligence/workout-utils'; // Import for data normalization

const fetcher = url => fetch(url).then(res => res.json());

export default function ReviewList({ initialQuestions, isViewOnly, autoRefresh = false }) {
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
      refreshInterval: autoRefresh ? 3000 : 0, // Only sync if explicitly enabled (e.g. on main filter page)
      revalidateOnFocus: true, // Refresh when the admin switches back to the tab
      dedupingInterval: 2000, // Prevent multiple identical requests
      fallbackData: initialQuestions
    }
  );

  const questions = data || [];
  const [processingId, setProcessingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTool, setActiveTool] = useState(null); // Track which question's tool is open

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
      const responses = await Promise.all(ids.map(id => 
        fetch(`/api/admin/questions/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isApproved: true }),
        }).then(async r => ({
          ok: r.ok,
          data: !r.ok ? await r.json().catch(() => ({})) : null
        }))
      ));

      const failed = responses.filter(r => !r.ok);
      if (failed.length > 0) {
        const message = failed[0].data?.error || "Some questions could not be approved.";
        alert(`⚠️ Notice: ${failed.length} approval(s) failed. ${message}`);
      }

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
      const responses = await Promise.all(ids.map(id => 
        fetch(`/api/admin/questions/${id}`, { method: 'DELETE' }).then(async r => ({
          ok: r.ok,
          data: !r.ok ? await r.json().catch(() => ({})) : null
        }))
      ));

      const failed = responses.filter(r => !r.ok);
      if (failed.length > 0) {
        const message = failed[0].data?.error || "Some questions are locked and could not be deleted.";
        alert(`⚠️ Notice: ${failed.length} deletion(s) failed. ${message}`);
      }

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
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`⚠️ Cannot approve: ${data.error || "A server error occurred."}`);
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
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`⚠️ Cannot delete: ${data.error || "Question is locked or a server error occurred."}`);
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
      const res = await fetch(`/api/admin/questions/${q.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.warn("Could not delete legacy question during regeneration:", data.error);
      }
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
        // Normalize question data once to get consistent visualEngine and modelData
        const normalizedQuestion = normalizeQuestionData(q);
        const visualProps = deriveVisualProps(normalizedQuestion);
        const visualType = normalizedQuestion.visualEngine?.componentToRender; // Raw type from normalized question

        // Define visual categories
        const isQuestionVisual = !!visualType && visualType !== 'NONE';
        const isBusy = processingId === q.id || processingId === 'bulk';

        const isArchived = q.isArchived === true;

        return (
          <div key={q.id} className={`p-6 rounded-3xl border-2 transition-all duration-300 relative ${
            isArchived
              ? 'bg-slate-100/70 border-slate-200/80 text-slate-400 opacity-60 shadow-none filter grayscale'
              : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
          } ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}>
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
                    <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl flex justify-center items-center">
                      <VisualRenderer
                        type={normalizedQuestion.visualEngine?.componentToRender}
                        data={normalizedQuestion.visualEngine?.componentData}
                        modelData={normalizedQuestion.modelData} // Pass the full modelData
                        visualProps={visualProps} // Pass calculated visual props for proper preview
                        attempts={0}
                        setIsToolOpen={() => setActiveTool({
                          modelData: normalizedQuestion.modelData,
                          id: normalizedQuestion.id,
                          difficulty: normalizedQuestion.difficulty,
                          topic: normalizedQuestion.topic,
                          visualProps
                        })}
                        questionId={normalizedQuestion.id}
                        difficulty={normalizedQuestion.difficulty}
                        topic={normalizedQuestion.topic}
                        hideCardStyles={true}
                      />
                    </div>
                  </div>
                )}

                {/* Metadata Grid (The redesigned section) */}
                {normalizedQuestion.modelData && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-50">
                    {/* Filter out legacy visual keys, internal flags, and numeric indices from the metadata grid */}
                    {Object.entries(normalizedQuestion.modelData).filter(([k]) => {
                      const isNumericIndex = !isNaN(k) && !isNaN(parseFloat(k));
                      return !isNumericIndex && !['type', 'items', 'groups', 'visualitems', 'hidevisual', 'modelvisualizer', 'modeldrawing'].includes(k.toLowerCase());
                    }).map(([key, val]) => (
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
                  const optStr = String(opt ?? "");
                  // Helper to strip labels (e.g., "A: 2" -> "2") and trim whitespace, but preserve time formats (e.g., "5:30")
                  const extractValue = (s) => {
                    const str = String(s ?? "").trim();
                    if (/^\d{1,2}:\d{2}/.test(str)) return str;
                    return str.includes(':') ? str.split(':').slice(1).join(':').trim() : str;
                  };

                  const cleanOpt = extractValue(optStr);
                  const cleanFinal = extractValue(q.finalAnswer);
                  const isCorrect = cleanOpt !== '' && cleanOpt === cleanFinal;

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
                <p className="text-sm text-slate-600 leading-relaxed italic whitespace-pre-line">{q.solution}</p>
                
                {/* NEW: Render the Pedagogical Hint if it exists */}
                {q.hint && (
                  <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-100 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <span>💡</span> Pedagogical Scaffolding (Hint)
                    </p>
                    <p className="text-xs text-amber-900 font-bold italic leading-relaxed">{q.hint}</p>
                  </div>
                )}
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
                onClick={async () => {
                  const actionLabel = isArchived ? 'unarchive' : 'archive';
                  if (confirm(`Are you sure you want to ${actionLabel} this question?`)) {
                    const res = await toggleArchiveQuestionAction(q.id, q.isArchived);
                    if (res.success) {
                      mutate(); 
                    } else {
                      alert("Failed to update question status: " + res.error);
                    }
                  }
                }}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all border-2 ${
                  isArchived
                    ? 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                }`}
              >
                {isArchived ? '📁 Unarchive' : '📦 Archive'}
              </button>
              <button 
                onClick={() => handleDelete(q.id)}
                className="px-4 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                Delete
              </button>
              <a 
                href={`/gym?previewId=${q.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all inline-flex items-center gap-1"
              >
                👁️ Test Visual Canvas
              </a>
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

      {/* Interactive Tool Modal Overlay for Admin Inspection */}
      {activeTool && (
        <GroupingWorkspace
          modelData={activeTool.modelData}
          onClose={() => setActiveTool(null)}
          questionId={activeTool.id}
          difficulty={activeTool.difficulty}
          mode={activeTool.visualProps.mode}
          totalItems={activeTool.visualProps.totalItems}
          icon={activeTool.visualProps.icon}
          expectedGroups={activeTool.visualProps.expectedGroups}
          targetGroupSize={activeTool.visualProps.targetSize}
          showTargetSize={activeTool.topic !== 'Division'}
        />
      )}
    </div>
  );
}