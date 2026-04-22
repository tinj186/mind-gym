'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewList({ initialQuestions, isViewOnly }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [processingId, setProcessingId] = useState(null);
  const router = useRouter();

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true }),
      });
      if (res.ok) {
        setQuestions(prev => prev.filter(q => q.id !== id));
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
        setQuestions(prev => prev.filter(q => q.id !== id));
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
      setQuestions(prev => prev.filter(item => item.id !== q.id));
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
      {questions.map((q) => (
        <div key={q.id} className={`bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden transition-opacity ${processingId === q.id ? 'opacity-50' : ''}`}>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">The Question</span>
              <p className="text-xl font-bold text-slate-900 leading-tight">{q.question}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Solution</span>
                <p className="text-sm text-slate-600 leading-relaxed italic">{q.solution}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Final Answer</span>
                <div className="text-2xl font-black text-slate-900">{q.finalAnswer}</div>
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
      ))}
    </div>
  );
}