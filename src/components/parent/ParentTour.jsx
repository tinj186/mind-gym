"use client";

import { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';

export default function ParentTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the tour in localStorage
    const hasSeenTour = localStorage.getItem('hasSeenParentTour');
    if (!hasSeenTour) {
      // Small delay to ensure the page is fully rendered
      const timer = setTimeout(() => {
        setRun(true);
        // Set the flag immediately so it doesn't trigger again even if they refresh halfway through
        localStorage.setItem('hasSeenParentTour', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const { status, action } = data;
    
    // Explicitly use strings instead of STATUS object just in case it's undefined
    const finishedStatuses = ['finished', 'skipped', 'error'];

    if (finishedStatuses.includes(status) || action === 'close') {
      setRun(false);
      localStorage.setItem('hasSeenParentTour', 'true');
    }
  };

  const steps = [
    {
      target: 'body',
      content: 'Welcome to the Parent Command Center! Let\'s take a quick look around.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '#tour-active-subject',
      content: 'Here are the subjects your child is currently training in.',
      placement: 'bottom',
    },
    {
      target: '#tour-synapse-confidence',
      content: 'Synapse Confidence is our proprietary metric measuring your child\'s neural mastery of the subject, combining accuracy, speed, and consistency.',
      placement: 'top',
    },
    {
      target: '#tour-open-analytics',
      content: 'Click here to dive deep into their performance metrics, identify bottlenecks, and review past sessions.',
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
