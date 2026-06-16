"use client";

import { useState, useEffect } from 'react';
import { Joyride } from 'react-joyride';

export default function AnalyticsTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the tour in localStorage
    const hasSeenTour = localStorage.getItem('hasSeenAnalyticsTour');
    if (!hasSeenTour) {
      // Small delay to ensure the page is fully rendered
      const timer = setTimeout(() => {
        setRun(true);
        // Set the flag immediately so it doesn't trigger again even if they refresh halfway through
        localStorage.setItem('hasSeenAnalyticsTour', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const { status, action } = data;
    const finishedStatuses = ['finished', 'skipped', 'error'];

    if (finishedStatuses.includes(status) || action === 'close') {
      setRun(false);
      localStorage.setItem('hasSeenAnalyticsTour', 'true');
    }
  };

  const steps = [
    {
      target: 'body',
      content: 'Welcome to the Analytics Engine! Here you can see a deep dive into your child\'s performance.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '#tour-vital-signs',
      content: 'These are the top-level vital signs: the overall confidence and the total number of reps completed across all topics.',
      placement: 'bottom',
    },
    {
      target: '#tour-proficiency-heatmap',
      content: 'The Proficiency Heatmap shows you exactly which topics are strong (green) and which need work (red).',
      placement: 'top',
    },
    {
      target: '#tour-variant-analysis',
      content: 'Variant Bottlenecks breaks down the exact question types that are causing trouble so you know exactly what to practice.',
      placement: 'top',
    },
    {
      target: '#tour-assessment-readiness',
      content: 'Finally, the Assessment Audit Board predicts their readiness for formal exams based on their practice data.',
      placement: 'top',
    }
  ];

  return (
    <>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            primaryColor: '#4f46e5', // indigo-600
            zIndex: 1000,
          },
        }}
      />
      
      {/* Voluntary Trigger Button */}
      {!run && (
        <button
          onClick={() => setRun(true)}
          className="fixed bottom-6 right-6 bg-white border border-indigo-100 text-indigo-900 shadow-lg px-4 py-2 rounded-full font-bold text-sm hover:bg-indigo-50 hover:-translate-y-1 transition-transform z-50 flex items-center gap-2 print:hidden"
        >
          <span>💡</span> Replay Tour
        </button>
      )}
    </>
  );
}
