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

export const sendSubscriptionWelcomeEmail = async (email, name) => {
  const hubLink = `${getBaseUrl()}/hub`;

  await resend.emails.send({
    from: 'The Learn Reps <support@thelearnreps.com>',
    to: email,
    subject: 'Welcome to The Learn Reps! Your Annual Pass is Active 🧠',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #1E293B;">
        <p>Hi ${name || 'there'},</p>
        
        <p>Thank you for subscribing! Your payment was successful, and your account has been instantly upgraded to the <strong>Primary 1 Annual Pass</strong>.</p>
        
        <p>Welcome to <strong>The Learn Reps</strong>—where we treat mathematical fluency like muscle memory. You now have unlimited access to our dynamic, syllabus-aligned coaching platform.</p>
        
        <p>Unlike static question banks, our engine doesn't just mark answers "right" or "wrong." It tracks your child’s granular mastery—what we call "Synapse Strength"—and actively identifies specific learning bottlenecks to ensure they build the correct neural pathways without developing "bad form."</p>
        
        <h3 style="color: #2563EB; margin-top: 30px;">🏋️‍♂️ How to Build Strong Brain Connections</h3>
        <p>To get the most out of The Learn Reps and truly accelerate learning, here is how we recommend training:</p>
        
        <h4 style="margin-bottom: 5px;">Step 1: Trust the Daily Workout</h4>
        <p style="margin-top: 0;">Instead of randomly picking topics, have your child complete the algorithm-curated Daily Workout. Our engine uses a strict 20/60/20 rep structure: a 20% warm-up to build momentum, a 60% core workout targeting their exact weak spots, and a 20% challenge to push their boundaries.</p>
        
        <h4 style="margin-bottom: 5px;">Step 2: Focus on Form, Not Just Speed</h4>
        <p style="margin-top: 0;">If your child gets a question wrong, our AI Stealth Diagnostic kicks in to assign a "Defect Code" (e.g., Careless Calculation or Conceptual Error). Encourage them to review these specific missteps. Fixing the root cause is how permanent neural connections are formed.</p>
        
        <h4 style="margin-bottom: 5px;">Step 3: Monitor the Parent Hub</h4>
        <p style="margin-top: 0;">Check your dashboard regularly to track their actual Synapse Strength. If you notice high conceptual mastery but poor accuracy, it’s a sign to shift focus from learning new concepts to practicing execution and speed.</p>
        
        <p style="font-weight: bold; margin-top: 20px;">Consistency is key. Just a few targeted workouts a week will drastically improve their mathematical stamina and confidence.</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${hubLink}" style="background-color: #2563EB; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Go to Your Hub</a>
        </div>
        
        <p>If you have any questions, run into technical issues, or just need advice on getting started, reply directly to this email. We are here to help your child succeed.</p>
        
        <br />
        <p>Best regards,</p>
        <p><strong>The Learn Reps Team</strong><br/>
        <a href="https://thelearnreps.com" style="color: #2563EB;">thelearnreps.com</a></p>
      </div>
    `,
  });
};
