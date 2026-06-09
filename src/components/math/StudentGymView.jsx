import { prisma } from '@/lib/db';
import { SYLLABUS_DATA } from '@/lib/syllabus';
import DivisionBadge from '@/components/math/DivisionBadge';
import MathDashboardClient from '@/components/math/MathDashboardClient';
import Link from 'next/link';
import { StudentProvider } from '@/contexts/StudentContext';
import { getThemeForLevel, getDailyTargetReps } from '@/lib/LevelThemeConfig';

/**
 * StudentGymView: The primary neuro-trainer dashboard for students.
 * Handles data fetching for profile, mastery, and syllabus mapping.
 */
export default async function StudentGymView() {
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
    // TRUE FALLBACK: historical accuracy from the raw logs
    const correctReps = await prisma.attemptLog.count({
      where: { studentId, isCorrect: true }
    });
    overallStrength = Math.round((correctReps / totalReps) * 100);
  }

  // 5. Daily Goal Tracking
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayReps = await prisma.attemptLog.count({
    where: { 
      studentId, 
      createdAt: { gte: startOfToday } 
    }
  });

  const dailyTarget = getDailyTargetReps(currentLevel);
  const currentStreak = profile?.currentStreak || 0;

  const bottleneck = masteryData.length > 0
    ? masteryData.reduce((prev, curr) => ((prev.synapseStrength || 0) < (curr.synapseStrength || 0)) ? prev : curr)
    : null;
  const bottleneckTopicName = bottleneck?.topicId?.split('-').slice(1).join(' ').toUpperCase() || "NONE";

  // 5. Dynamic Theming
  const theme = getThemeForLevel(currentLevel);

  return (
    <StudentProvider initialLevel={currentLevel}>
      <div className={`min-h-screen ${theme.pageBg || 'bg-white'}`}>
        {/* Gym Header with Division Auto-Save Badge */}
        <header className="p-6 flex justify-between items-center border-b border-slate-200/50 sticky top-0 bg-white/40 backdrop-blur-xl z-50">
          <div className="flex flex-col">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] block ${theme.primaryColor}`}>
              Math Practice
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
              {theme.headerTitle}
            </h1>
          </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/parent" 
            title="Parent Command Center" 
            className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors text-lg"
          >
            👨‍👩‍👧‍👦
          </Link>
          <DivisionBadge studentId={studentId} currentLevel={currentLevel} />
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-12">
        {/* Neural Status Header */}
        <section className={`${theme.statusBarTheme} border-[6px] rounded-[3rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 font-bold uppercase`}>
          <div className="text-[10px] mb-10 tracking-widest font-black opacity-90">
            MY PROGRESS // {profile?.name?.toUpperCase() || "DEFAULT_STUDENT"}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
            <div className="flex flex-col">
              <span className="text-[10px] opacity-70 mb-1 tracking-tighter">TODAY'S GOAL</span>
              <span className="text-4xl font-black tracking-tighter">{todayReps}/{dailyTarget} <span className="text-sm font-bold opacity-70">REPS</span></span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] opacity-70 mb-1 tracking-tighter">STREAK</span>
              <span className="text-4xl font-black tracking-tighter text-orange-400">{currentStreak} DAYS 🔥</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] opacity-70 mb-1 tracking-tighter">TOTAL PRACTICE</span>
              <span className="text-4xl font-black tracking-tighter tabular-nums">{totalReps}</span>
            </div>
          </div>

          <div className="inline-block bg-white/20 px-4 py-2 text-[10px] font-black border-[3px] border-current hover:bg-white/30 transition-colors cursor-pointer">
            READY FOR A CHALLENGE? // YOU'RE DOING GREAT!
          </div>
        </section>

          <MathDashboardClient 
            studentId={studentId}
            syllabus={syllabus} 
            masteryData={masteryData} 
          />
        </main>
      </div>
    </StudentProvider>
  );
}