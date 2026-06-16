import Link from 'next/link';
import { getStudentStatsAction } from '@/app/actions/statsActions';
import { prisma } from '@/lib/db';
import { getThemeForLevel } from '@/lib/LevelThemeConfig';
import { getCurrentStudentId } from '@/lib/auth-utils';
import HubGridClient from '@/components/hub/HubGridClient';

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

export default async function OverallView() {
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
    },
    {
      id: 'math-p2',
      name: 'Primary 2 Math',
      icon: '🔒',
      status: 'Coming Q3',
      progress: 0,
      lastSession: 'In Development',
      isActive: false,
    },
    {
      id: 'math-p3',
      name: 'Primary 3 Math',
      icon: '🔒',
      status: 'Coming Q4',
      progress: 0,
      lastSession: 'In Development',
      isActive: false,
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
}