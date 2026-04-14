'use client';

import { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import BarModel from '@/components/BarModel';
import MathInput from '@/components/MathInput';
import { gradeAction } from './actions';
import Link from 'next/link';

export default function TrainingPage() {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // useActionState handles the "Nothing happened" issue by capturing 
  // the server response even if hydration is slow.
  const [state, formAction] = useActionState(gradeAction, {
    error: null,
    lastAnswer: ''
  });

  useEffect(() => {
    console.log('🚀 Training Client Hydrated');
  }, []);

  // Mock data for current validation - this will be replaced by dynamic data later
  const currentQuestionId = "seed-q1"; 

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!answer || answer.trim() === '') {
      console.log('⚠️ Submit blocked: Answer is empty');
      return;
    }
    
    console.log('--- Submission Started ---');
    console.log('Target ID:', currentQuestionId);
    console.log('Student Answer:', answer);
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          questionId: currentQuestionId, 
          studentAnswer: answer 
        }),
      });

      console.log('Response Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      console.log('Result received:', result);

      if (result.isCorrect) {
        console.log('✅ Correct! Navigating to summary...');
              // Force a hard redirect as fallback for router lag on NAS
        router.push('/train/summary');
        setTimeout(() => { window.location.assign('/train/summary'); }, 500);
      } else {
        console.log('❌ Incorrect answer.');
        alert(result.hint || "Incorrect. Check the model and try again!");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Submission failed", error);
      setIsSubmitting(false);
    }
  };

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

          <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden field to pass the question ID to the Server Action */}
            <input type="hidden" name="questionId" value={currentQuestionId} />
            
            {/* Display Error Message from Server Action or Client Alert */}
            {state?.error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold animate-in fade-in slide-in-from-top-2">
                ⚠️ {state.error}
              </div>
            )}

            <div className="flex flex-col items-center">
              {/* IMPORTANT: Ensure the input inside MathInput has name="answer" */}
              <MathInput name="answer" value={answer || state?.lastAnswer} onChange={(e) => setAnswer(e.target.value)} />
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