import Link from 'next/link';
import { getStudentStatsAction } from '@/app/actions/statsActions';
import ProficiencyHeatmap from '@/components/parent/math/ProficiencyHeatmap';
import VariantAnalysis from '@/components/parent/math/VariantAnalysis';
import AssessmentReadinessMap from '@/components/parent/math/AssessmentReadinessMap';

export default async function MathAnalyticsDashboard() {
  const studentId = "default-student";
  const stats = await getStudentStatsAction(studentId);

  return (
    <div className="min-h-screen bg-white">
      <header className="p-8 border-b-[8px] border-slate-900 bg-white flex justify-between items-end sticky top-0 z-50">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Analytics Engine</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Mathematics</h1>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/parent" 
            className="px-6 py-3 bg-white border-4 border-slate-900 text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-slate-100 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            ← Back to Hub
          </Link>
          <Link 
            href="/parent/math/help" 
            className="px-6 py-3 bg-indigo-100 border-4 border-slate-900 text-indigo-900 font-black uppercase tracking-widest text-xs hover:bg-indigo-200 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            Analytics Guide
          </Link>
          <Link 
            href="/math" 
            className="px-6 py-3 bg-blue-600 border-4 border-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-blue-700 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            Enter Neuro-Trainer
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 py-16 space-y-24">
        {/* Top-level Vital Signs */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] bg-amber-300">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 block mb-2">Student Name</span>
            <div className="text-4xl font-black tracking-tighter uppercase text-slate-900">
              {stats.studentProfile?.name || 'DEFAULT_STUDENT'}
            </div>
          </div>
          <div className="p-8 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] bg-blue-300">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 block mb-2">Avg Confidence</span>
            <div className="text-5xl font-black tracking-tighter uppercase tabular-nums text-slate-900">
              {stats.summary.avgStrength}%
            </div>
          </div>
          <div className="p-8 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] bg-rose-300">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 block mb-2">Total Reps</span>
            <div className="text-5xl font-black tracking-tighter uppercase tabular-nums text-slate-900">
              {stats.summary.totalReps}
            </div>
          </div>
        </section>

        {/* 01: Proficiency Heatmap */}
        <ProficiencyHeatmap data={stats.mastery} />

        {/* 02: Variant Bottlenecks */}
        <VariantAnalysis data={stats.mastery} />

        {/* 03: Assessment Audit Board */}
        <AssessmentReadinessMap masteryData={stats.mastery} examData={stats.examResults} />
      </main>
    </div>
  );
}
