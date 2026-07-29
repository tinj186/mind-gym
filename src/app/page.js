"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { normalizeQuestionData, deriveVisualProps } from '@/lib/intelligence/workout-utils';
import VisualRenderer from '@/components/math/VisualRenderer';
import { motion } from 'framer-motion';
import { playClickSound, playSuccessChime } from '@/lib/audio';
import ContactForm from '@/components/support/ContactForm';

export default function PublicLandingPage() {
  const router = useRouter();
  
  const [level, setLevel] = useState('Primary 2');
  const [topic, setTopic] = useState('Data Representation and Interpretation - Picture Graphs with Scales');
  const [isGenerating, setIsGenerating] = useState(false);
  const [worksheet, setWorksheet] = useState(null);
  const [error, setError] = useState('');
  
  const handleGenerate = async (e) => {
    e.preventDefault();
    playClickSound();
    setIsGenerating(true);
    setError('');
    setWorksheet(null);
    
    try {
      const res = await fetch('/api/public/worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, topic, limit: 3 })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      
      setWorksheet(data.questions);
      playSuccessChime();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/checkout/stripe', { method: 'POST' });
      const data = await res.json();
      
      if (res.status === 401) {
        // User not logged in, redirect to login with callback to the new GET checkout route
        router.push('/login?callbackUrl=/api/checkout/stripe');
        return;
      }
      
      if (!res.ok) throw new Error(data.error);
      
      // Redirect to HitPay
      window.location.href = data.url;
    } catch (err) {
      alert("Checkout failed: " + err.message);
    }
  };

  const topicsByLevel = {
    "Primary 1": [
      { value: "Whole Numbers - Numbers up to 100", label: "Whole Numbers (up to 100)" },
      { value: "Whole Numbers - Addition and Subtraction", label: "Addition & Subtraction" },
      { value: "Whole Numbers - Multiplication and Division", label: "Multiplication & Division" },
      { value: "Money - Money", label: "Money" },
      { value: "Measurement - Length", label: "Length" },
      { value: "Measurement - Time", label: "Time" },
      { value: "Geometry - 2D Shapes", label: "2D Shapes" },
      { value: "Data Representation and Interpretation - Picture Graphs", label: "Picture Graphs" }
    ],
    "Primary 2": [
      { value: "Whole Numbers - Numbers up to 1000", label: "Whole Numbers (up to 1000)" },
      { value: "Whole Numbers - Addition and Subtraction", label: "Addition & Subtraction" },
      { value: "Whole Numbers - Multiplication and Division", label: "Multiplication & Division" },
      { value: "Fractions - Fraction of a Whole", label: "Fractions (Whole)" },
      { value: "Fractions - Addition and Subtraction", label: "Fractions (Addition/Subtraction)" },
      { value: "Money - Money", label: "Money" },
      { value: "Measurement - Length, Mass and Volume", label: "Length, Mass & Volume" },
      { value: "Measurement - Time", label: "Time" },
      { value: "Geometry - 2D Shapes", label: "2D Shapes" },
      { value: "Geometry - 3D Shapes", label: "3D Shapes" },
      { value: "Data Representation and Interpretation - Picture Graphs with Scales", label: "Picture Graphs with Scales" }
    ]
  };

  const handleLevelChange = (e) => {
    const newLevel = e.target.value;
    setLevel(newLevel);
    setTopic(topicsByLevel[newLevel][0].value);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-6 print:hidden">
          Build Flawless <span className="text-blue-600">Math</span> Mastery. <br/>Eliminate "Bad Form".
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-6 max-w-3xl mx-auto print:hidden">
          Adaptive Primary Math Practice for the Singapore MOE Syllabus.
        </h2>
        <p className="text-xl text-slate-600 mb-6 max-w-2xl mx-auto font-medium print:hidden">
          Learning shouldn’t be a guessing game. Our adaptive platform acts as an intelligent coach—isolating specific learning bottlenecks, identifying exact cognitive "defect codes," and generating precise daily workouts to build the right neural pathways.
        </p>
        <p className="text-sm text-slate-500 mb-12 max-w-xl mx-auto print:hidden">
          Experience the Universal Engine. Generate Singapore syllabus-aligned Math worksheets instantly, or unlock automated marking and granular performance tracking with the Annual Pass for S$29.90 (Try it free for 7 days!).
        </p>

        {/* Free Worksheet Generator Tool */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl text-left max-w-3xl mx-auto relative overflow-hidden print:overflow-visible print:border-0 print:shadow-none print:p-0">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-emerald-400 print:hidden"></div>
          
          <h2 className="text-2xl font-black mb-6">Free Worksheet Generator</h2>
          
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end print:hidden">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Level</label>
              <select 
                value={level} 
                onChange={handleLevelChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 font-medium outline-none"
              >
                <option value="Primary 1">Primary 1</option>
                <option value="Primary 2">Primary 2</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Topic</label>
              <select 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 font-medium outline-none"
              >
                {topicsByLevel[level].map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Now
            </button>
          </form>

          {error && <div className="mt-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{error}</div>}

          {/* Skeleton Loader */}
          {isGenerating && (
            <div className="mt-10 pt-10 border-t border-slate-100 animate-pulse">
              <div className="flex justify-between items-center mb-6">
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded-full w-24"></div>
              </div>
              <div className="space-y-8 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-32 bg-slate-200 rounded-xl w-full mt-6"></div>
                </div>
              </div>
            </div>
          )}

          {/* Worksheet Results */}
          {worksheet && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10 pt-10 border-t border-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800">Your Generated Worksheet</h3>
                <div className="flex gap-2">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-widest print:hidden">Printable</span>
                  <button 
                    onClick={() => window.print()}
                    className="text-xs font-bold bg-slate-900 text-white px-4 py-1 rounded-full uppercase tracking-widest hover:bg-blue-600 transition-colors cursor-pointer print:hidden shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <span>🖨️</span> Print PDF
                  </button>
                </div>
              </div>
              
              <div className="space-y-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 print:bg-white print:border-0 print:p-0">
                {['MCQ', 'Short Question', 'Structured'].map((typeLabel, sectionIdx) => {
                  const sectionQs = worksheet.filter(q => q.type === typeLabel);
                  if (sectionQs.length === 0) return null;
                  
                  const sectionTitles = {
                    MCQ: "Section A: Multiple Choice",
                    'Short Question': "Section B: Short Answer",
                    'Structured': "Section C: Structured"
                  };

                  // Calculate the starting question number for this section
                  const startIndex = worksheet.findIndex(q => q.type === typeLabel);

                  return (
                    <div key={typeLabel} className="mb-12">
                      <h4 className="text-xl font-black text-slate-800 mb-6 border-b-2 border-slate-200 pb-2 print:border-slate-800">
                        {sectionTitles[typeLabel]}
                      </h4>
                      <div className="space-y-8">
                        {sectionQs.map((rawQ, localIdx) => {
                          const q = normalizeQuestionData(rawQ);
                          const vProps = deriveVisualProps(q);
                          const currentVisual = q?.visualEngine?.componentToRender;
                          const hasVisualContent = currentVisual && currentVisual !== "NONE";
                          const globalIdx = startIndex + localIdx;

                          return (
                            <div key={globalIdx} className="pb-8 border-b border-slate-200 last:border-0 last:pb-0 print:pb-8 print:border-b print:break-inside-avoid">
                              <div className="flex gap-4">
                                <span className="text-slate-400 font-black text-xl">{globalIdx + 1}.</span>
                                <div className="w-full">
                                  <div className="text-lg text-slate-800 font-medium leading-relaxed">
                                    {q.question}
                                  </div>
                                  
                                  {hasVisualContent && (
                                    <div className="mt-6 p-6 bg-white border-2 border-slate-100 rounded-2xl shadow-sm print:shadow-none print:border print:border-slate-300">
                                      <VisualRenderer 
                                        type={currentVisual} 
                                        data={q?.visualEngine?.componentData || {}}
                                        modelData={q.modelData}
                                        visualProps={vProps}
                                        questionId={q.id}
                                        topic={q.topic}
                                        attempts={0}
                                      />
                                    </div>
                                  )}

                                  {/* MCQ Options Display (Visible on screen and PDF) */}
                                  {rawQ.type === 'MCQ' && q.options && (
                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                      {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="text-sm font-medium border border-slate-200 p-4 rounded-xl bg-white print:border-none print:p-0 print:bg-transparent">
                                          <span className="print:hidden font-bold mr-2 text-slate-400">{['A','B','C','D'][oIdx]}:</span>
                                          <span className="hidden print:inline mr-2 font-bold text-slate-400">(   )</span>
                                          <span className="text-slate-900 font-bold">{opt}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Space for working in PDF */}
                                  <div className="hidden print:block mt-8 border-t border-dashed border-slate-300 pt-8">
                                    {rawQ.type !== 'MCQ' && (
                                      <div className="h-24"></div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Answer Key (Only visible when printing) */}
                <div className="hidden print:block mt-16 pt-8 border-t-4 border-slate-900 break-before-page">
                  <h4 className="text-2xl font-black text-slate-900 mb-6">Answer Key</h4>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    {worksheet.map((rawQ, idx) => {
                      const q = normalizeQuestionData(rawQ);
                      return (
                        <div key={idx} className="flex items-start gap-3 text-base break-inside-avoid">
                          <span className="font-black text-slate-500 min-w-[2rem]">{idx + 1}.</span>
                          <span className="font-medium text-slate-900">{q.finalAnswer}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* The Bridge CTA */}
              <div className="mt-12 text-center p-8 bg-slate-900 rounded-[2rem] shadow-2xl relative overflow-hidden print:hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white mb-2">Tired of marking papers manually?</h3>
                  <p className="text-slate-400 font-medium mb-8 max-w-lg mx-auto">
                    Get unlimited auto-generated questions, instant marking, and the 20/60/20 algorithm that tracks exactly what your child needs to practice.
                  </p>
                  <button 
                    onClick={handleCheckout}
                    className="bg-white text-slate-900 font-black px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                  >
                    Start 7-Day Free Trial <span className="text-xs font-normal opacity-80">(Then S$29.90/year)</span>
                  </button>
                  <p className="text-xs text-slate-500 font-bold mt-4 tracking-wide uppercase">Cancel Anytime</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <ContactForm />
    </div>
  );
}
