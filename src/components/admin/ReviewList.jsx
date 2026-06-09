'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GroupingWorkspace from '@/components/tools/GroupingWorkspace';
import useSWR from 'swr';
import ReviewCard from './ReviewCard';

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
      refreshInterval: autoRefresh ? 3000 : 0,
      revalidateOnFocus: true,
      dedupingInterval: 2000,
      fallbackData: initialQuestions
    }
  );

  const questions = data || [];
  const [processingId, setProcessingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTool, setActiveTool] = useState(null);

  const refreshQuestions = async () => {
    mutate();
  };

  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleQuestions = questions.slice(startIndex, startIndex + itemsPerPage);

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

      mutate();
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

      mutate();
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
        mutate();
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
        mutate();
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
      const res = await fetch(`/api/admin/questions/${q.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.warn("Could not delete legacy question during regeneration:", data.error);
      }
      mutate();
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

      {visibleQuestions.map((q) => (
        <ReviewCard 
          key={q.id}
          q={q}
          processingId={processingId}
          isViewOnly={isViewOnly}
          handleApprove={handleApprove}
          handleDelete={handleDelete}
          handleRegenerate={handleRegenerate}
          mutate={mutate}
          setActiveTool={setActiveTool}
        />
      ))}

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