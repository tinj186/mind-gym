import { prisma } from '@/lib/db';
import { getDailyWorkout } from '@/lib/intelligence/workout'; // 20/60/20 & Isolation engine logic
import WorkoutSession from '@/components/math/WorkoutSession';
import { redirect } from 'next/navigation';
import { getCurrentStudentId } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export default async function DailyWorkoutPage({ searchParams }) {
  const studentId = await getCurrentStudentId() || "default-student";
  const params = await searchParams;
  const mode = params?.mode || "daily";
  const subtopicId = params?.subtopic || null;
  const difficulty = params?.difficulty || null;

  // 1. Validate student profile and primary level configuration
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentId }
  });

  if (!profile?.primaryLevel) {
    redirect('/math');
  }

  // 2. Fetch the 10-question set (Handles both composite mix and targeted isolation subtopics)
  const workoutSet = await getDailyWorkout(studentId, profile.primaryLevel, {
    mode,
    subtopicId,
    difficulty
  });

  if (!workoutSet || workoutSet.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center bg-white">
        <div className="max-w-md space-y-4 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black text-slate-900 uppercase">Arena Empty</h2>
          <p className="text-slate-500 font-bold">
            No questions found for {profile.primaryLevel} {subtopicId ? `(${subtopicId})` : ''}. Please seed questions to fire up the machines.
          </p>
        </div>
      </div>
    );
  }

  // 3. Re-fetch the profile to ensure we get the guaranteed updated activeWorkout state (created by getDailyWorkout)
  const finalProfile = await prisma.studentProfile.findUnique({
    where: { id: studentId }
  });
  
  const activeWorkout = finalProfile?.activeWorkout || {};

  // 4. Launch the decoupled client session controller using server state
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <WorkoutSession 
        studentId={studentId}
        level={profile.primaryLevel}
        initialQuestions={workoutSet}
        initialIndex={activeWorkout.currentIndex || 0}
        initialLog={activeWorkout.answersLog || []}
        title={mode === 'isolation' ? "Hyper-Focused Isolation Reps" : "Daily Training Sequence"}
        mode={mode}
        subtopicId={subtopicId}
      />
    </div>
  );
}