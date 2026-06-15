import Link from 'next/link';
import { getStudentStatsAction } from '@/app/actions/statsActions';
import ProficiencyHeatmap from '@/components/parent/math/ProficiencyHeatmap';
import VariantAnalysis from '@/components/parent/math/VariantAnalysis';
import AssessmentReadinessMap from '@/components/parent/math/AssessmentReadinessMap';
import { getCurrentStudentId } from '@/lib/auth-utils';

export default async function MathAnalyticsDashboard() {
  const studentId = await getCurrentStudentId() || "default-student";
  const stats = await getStudentStatsAction(studentId);

  return (
    <div className="min-h-screen bg-indigo-50/50">
      <header className="px-6 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest px-3 py-1 rounded-full border bg-violet-50 border-violet-200 mb-4 inline-block">Analytics Engine</span>
            <div className="flex items-center gap-6">
              <h1 className="text-4xl font-black text-indigo-950 tracking-tight uppercase">Mathematics Analytics</h1>
              <Link 
                href="/parent/math/help" 
                className="px-6 py-2 bg-indigo-100 text-indigo-900 font-bold rounded-xl hover:bg-indigo-200 transition-colors text-sm"
              >
                Analytics Guide
              </Link>
            </div>
          </div>
        </div>

        {/* Top-level Vital Signs */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-[2.5rem] border shadow-sm bg-white border-indigo-100 flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900/60 block mb-2">Student Name</span>
            <div className="text-3xl font-black text-indigo-950">
              {stats.studentProfile?.name || 'DEFAULT_STUDENT'}
            </div>
          </div>
          <div className="p-8 rounded-[2.5rem] border shadow-sm bg-white border-indigo-100 flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900/60 block mb-2">Avg Confidence</span>
            <div className="text-5xl font-black text-violet-600">
              {stats.summary.avgStrength}%
            </div>
          </div>
          <div className="p-8 rounded-[2.5rem] border shadow-sm bg-white border-indigo-100 flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900/60 block mb-2">Total Reps</span>
            <div className="text-5xl font-black text-indigo-950">
              {stats.summary.totalReps}
            </div>
          </div>
        </section>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-16 space-y-24">

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
