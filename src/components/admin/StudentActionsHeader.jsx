'use client';

import { useRouter } from 'next/navigation';
import { resetStudentProgressAction } from '@/lib/admin/studentActions';
import { useState } from 'react';

export default function StudentActionsHeader({ studentId }) {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetProgress = async () => {
    if (window.confirm("CRITICAL WARNING: This will permanently wipe all mastery, rep counts, and logs for this student. Are you sure you want to WIPE NEURAL DATA?")) {
      setIsResetting(true);
      try {
        const result = await resetStudentProgressAction(studentId);
        if (result.success) {
          alert(result.message);
          router.refresh(); // Refresh the current page to reflect changes
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Failed to reset student progress:", error);
        alert("An unexpected error occurred while resetting progress.");
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <button
      onClick={handleResetProgress}
      disabled={isResetting}
      className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md ${isResetting ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-rose-600 text-white hover:bg-rose-700 active:scale-95'}`}
    >
      {isResetting ? 'WIPING...' : 'WIPE NEURAL DATA'}
    </button>
  );
}