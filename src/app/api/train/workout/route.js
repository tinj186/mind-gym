import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getDailyWorkout } from '../../../../../prisma/workout';

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
    const profile = await prisma.studentProfile.findUnique({ where: { id: studentId } });
    const level = profile?.primaryLevel || "Primary 1";

    const workout = await getDailyWorkout(studentId, level);

    return NextResponse.json({ workout, level });
  } catch (error) {
    console.error("Failed to generate workout:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}