import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getStudentStatsAction } from '@/app/actions/statsActions';
import { prisma } from '@/lib/db';
import { getThemeForLevel } from '@/lib/LevelThemeConfig';
import { getCurrentStudentId } from '@/lib/auth-utils';
import HubGridClient from '@/components/hub/HubGridClient';
import { StripeAdapter } from '@/lib/payments/adapters/StripeAdapter';
import { sendSubscriptionWelcomeEmail } from '@/lib/email';

function timeAgo(dateInput) {
  if (!dateInput) return 'N/A';
  
  const date = new Date(dateInput);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  return Math.floor(seconds) + " seconds ago";
}

export default async function OverallView({ searchParams }) {
  try {
    const resolvedParams = await searchParams;
    const sessionId = resolvedParams?.session_id;

    if (sessionId) {
      try {
        const adapter = new StripeAdapter();
        const verification = await adapter.verifySession(sessionId);
        
        if (verification.isPaid && verification.userId) {
          const existingUser = await prisma.user.findUnique({ where: { id: verification.userId } });
          
          if (existingUser && existingUser.subscriptionStatus !== 'ACTIVE') {
            const updatedUser = await prisma.user.update({
              where: { id: verification.userId },
              data: { 
                subscriptionStatus: 'ACTIVE',
                stripeCustomerId: verification.stripeCustomerId || existingUser.stripeCustomerId
              }
            });
            
            if (updatedUser && updatedUser.email) {
              try {
                await sendSubscriptionWelcomeEmail(updatedUser.email, updatedUser.name);
                console.log(`[Fallback] Welcome email sent successfully to ${updatedUser.email}`);
              } catch (emailError) {
                console.error(`[Fallback] Failed to send welcome email:`, emailError);
              }
            }
          }
        }
      } catch (err) {
        console.error("Fallback verification failed:", err);
      }
      // Redirect to clear the session_id from the URL so it's clean and doesn't re-run
      redirect('/hub');
    }

    const studentId = await getCurrentStudentId() || "default-student";
    let stats;
    
    try {
      stats = await getStudentStatsAction(studentId);
    } catch (error) {
      stats = { avgStrength: 0, recentLogs: [] };
    }

    const profile = await prisma.studentProfile.findUnique({ where: { id: studentId } });
    const currentLevel = profile?.primaryLevel || "";
    const theme = getThemeForLevel(currentLevel);

    const lastLogDate = stats?.recentLogs?.[0]?.createdAt;
    const lastSessionText = lastLogDate ? timeAgo(lastLogDate) : 'Never practiced';
    const progressScore = stats?.summary?.avgStrength || 0;

    const subjects = [
      {
        id: 'math-p1',
        name: 'Primary 1 Math',
        icon: '📐',
        status: 'Available Now',
        progress: progressScore,
        lastSession: lastSessionText,
        isActive: true,
      }
    ];

    return (
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">THE TRAINING GROUND</h1>
          <p className="text-slate-500 font-medium">Select a wing to begin your neural conditioning.</p>
        </section>

        {/* Subjects Grid */}
        <HubGridClient 
          subjects={subjects} 
          themePrimaryBg={theme.primaryBg} 
          themePrimaryColor={theme.primaryColor} 
          isP6={theme === getThemeForLevel('Primary 6')} 
        />
      </main>
    );
  } catch (globalError) {
    return (
      <div className="p-10 bg-red-100 text-red-900">
        <h1>Server Error Caught!</h1>
        <pre>{globalError.message}</pre>
        <pre>{globalError.stack}</pre>
      </div>
    );
  }
}