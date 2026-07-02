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
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If email is changing, check if the new email is already in use
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return NextResponse.json({ error: 'Email already in use by another account' }, { status: 400 });
      }
    }

    // Update the user
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        email,
      },
    });

    // We also need to update the StudentProfile name to keep it somewhat in sync if the user is the primary student.
    // Wait, the StudentProfile `name` is usually set to the user's name on creation. 
    // We'll update any student profile associated with this user ID where the email/name might be relevant,
    // though the name in StudentProfile might just be the child's name. So maybe we shouldn't touch StudentProfile.

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}
