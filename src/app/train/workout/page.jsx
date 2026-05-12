import { prisma } from '@/lib/db';
import { getDailyWorkout } from '@/lib/intelligence/workout'; // Our 20/60/20 logic
import WorkoutSession from '@/components/gym/WorkoutSession';
import { redirect } from 'next/navigation';

export default async function DailyWorkoutPage() {
  const studentId = "default-student"; // Placeholder for session ID

  // 1. Check if the student has a level set (Syllabus scaling)
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentId }
  });

  if (!profile?.primaryLevel) {
    redirect('/gym/math'); // Send back to select a level if missing
  }

  // 2. Trigger the 20/60/20 Algorithm to get the 10-question set
  const workoutSet = await getDailyWorkout(studentId, profile.primaryLevel);

  if (!workoutSet || workoutSet.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-black text-slate-900 uppercase">Gym Equipment Missing</h2>
          <p className="text-slate-500 font-bold">The Question Bank for {profile.primaryLevel} is empty. Please seed questions to start training.</p>
        </div>
      </div>
    );
  }

  // 3. Launch the Session Controller
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <WorkoutSession 
        studentId={studentId} 
        level={profile.primaryLevel} 
        initialQuestions={workoutSet} 
      />
    </div>
  );
}
