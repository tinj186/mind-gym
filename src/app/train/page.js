'use client';

import { useState, useEffect, useActionState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BarModel from '@/components/BarModel';
import MathInput from '@/components/MathInput';
import { gradeAction } from './actions';
import Link from 'next/link';

export default function TrainingPage() {
  // useActionState handles the "Nothing happened" issue by capturing 
  // the server response even if hydration is slow.
  const [state, formAction] = useActionState(gradeAction, {
    error: null,
    lastAnswer: ''
  });

  const [answer, setAnswer] = useState(state?.lastAnswer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('🔄 [TrainingPage] Current Answer State:', answer);
  }, [answer]);

  useEffect(() => {
    console.log('🚀 Training Client Hydrated');
    setIsMounted(true);
  }, []);

  // Sync previous answer into the active state when the server responds
  useEffect(() => {
    // Only sync if we have a new answer from the server and we aren't currently typing
    const activeEl = document.activeElement;
    const isFocused = activeEl?.tagName === 'MATH-FIELD' || activeEl?.closest('math-field');

    if (isMounted && 
        state?.lastAnswer && 
        answer !== state.lastAnswer && 
        !isSubmitting && 
        !isFocused) {
      console.log('📥 [TrainingPage] Syncing last answer from server:', state.lastAnswer);
      setAnswer(state.lastAnswer);
    }
  }, [state?.lastAnswer, isSubmitting, isMounted]);

  // Mock data for current validation - this will be replaced by dynamic data later
  const currentQuestionId = "seed-q1"; 
  
  const handleSubmit = useCallback(async (e) => {
    // 1. Prevent browser default behavior
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    
    // 2. Prevent double-submission
    if (isSubmitting) return;

    // 3. Validate input
    if (!answer || answer.trim() === '') {
      console.log('⚠️ [TrainingPage] Submit blocked: Answer state is currently:', JSON.stringify(answer));
      alert(`Please enter an answer before submitting! (Current state: "${answer}")`);
      return;
    }
    
    console.log('🚀 [TrainingPage] Starting Submission:', { id: currentQuestionId, answer });
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          questionId: currentQuestionId, 
          studentAnswer: answer 
        }),
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      const result = await response.json();
      console.log('📊 [TrainingPage] Grading Result:', result);

      if (result.isCorrect) {
        console.log('✅ Correct! Navigating to summary...');
        router.push('/train/summary');
      } else {
        console.log('❌ Incorrect answer.');
        alert(result.hint || "Incorrect answer. Check your calculation and try again!");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("❌ [TrainingPage] Submission failed:", error);
      alert("Connection error. Please check your network and try again.");
      setIsSubmitting(false);
    }
  }, [answer, currentQuestionId, router, isSubmitting]);

  // Stable reference for the change handler
  const handleInputChange = useCallback((val) => {
    // val is already the string from MathInput
    setAnswer(val);
  }, []);

  const handleEnter = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="px-8 py-6 flex justify-between items-center border-b border-slate-100">
        <Link href="/gym" className="text-slate-400 hover:text-slate-900">✕</Link>
        <div className="flex-1 max-w-md mx-12 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 w-[10%]" />
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-full" />
      </nav>

      <main className="flex-1 flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-3xl space-y-12">
          <section className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Express 13/4 as a mixed number in its simplest form.
            </h2>
          </section>

          <section className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100">
             <BarModel data={[{ label: "ALI", value: 150, color: "fill-blue-600" }, { label: "BABA", value: 90, color: "fill-slate-300" }]} />
          </section>

          {/* 
            Removed action={formAction} to prevent conflict between 
            Server Action redirect and client-side router.push
          */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden field to pass the question ID to the Server Action */}
            <input type="hidden" name="questionId" value={currentQuestionId} />
            
            {/* Display Error Message from Server Action or Client Alert */}
            {state?.error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold animate-in fade-in slide-in-from-top-2">
                ⚠️ {state.error}
              </div>
            )}

            <div className="flex flex-col items-center">
              <MathInput 
                name="answer" 
                value={answer} 
                onChange={handleInputChange} 
                onEnter={handleEnter}
              />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-6 rounded-3xl font-black text-xl shadow-2xl transition-all ${
                isSubmitting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 hover:bg-blue-600 text-white active:scale-95'
              }`}
            >
              {isSubmitting ? 'VALIDATING...' : 'SUBMIT REP'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}