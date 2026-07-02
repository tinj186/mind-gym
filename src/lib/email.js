import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER_EMAIL = 'The Learn Reps <no-reply@thelearnreps.com>';

const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes('vercel.app')) {
    return process.env.NEXTAUTH_URL; // If it's a custom domain or localhost, use it
  }
  // On Vercel, prioritize the actual production URL to prevent branch-specific 404s
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  // Fallback to NextAuth URL even if it's a vercel URL if others are missing
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  return 'http://localhost:3000';
};

export const sendVerificationEmail = async (email, token) => {
  const confirmLink = `${getBaseUrl()}/verify-email?token=${token}`;

  await resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: 'Welcome to The Learn Reps! Verify your email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563EB;">Welcome to The Learn Reps!</h2>
        <p>Thank you for signing up. To complete your registration and secure your account, please verify your email address by clicking the link below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmLink}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6B7280;"><a href="${confirmLink}">${confirmLink}</a></p>
        <p>If you did not create an account, you can safely ignore this email.</p>
        <br />
        <p>Best regards,</p>
        <p><strong>The Learn Reps Support Team</strong></p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${getBaseUrl()}/reset-password?token=${token}`;

  await resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: 'Reset your Password - The Learn Reps',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563EB;">Password Reset Request</h2>
        <p>We received a request to reset your password for your The Learn Reps account.</p>
        <p>Click the link below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6B7280;"><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        <p>This link will expire in 24 hours.</p>
        <br />
        <p>Best regards,</p>
        <p><strong>The Learn Reps Support Team</strong></p>
      </div>
    `,
  });
};
