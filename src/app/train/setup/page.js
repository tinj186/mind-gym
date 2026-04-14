'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TrainingSetup() {
  const [mode, setMode] = useState('targeted');
  const [difficulty, setDifficulty] = useState('medium');
  const [repCount, setRepCount] = useState(10);

  const modes = [
    { id: 'targeted', name: 'Targeted Isolation', desc: 'Focus on your primary bottleneck topic.' },
    { id: 'mixed', name: 'Mixed Routine', desc: 'Balanced reps across multiple topics.' },
    { id: 'sprint', name: 'Full Year Sprint', desc: 'Diagnostic across the entire syllabus.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">WORKOUT PROGRAMMING</h1>
          <p className="text-slate-500 font-medium mt-2 uppercase text-xs tracking-[0.2em]">Configure your neural session</p>
        </header>

        <div className="space-y-8">
          {/* Section: Mode Selection */}
          <section>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">1. Select Mode</h3>
            <div className="grid grid-cols-1 gap-4">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-6 rounded-3xl border-2 text-left transition-all ${
                    mode === m.id 
                    ? 'border-blue-600 bg-blue-50/50 shadow-md' 
                    : 'border-white bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900">{m.name}</h4>
                      <p className="text-sm text-slate-500">{m.desc}</p>
                    </div>
                    {mode === m.id && <span className="text-blue-600 font-bold text-xl">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Section: Difficulty & Load */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">2. Intensity</h3>
              <div className="flex bg-white p-2 rounded-2xl border border-slate-200">
                {['easy', 'medium', 'hard'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      difficulty === d ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">3. Set Volume</h3>
              <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
                <button onClick={() => setRepCount(Math.max(5, repCount - 5))} className="w-10 h-10 rounded-xl bg-slate-50 font-bold">-</button>
                <span className="font-black text-lg">{repCount} Reps</span>
                <button onClick={() => setRepCount(Math.min(30, repCount + 5))} className="w-10 h-10 rounded-xl bg-slate-50 font-bold">+</button>
              </div>
            </section>
          </div>

          {/* Final Action */}
          <Link href="/train">
            <button className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]">
              BEGIN TRAINING SESSION
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}