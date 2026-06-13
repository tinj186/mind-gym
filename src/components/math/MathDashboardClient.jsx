"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ZoneCard from './ZoneCard';
import SynapseMap from './SynapseMap';
import { useStudentContext } from '@/contexts/StudentContext';
import { getThemeForLevel, getDailyTargetReps } from '@/lib/LevelThemeConfig';

export default function MathDashboardClient({ studentId, syllabus, masteryData }) {
  const router = useRouter();
  const [showTopicGrid, setShowTopicGrid] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const { currentLevel } = useStudentContext();
  const theme = getThemeForLevel(currentLevel);
  const dailyTarget = getDailyTargetReps(currentLevel);

  useEffect(() => {
    const saved = localStorage.getItem(`active_workout_${studentId}`);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.answersLog?.length > 0 && data.answersLog?.length < 10) {
        setActiveWorkout({
          mode: data.mode || 'daily',
          progress: data.answersLog.length,
          subtopicId: data.subtopicId
        });
      }
    }
  }, []);

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