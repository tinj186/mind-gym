import Link from 'next/link';
import { getStudentStatsAction } from '@/app/actions/statsActions';
import { prisma } from '@/lib/db';
import { getThemeForLevel } from '@/lib/LevelThemeConfig';

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
  const studentId = "default-student";
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

  const subject = {
    id: 'math',
    name: 'Mathematics',
    icon: '📐',
    status: 'Active',
    progress: progressScore,
    lastSession: lastSessionText,
    color: 'blue'
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="max-w-7xl mx-auto px-6 pt-8 flex justify-end">
        <Link href="/parent" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-md">
          <span>👨‍👩‍👧‍👦</span> Parent Command Center
        </Link>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">THE TRAINING GROUND</h1>
          <p className="text-slate-500 font-medium">Select a wing to begin your neural conditioning.</p>
        </section>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            key={subject.id}
            className={`group relative p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl cursor-pointer ${theme === getThemeForLevel('Primary 6') ? 'bg-slate-900 text-slate-100 hover:border-amber-500' : 'bg-white hover:border-sky-200'}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`text-4xl w-16 h-16 flex items-center justify-center rounded-2xl transition-colors ${theme === getThemeForLevel('Primary 6') ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-slate-50 group-hover:bg-sky-50'}`}>
                {subject.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${theme === getThemeForLevel('Primary 6') ? 'bg-slate-800 text-amber-500 border-amber-500/30' : 'bg-sky-50 text-sky-600 border-sky-100'}`}>
                {subject.status}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-2">{subject.name}</h2>
            <p className="text-sm opacity-60 mb-8">
              Last session: {subject.lastSession}
            </p>

            {/* Progress Bar (Visible for Active) */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold uppercase opacity-60">Synapse Confidence</span>
                <span className={`text-lg font-black ${theme.primaryColor}`}>{subject.progress}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${theme === getThemeForLevel('Primary 6') ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div 
                  className={`${theme.primaryBg} h-full rounded-full transition-all duration-1000`}
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
              <Link href="/math">
                <button className={`w-full mt-6 py-4 rounded-2xl font-bold transition-all cursor-pointer ${theme === getThemeForLevel('Primary 6') ? 'bg-amber-500 text-slate-900 hover:bg-amber-400' : 'bg-slate-900 text-white hover:bg-sky-600'}`}>
                  Open Wing →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}