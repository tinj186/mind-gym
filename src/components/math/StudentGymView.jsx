import { prisma } from '@/lib/db';
import { SYLLABUS_DATA } from '@/lib/syllabus';
import DivisionBadge from '@/components/math/DivisionBadge';
import MathDashboardClient from '@/components/math/MathDashboardClient';
import Link from 'next/link';
import { StudentProvider } from '@/contexts/StudentContext';
import { getThemeForLevel, getDailyTargetReps } from '@/lib/LevelThemeConfig';
import { getCurrentStudentId } from '@/lib/auth-utils';

/**
 * StudentGymView: The primary neuro-trainer dashboard for students.
 * Handles data fetching for profile, mastery, and syllabus mapping.
 */
export default async function StudentGymView() {
  // 1. Fetch real student data from your updated Prisma schema
  const studentId = await getCurrentStudentId() || "default-student"; // In production, this comes from your session
  
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
      <div className={`min-h-screen ${theme.pageBg || 'bg-white'} p-6 max-w-7xl mx-auto`}>
        {/* Gym Header Section */}
        <header className="mb-8 flex justify-between items-end">
          <div className="flex flex-col">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] block ${theme.primaryColor} mb-2`}>
              Training Wing
            </span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              {theme.headerTitle}
            </h1>
          </div>
        
          <div className="flex items-center gap-4">
            <DivisionBadge studentId={studentId} currentLevel={currentLevel} />
          </div>
        </header>

      <main className="space-y-12">
        {/* Neural Status Header */}
        <section className={`${theme.statusBarTheme} rounded-[2.5rem] shadow-lg p-12 font-bold uppercase relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          <div className="relative z-10 text-sm mb-8 tracking-widest font-black opacity-90">
            MY PROGRESS // {profile?.name?.toUpperCase() || "DEFAULT_STUDENT"}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
            <div className="flex flex-col">
              <span className="text-sm opacity-90 mb-2 tracking-wider font-bold">TODAY'S GOAL</span>
              <span className="text-5xl font-black tracking-tighter">{todayReps}/{dailyTarget} <span className="text-xl font-bold opacity-70">REPS</span></span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm opacity-90 mb-2 tracking-wider font-bold">STREAK</span>
              <span className="text-5xl font-black tracking-tighter">
                {currentStreak} DAYS {currentStreak === 0 ? '🧊' : currentStreak < 3 ? '⚡️' : currentStreak < 7 ? '🔥' : '🚀'}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm opacity-90 mb-2 tracking-wider font-bold">TOTAL PRACTICE</span>
              <span className="text-5xl font-black tracking-tighter tabular-nums">{totalReps}</span>
            </div>
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