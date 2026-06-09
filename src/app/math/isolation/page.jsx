import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function IsolationLabPage() {
  const studentId = "default-student"; // In production, this would come from authentication/session

  // 1. Fetch mastery rows sorted by weakest strength first (The Defect Radar)
  const weakTracks = await prisma.studentMastery.findMany({
    where: { 
      studentId,
      synapseStrength: { lt: 75 } // Focus on areas under 75% mastery
    },
    orderBy: {
      synapseStrength: 'asc'
    },
    take: 4 // Top 4 priority bottlenecks
  });

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      {/* Header Room */}
      <header className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          SYSTEM_MODE // ISOLATION_LAB
        </p>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">
          Targeted Defect Elimination
        </h1>
        <p className="text-sm font-bold text-slate-500 mt-2">
          Select a hyper-focused machine to isolate weak synaptic links. No compound mixing allowed here.
        </p>
      </header>

      {/* Isolation Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weakTracks.length === 0 ? (
          <div className="col-span-2 border-4 border-dashed border-slate-200 p-12 text-center rounded-[2rem]">
            <span className="text-4xl">⚡</span>
            <h3 className="text-lg font-black uppercase text-slate-400 mt-2">All Circuits Stable</h3>
            <p className="text-slate-400 text-sm font-bold">No active subtopics fell below the 75% mastery threshold.</p>
          </div>
        ) : (
          weakTracks.map((track) => (
            <div 
              key={track.id} 
              className="bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-black uppercase bg-slate-900 text-white px-2 py-0.5">
                    {track.topic}
                  </span>
                  <span className="text-xs font-black text-rose-600">
                    STRENGTH: {track.synapseStrength}%
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-slate-900">
                  {track.subtopic}
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  Total Reps Run: {track.totalReps || 0}
                </p>
                
                {/* Visual Load Bar */}
                <div className="w-full h-3 bg-slate-100 border-2 border-black mt-4 p-0.5 overflow-hidden">
                  <div 
                    className="h-full bg-rose-500" 
                    style={{ width: `${track.synapseStrength}%` }}
                  />
                </div>
              </div>

              <Link 
                href={`/math/workout?mode=isolation&subtopic=${encodeURIComponent(track.subTopicId)}`}
                className="mt-6 block text-center bg-slate-900 text-white py-3 text-xs font-black uppercase tracking-wider border-2 border-black hover:bg-slate-800 active:scale-95 transition-all"
              >
                Fire Up Isolation Chamber →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}