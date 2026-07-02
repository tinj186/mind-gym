import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // We don't want to leak whether a user exists or not for security reasons.
    // If the user doesn't exist, we still return a success message.
    if (user) {
      // Generate Reset Token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Delete any existing tokens for this user to prevent spam
      await prisma.verificationToken.deleteMany({
        where: { identifier: `pwreset_${email}` }
      });

      await prisma.verificationToken.create({
        data: {
          identifier: `pwreset_${email}`,
          token,
          expires,
        },
      });

      await sendPasswordResetEmail(email, token);
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, we sent a password reset link.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
