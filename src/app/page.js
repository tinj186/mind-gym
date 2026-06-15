"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PublicLandingPage() {
  const router = useRouter();
  
  const [level, setLevel] = useState('Primary 1');
  const [topic, setTopic] = useState('Whole Numbers');
  const [isGenerating, setIsGenerating] = useState(false);
  const [worksheet, setWorksheet] = useState(null);
  const [error, setError] = useState('');
  
  const handleGenerate = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/checkout/hitpay', { method: 'POST' });
      const data = await res.json();
      
      if (res.status === 401) {
        // User not logged in, redirect to login
        router.push('/login?callbackUrl=/');
        return;
      }
      
      if (!res.ok) throw new Error(data.error);
      
      // Redirect to HitPay
      window.location.href = data.url;
    } catch (err) {
      alert("Checkout failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 print:hidden">
        <div className="font-black text-2xl tracking-tighter text-blue-600">LEARN<span className="text-slate-800">REPS</span></div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
          <button 
            onClick={handleCheckout}
            className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
          >
            Get Annual Pass
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-6 print:hidden">
          The Ultimate <br/><span className="text-blue-600">Neuro-Trainer</span> for Math.
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium print:hidden">
          Start the journey with our complete Primary 1 Math engine. (Primary 2–6 rolling out soon). Generate syllabus-ready worksheets instantly. Want auto-marking, AI performance tracking, and the adaptive 20/60/20 algorithm? Unlock the P1 Annual Pass to The Learn Reps for S$29.90.
        </p>

        {/* Free Worksheet Generator Tool */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl text-left max-w-3xl mx-auto relative overflow-hidden print:border-0 print:shadow-none print:p-0">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-emerald-400 print:hidden"></div>
          
          <h2 className="text-2xl font-black mb-6">Free Worksheet Generator</h2>
          
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end print:hidden">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Level</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 font-medium outline-none"
              >
                <option value="Primary 1">Primary 1</option>
                <option value="Primary 2" disabled>Primary 2 (Coming Q3)</option>
                <option value="Primary 3" disabled>Primary 3 (Coming Q4)</option>
                <option value="Primary 4" disabled>Primary 4 (Coming 2027)</option>
                <option value="Primary 5 (Standard)" disabled>Primary 5 Std (Coming 2027)</option>
                <option value="Primary 6 (Standard)" disabled>Primary 6 Std (Coming 2027)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Topic</label>
              <select 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 font-medium outline-none"
              >
                <option value="Whole Numbers">Whole Numbers</option>
                <option value="Measurement">Measurement</option>
                <option value="Geometry">Geometry</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? "Generating..." : "Generate Now"}
            </button>
          </form>

          {error && <div className="mt-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{error}</div>}

          {/* Worksheet Results */}
          {worksheet && (
            <div className="mt-10 pt-10 border-t border-slate-100 animate-fade-in">
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
                {worksheet.map((q, idx) => (
                  <div key={idx} className="pb-8 border-b border-slate-200 last:border-0 last:pb-0">
                    <div className="flex gap-4">
                      <span className="text-slate-400 font-black text-xl">{idx + 1}.</span>
                      <div className="text-lg text-slate-800 font-medium leading-relaxed">
                        {q.question}
                      </div>
                    </div>
                  </div>
                ))}
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
                    Unlock P1 Annual Pass for S$29.90
                  </button>
                  <p className="text-xs text-slate-500 font-bold mt-4 tracking-wide uppercase">30-Day Money-Back Guarantee</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
