'use client';

import { useState, useEffect } from 'react';
import VisualRenderer from '@/components/math/VisualRenderer';
import { normalizeQuestionData, deriveVisualProps } from '@/lib/intelligence/workout-utils';
import WorkoutSession from '@/components/math/WorkoutSession';

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
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="max-w-4xl mx-auto py-12">
        <WorkoutSession 
          studentId="admin-test"
          level={question.level}
          initialQuestions={[question]}
          title="Sandbox Preview Inspector"
          mode="sandbox"
          isSandbox={true}
        />
      </main>
    </div>
  );
}