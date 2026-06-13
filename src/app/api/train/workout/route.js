import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getDailyWorkout } from '@/lib/intelligence/workout';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

/**
 * Endpoint for initializing a Daily Workout session.
 * Consumes the 20/60/20 Rep Structure algorithm.
 */
export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Find the first student profile for this user, or create one if it doesn't exist
    let profile = await prisma.studentProfile.findFirst({
      where: { userId: userId }
    });

    if (!profile) {
      profile = await prisma.studentProfile.create({
        data: {
          userId: userId,
          name: session.user.name || "Student",
          externalId: `ext-${userId}`,
          primaryLevel: "Primary 1"
        }
      });
    }

    const studentId = profile.id;
    const level = profile.primaryLevel || "Primary 1";

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