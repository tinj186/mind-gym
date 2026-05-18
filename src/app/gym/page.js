import { prisma } from '@/lib/db';
import { SYLLABUS_DATA } from '@/lib/syllabus'; // Ensure this contains your topic mappings
import DivisionBadge from '@/components/gym/DivisionBadge';
import MathDashboardClient from '@/components/gym/MathDashboardClient';
import Link from 'next/link';

export default async function MathWingDashboard() {
  // 1. Fetch real student data from your updated Prisma schema
  const studentId = "default-student"; // In production, this comes from your session
  
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: { mastery: true }
  });

  // 2. Identify current division for automated scaling (Universal Engine Protocol)
  const currentLevel = profile?.primaryLevel || "";
  const masteryData = profile?.mastery || [];
  
  // 3. Load the specific syllabus blueprint for the selected level
  const syllabus = SYLLABUS_DATA[currentLevel] || [];

  // 4. Neural Analytics Calculations
  const totalReps = await prisma.attemptLog.count({
    where: { studentId }
  });

  let overallStrength = 0;

  // Filter for subtopics that have actually processed mastery points (> 0)
  const trainedMastery = masteryData.filter(m => (m.synapseStrength || 0) > 0);

  if (trainedMastery.length > 0) {
    overallStrength = Math.round(
      trainedMastery.reduce((acc, m) => acc + (m.synapseStrength || 0), 0) / trainedMastery.length
    );
  } else if (totalReps > 0) {
    // TRUE FALLBACK: If records exist but all strengths are sitting at 0, 
    // compute live real-time historical accuracy from the raw logs.
    const correctReps = await prisma.attemptLog.count({
      where: { studentId, isCorrect: true }
    });
    overallStrength = Math.round((correctReps / totalReps) * 100);
  }

  const bottleneck = masteryData.length > 0
    ? masteryData.reduce((prev, curr) => ((prev.synapseStrength || 0) < (curr.synapseStrength || 0)) ? prev : curr)
    : null;
  const bottleneckTopicName = bottleneck?.topicId?.split('-').slice(1).join(' ').toUpperCase() || "NONE";

  return (
    <div className="min-h-screen bg-white">
      {/* Gym Header with Division Auto-Save Badge */}
      <header className="p-6 flex justify-between items-center border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] block">
            Mathematics Wing
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
            Neuro-Trainer Dashboard
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* This component handles the automated check-in and auto-save */}
          <DivisionBadge studentId={studentId} currentLevel={currentLevel} />
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-12">
        {/* Neural Status Header: High-Contrast 'Engine Room' Aesthetic */}
        <section className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 font-bold uppercase text-black">
          <div className="text-[10px] mb-10 tracking-widest font-black">
            NEURAL_SIGNATURE // {profile?.name?.toUpperCase() || "DEFAULT_STUDENT"}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 mb-1 tracking-tighter">LEVEL</span>
              <span className="text-4xl font-black tracking-tighter">{currentLevel || "N/A"}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 mb-1 tracking-tighter">TOTAL_REPS</span>
              <span className="text-4xl font-black tracking-tighter">{totalReps}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 mb-1 tracking-tighter">NEURAL_LOAD</span>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1 h-6 bg-slate-50 border-[3px] border-black overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-black transition-all duration-1000 ease-out" 
                    style={{ width: `${overallStrength}%` }}
                  />
                </div>
                <span className="text-2xl font-black tracking-tighter">{overallStrength}%</span>
              </div>
            </div>
          </div>

          {bottleneck && (
            <Link 
              href="/gym/isolation"
              className="inline-block bg-rose-50 text-rose-600 px-4 py-2 text-[10px] font-black border-[3px] border-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
            >
              RECOVERY_REQUIRED: {bottleneckTopicName} // CLICK_TO_REPAIR
            </Link>
          )}
        </section>

        {/* The Three Training Zones & Synapse Map Interaction */}
        <MathDashboardClient 
          studentId={studentId}
          syllabus={syllabus} 
          masteryData={masteryData} 
        />
      </main>
    </div>
  );
}