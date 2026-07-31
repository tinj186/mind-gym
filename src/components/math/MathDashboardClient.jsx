"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ZoneCard from './ZoneCard';
import SynapseMap from './SynapseMap';
import { useStudentContext } from '@/contexts/StudentContext';
import { getThemeForLevel, getDailyTargetReps } from '@/lib/LevelThemeConfig';

export default function MathDashboardClient({ studentId, syllabus, masteryData, serverActiveWorkout }) {
  const router = useRouter();
  const [showTopicGrid, setShowTopicGrid] = useState(false);
  const { currentLevel } = useStudentContext();
  const theme = getThemeForLevel(currentLevel);
  const dailyTarget = getDailyTargetReps(currentLevel);

  // Compute activeWorkout derived state from the backend database state
  let activeWorkout = null;
  if (serverActiveWorkout && serverActiveWorkout.answersLog?.length > 0 && serverActiveWorkout.answersLog?.length < 10) {
    activeWorkout = {
      mode: serverActiveWorkout.mode || 'daily',
      progress: serverActiveWorkout.answersLog.length,
      subtopicId: serverActiveWorkout.subtopicId
    };
  }

  // Navigation handler for targeted Isolation sessions
  const handleIsolationStart = (subtopic, tier) => {
    sessionStorage.setItem('allow_workout', 'true');
    const targetSubtopic = subtopic.id || subtopic.name || subtopic;
    router.push(`/math/workout?mode=isolation&subtopic=${encodeURIComponent(targetSubtopic)}&difficulty=${tier.toLowerCase()}&level=${encodeURIComponent(currentLevel)}`);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section: Three Training Zones */}
      <div className="hidden border-teal-700 bg-cyan-50 border-cyan-200 text-cyan-900 bg-cyan-500 border-cyan-600 shadow-[0_20px_50px_-12px_rgba(6,182,212,0.5)] from-emerald-500 to-teal-500 text-teal-500 bg-teal-50 border-teal-200 text-teal-900 hover:border-teal-400 hover:bg-teal-100 hover:border-cyan-400 hover:bg-cyan-100 shadow-[0_20px_50px_-12px_rgba(20,184,166,0.5)]"></div>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <ZoneCard 
          title="Daily Practice"
          description={`Target: ${dailyTarget} reps`}
          href={activeWorkout && activeWorkout.mode !== 'daily' ? undefined : `/math/workout?level=${encodeURIComponent(currentLevel)}`}
          icon="⚡️"
          isPrimary={true}
          themeVariants={theme.zoneVariants}
          resumeProgress={activeWorkout?.mode === 'daily' ? activeWorkout.progress : null}
          isLocked={activeWorkout && activeWorkout.mode !== 'daily'}
        />
        <ZoneCard 
          title="Subtopic Focus"
          onClick={activeWorkout && activeWorkout.mode !== 'isolation' ? undefined : (activeWorkout?.mode === 'isolation' ? undefined : () => setShowTopicGrid(!showTopicGrid))}
          href={activeWorkout?.mode === 'isolation' ? `/math/workout?mode=isolation&subtopic=${encodeURIComponent(activeWorkout.subtopicId)}&level=${encodeURIComponent(currentLevel)}` : undefined}
          icon="🔬"
          variant="amber"
          isPrimary={true}
          isActive={showTopicGrid}
          themeVariants={theme.zoneVariants}
          resumeProgress={activeWorkout?.mode === 'isolation' ? activeWorkout.progress : null}
          isLocked={activeWorkout && activeWorkout.mode !== 'isolation'}
        />
        <ZoneCard 
          title="Mock Exam"
          description="Full Syllabus Simulation"
          href={activeWorkout ? undefined : `/math/exam?level=${encodeURIComponent(currentLevel)}`}
          icon="🏆"
          variant="slate"
          isPrimary={true}
          themeVariants={theme.zoneVariants}
          isLocked={!!activeWorkout}
        />
      </section>

      {/* The Synapse Map (Topic Grid) */}
      {showTopicGrid && (
        <SynapseMap 
          syllabus={syllabus} 
          masteryData={masteryData} 
          onStartTrack={handleIsolationStart}
          activeWorkout={activeWorkout}
        />
      )}
    </div>
  );
}