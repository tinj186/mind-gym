import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getDailyWorkout } from '@/lib/intelligence/workout';

export const dynamic = 'force-dynamic';

/**
 * Endpoint for initializing a Daily Workout session.
 * Consumes the 20/60/20 Rep Structure algorithm.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json({ error: "Student ID required" }, { status: 400 });
  }

  try {
    // Ensure profile exists to prevent record-not-found errors during workout generation
    const profile = await prisma.studentProfile.upsert({
      where: { id: studentId },
      update: {},
      create: { 
        id: studentId, 
        name: studentId === "default-student" ? "Default Student" : "New Student",
        externalId: studentId === "default-student" ? "default-external-id" : studentId,
        primaryLevel: "Primary 1" 
      }
    });
    const level = profile?.primaryLevel || "Primary 1";

    console.log(`--- [WORKOUT ENGINE] Init for Student: ${studentId} (${level}) ---`);
    const workout = await getDailyWorkout(studentId, level);
    
    // Refresh profile to get current progress (index and log)
    const updatedProfile = await prisma.studentProfile.findUnique({ 
      where: { id: studentId },
      select: { activeWorkout: true }
    });
    const currentIndex = updatedProfile?.activeWorkout?.currentIndex || 0;
    const answersLog = updatedProfile?.activeWorkout?.answersLog || [];

    console.log(`--- [WORKOUT ENGINE] Success: Generated ${workout.length} reps. IDs: ${workout.map(q => q.id.substring(0,8)).join(', ')} ---`);

    return NextResponse.json({ workout, level, currentIndex, answersLog });
  } catch (error) {
    console.error("Failed to generate workout:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}