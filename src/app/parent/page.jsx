import Link from 'next/link';
import { getStudentStatsAction } from '@/app/actions/statsActions';
import { getCurrentStudentId } from '@/lib/auth-utils';

export default async function ParentHub() {
  const studentId = await getCurrentStudentId() || "default-student";
  let stats;
  try {
    stats = await getStudentStatsAction(studentId);
  } catch (error) {
    stats = { summary: { avgStrength: 0 } };
  }
  const progressScore = stats?.summary?.avgStrength || 0;

  return (
    <div className="min-h-screen bg-indigo-50/50">


      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-black text-indigo-950 tracking-tight uppercase">Parent Command Center</h1>
          <p className="text-indigo-900/60 font-medium">Select a subject to monitor neural conditioning and analytics.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Active Subject: Math */}
          <div className="group relative p-8 rounded-[2.5rem] border shadow-sm transition-all bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-xl cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="text-4xl w-16 h-16 flex items-center justify-center rounded-2xl transition-colors bg-indigo-50 group-hover:bg-indigo-100">
                📐
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-violet-50 text-violet-700 border-violet-200">
                Active Monitoring
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-2 text-indigo-950">Mathematics</h2>
            <p className="text-sm opacity-80 mb-8 font-medium text-indigo-900/60">
              View neural training progress, mastery analytics, and bottleneck metrics.
            </p>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold uppercase opacity-60 text-indigo-950">Synapse Confidence</span>
                <span className="text-lg font-black text-violet-600">{progressScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-indigo-50">
                <div 
                  className="bg-violet-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${progressScore}%` }}
                />
              </div>
              <Link href="/parent/math" className="block mt-6">
                <button className="w-full py-4 rounded-2xl font-bold transition-all cursor-pointer bg-indigo-900 text-white hover:bg-indigo-700 hover:shadow-lg">
                  Open Analytics →
                </button>
              </Link>
            </div>
          </div>

          {/* Inactive Subject: Science */}
          <div className="group relative p-8 rounded-[2.5rem] border shadow-sm transition-all bg-white/50 border-indigo-100/50 opacity-70 grayscale cursor-not-allowed">
            <div className="flex justify-between items-start mb-6">
              <div className="text-4xl w-16 h-16 flex items-center justify-center rounded-2xl transition-colors bg-slate-100">
                🔒
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-slate-100 text-slate-500 border-slate-200">
                Coming Soon
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-2 text-indigo-950">Science</h2>
            <p className="text-sm opacity-60 mb-8 text-indigo-900/60">
              In Development
            </p>

            <div className="mt-6 pt-6 border-t border-indigo-100/50">
              <button disabled className="w-full py-4 rounded-2xl font-bold bg-slate-100 text-slate-400 cursor-not-allowed">
                In Development
              </button>
            </div>
          </div>

          {/* Inactive Subject: English */}
          <div className="group relative p-8 rounded-[2.5rem] border shadow-sm transition-all bg-white/50 border-indigo-100/50 opacity-70 grayscale cursor-not-allowed">
            <div className="flex justify-between items-start mb-6">
              <div className="text-4xl w-16 h-16 flex items-center justify-center rounded-2xl transition-colors bg-slate-100">
                🔒
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-slate-100 text-slate-500 border-slate-200">
                Coming Soon
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-2 text-indigo-950">English</h2>
            <p className="text-sm opacity-60 mb-8 text-indigo-900/60">
              In Development
            </p>

            <div className="mt-6 pt-6 border-t border-indigo-100/50">
              <button disabled className="w-full py-4 rounded-2xl font-bold bg-slate-100 text-slate-400 cursor-not-allowed">
                In Development
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
