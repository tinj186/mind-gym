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
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <ZoneCard 
          title="Daily Practice"
          description={`Target: ${dailyTarget} reps`}
          href={activeWorkout && activeWorkout.mode !== 'daily' ? undefined : `/math/workout?level=${encodeURIComponent(currentLevel)}`}
          icon="⚡️"
          isPrimary={true}
          themeVariants={theme}
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
          themeVariants={theme}
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
          themeVariants={theme}
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