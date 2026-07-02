import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function VerifyEmailPage({ searchParams }) {
  const params = await searchParams;
  const token = params?.token;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h2>
          <p className="text-gray-600 mb-6">No verification token was provided.</p>
          <Link href="/login" className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Find the token
  const verificationToken = await prisma.verificationToken.findFirst({
    where: { token },
  });

  if (!verificationToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid or Expired Token</h2>
          <p className="text-gray-600 mb-6">This verification link is invalid or has already been used.</p>
          <Link href="/login" className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (new Date() > verificationToken.expires) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        }
      }
    });

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Link Expired</h2>
          <p className="text-gray-600 mb-6">This verification link has expired. Please sign up again or request a new link.</p>
          <Link href="/signup" className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  // Update user
  const user = await prisma.user.findUnique({
    where: { email: verificationToken.identifier },
  });

  if (user && !user.emailVerified) {
    await prisma.user.update({
      where: { email: user.email },
      data: { emailVerified: new Date() },
    });
  }

  // Delete token
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Email Verified!</h2>
        <p className="text-gray-600 mb-6">Your email address has been successfully verified. You can now log in to your account.</p>
        <Link href="/login" className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
