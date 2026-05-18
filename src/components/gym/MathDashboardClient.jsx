"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ZoneCard from './ZoneCard';
import SynapseMap from './SynapseMap';

export default function MathDashboardClient({ syllabus, masteryData }) {
  const router = useRouter();
  const [showTopicGrid, setShowTopicGrid] = useState(false);

  // Navigation handler for targeted Isolation sessions
  const handleIsolationStart = (subtopic, tier) => {
    const targetSubtopic = subtopic.id || subtopic.name || subtopic;
    router.push(`/gym/workout?mode=isolation&subtopic=${encodeURIComponent(targetSubtopic)}&difficulty=${tier.toLowerCase()}`);
  };

  return (
    <main className="p-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Section: Three Training Zones */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ZoneCard 
          title="The Daily Workout"
          description="Targeted 10-rep set using the 20/60/20 scaling algorithm."
          href="/gym/workout"
          icon="⚡"
          variant="blue"
        />
        <ZoneCard 
          title="The Isolation Lab"
          description="Target specific subtopics to strengthen neural pathways."
          onClick={() => setShowTopicGrid(!showTopicGrid)}
          icon="🔬"
          variant="amber"
          isActive={showTopicGrid}
        />
        <ZoneCard 
          title="The Arena"
          description="Enter full simulation mode with MOE-standard mock exams."
          href="/test/mock-exam"
          icon="🏟️"
          variant="slate"
        />
      </section>

      {/* The Synapse Map (Topic Grid) */}
      {showTopicGrid && (
        <SynapseMap 
          syllabus={syllabus} 
          masteryData={masteryData} 
          onStartTrack={handleIsolationStart}
        />
      )}
    </main>
  );
}