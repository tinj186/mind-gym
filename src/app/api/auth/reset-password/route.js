import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token },
    });

    if (!verificationToken || !verificationToken.identifier.startsWith('pwreset_')) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    if (new Date() > verificationToken.expires) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token,
          }
        }
      });
      return NextResponse.json({ message: 'Token has expired' }, { status: 400 });
    }

    // Extract email from identifier (e.g. 'pwreset_john@example.com' -> 'john@example.com')
    const email = verificationToken.identifier.replace('pwreset_', '');

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete the token so it cannot be used again
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        }
      }
    });

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
