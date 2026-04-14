'use client';

import Link from 'next/link';

export default function MathGymSummary() {
  const topics = [
    { name: 'Whole Numbers', strength: 92, status: 'Mastered', reps: 140 },
    { name: 'Fractions', strength: 65, status: 'Conditioning', reps: 85 },
    { name: 'Decimals', strength: 42, status: 'At Risk', reps: 30 },
    { name: 'Area & Perimeter', strength: 78, status: 'Stable', reps: 92 },
    { name: 'Geometry', strength: 15, status: 'New', reps: 5 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb & Header */}
        <div className="mb-10">
          <Link href="/" className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">
            ← Back to Command Center
          </Link>
          <h1 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">MATHEMATICS WING</h1>
          <p className="text-slate-500 font-medium">Syllabus: Primary 4 (Standard)</p>
        </div>

        {/* Topic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <div key={topic.name} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{topic.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-1">
                    {topic.reps} Reps Completed
                  </p>
                </div>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  topic.status === 'Mastered' ? 'bg-green-50 text-green-600 border-green-100' :
                  topic.status === 'At Risk' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {topic.status}
                </span>
              </div>

              {/* Mini Strength Bar */}
              <div className="space-y-2 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Synapse Strength</span>
                  <span className="font-black text-slate-900">{topic.strength}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                        topic.strength > 80 ? 'bg-green-500' : topic.strength < 50 ? 'bg-red-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${topic.strength}%` }}
                  />
                </div>
              </div>

              <Link href="/train/setup">
                <button className="w-full py-4 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                  Isolate Topic →
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}