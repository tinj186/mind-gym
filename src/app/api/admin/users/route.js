import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;
  
  // Verify role in DB to be safe
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  return user?.role === 'ADMIN';
}

export async function GET(req) {
  try {
    if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const users = await prisma.user.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        subscriptionStatus: true,
        studentProfiles: {
          select: { id: true, name: true, primaryLevel: true }
        }
      }
    });

    // Compute Exhaustion Engine Metrics
    // 1. Get total questions available per level
    const levelCountsRaw = await prisma.questionBank.groupBy({
      by: ['level'],
      _count: { id: true }
    });
    const levelTotals = levelCountsRaw.reduce((acc, curr) => {
      acc[curr.level] = curr._count.id;
      return acc;
    }, {});

    // 2. Map through users and compute exhaustion for each student profile
    const usersWithExhaustion = await Promise.all(users.map(async (user) => {
      const enrichedProfiles = await Promise.all(user.studentProfiles.map(async (student) => {
        const totalAttempted = await prisma.attemptLog.findMany({
          where: { studentId: student.id },
          select: { questionId: true },
          distinct: ['questionId']
        });

        const attemptedCount = totalAttempted.length;
        const totalBankCount = levelTotals[student.primaryLevel] || 1; // Prevent div by 0
        const exhaustionPercent = Math.min(100, Math.round((attemptedCount / totalBankCount) * 100));

        return {
          ...student,
          exhaustionPercent,
          attemptedCount,
          totalBankCount
        };
      }));

      return {
        ...user,
        studentProfiles: enrichedProfiles
      };
    }));

    return NextResponse.json({ users: usersWithExhaustion }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId, role, subscriptionStatus } = await req.json();
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const updateData = {};
    if (role) updateData.role = role;
    if (subscriptionStatus) updateData.subscriptionStatus = subscriptionStatus;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    // Since onDelete: Cascade is configured in the schema, this will delete associated accounts, sessions, and student profiles
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
