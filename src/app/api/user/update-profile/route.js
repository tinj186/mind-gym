import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update the user
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
      },
    });

    // Also update the associated StudentProfile so the top bar updates
    await prisma.studentProfile.updateMany({
      where: { userId: session.user.id },
      data: { name },
    });

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}
