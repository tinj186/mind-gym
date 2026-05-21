'use client';

import { useState, useEffect } from 'react';
import VisualRenderer from '@/components/gym/VisualRenderer';
import { normalizeQuestionData, deriveVisualProps } from '@/lib/intelligence/workout-utils';

/**
 * GymQuestionPreviewClient: Renders a specific question for admin preview or student workout.
 * It fetches question data based on a provided previewId or falls back to a random question.
 */
export default function GymQuestionPreviewClient({ initialPreviewId: previewId }) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkspaceQuestion() {
      try {
        setLoading(true);
        
        // CHOOSE DELIVERY LINE: Direct Preview vs. Random Engine
        const targetUrl = previewId 
          ? `/api/question?id=${previewId}` 
          : `/api/question`; // Fallback to random roulette for standard student flow

        const res = await fetch(targetUrl);
        if (!res.ok) throw new Error("Failed to load question profile");
        
        const rawData = await res.json();
        
        // Apply the universal normalizer to handle schema inconsistencies and AI formatting
        const normalized = normalizeQuestionData(rawData);
        setQuestion(normalized);
      } catch (err) {
        console.error("Workspace initialization error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaceQuestion();
  }, [previewId]); // Automatically re-fires if parameter changes

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
        Assembling Layout Modules...
      </div>
    </div>
  );

  if (!question) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-xs font-black uppercase text-slate-900">
      No matching question profile found.
    </div>
  );

  const visualProps = deriveVisualProps(question);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="max-w-4xl mx-auto p-8 md:p-12 space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">The Problem</span>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            {question.questionText}
          </h1>
        </div>

        {/* Visual Engine implementation */}
        <div className="py-12 border-y border-slate-100">
          <VisualRenderer
            type={question.visualEngine?.componentToRender}
            data={question.visualEngine?.componentData}
            visualProps={visualProps}
            setIsToolOpen={() => {}} // No-op fallback for simple preview mode
            questionId={question.id}
            difficulty={question.difficulty}
            topic={question.topic}
            attempts={0} // Force full fidelity rendering
            isExam={false}
          />
        </div>
      </main>
    </div>
  );
}