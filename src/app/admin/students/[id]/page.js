import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function StudentDeepDive({ params }) {
  const { id } = await params;

  // Fetch Mastery data and Attempt history
  const [mastery, attempts] = await Promise.all([
    prisma.studentMastery.findMany({ where: { studentId: id } }),
    prisma.attemptLog.findMany({
      where: { studentId: id },
      include: { question: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <Link href="/admin/students" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
            ← Back to Fleet View
          </Link>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mt-2 uppercase">{id}</h2>
        </div>
      </header>

      {/* 1. Synapse Strength (Mastery Heatmap) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mastery.length === 0 && (
          <div className="col-span-full bg-slate-50 p-12 rounded-3xl border border-dashed border-slate-200 text-center">
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No Mastery Data Recorded</p>
          </div>
        )}
        {mastery.map((m) => (
          <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{m.topic}</span>
              <span className="text-xs font-bold text-blue-600">{m.synapseStrength}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all" 
                style={{ width: `${m.synapseStrength}%` }}
              />
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase">Total Reps: {m.totalReps}</p>
          </div>
        ))}
      </section>

      {/* 2. Recent Workouts (Defect Tracking) */}
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-black text-slate-900 uppercase tracking-tighter text-sm">Recent Defect Log</h3>
        </div>
        <table className="w-full text-left">
          <thead className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-white">
            <tr>
              <th className="px-8 py-5">Result</th>
              <th className="px-8 py-5">Question Preview</th>
              <th className="px-8 py-5">Defect Code</th>
              <th className="px-8 py-5">Time</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {attempts.length === 0 && (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center text-slate-300 font-bold uppercase text-xs tracking-widest">
                  No recent attempts logged.
                </td>
              </tr>
            )}
            {attempts.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50">
                <td className="px-8 py-5">
                  <span className={`font-black text-[10px] px-2 py-1 rounded ${log.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {log.isCorrect ? 'PASS' : 'FAIL'}
                  </span>
                </td>
                <td className="px-8 py-5 font-medium text-slate-600 truncate max-w-xs">
                  {log.question?.question || 'Deleted Question'}
                </td>
                <td className="px-8 py-5">
                  <code className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    {log.defectCode || '---'}
                  </code>
                </td>
                <td className="px-8 py-5 text-slate-400 font-mono text-xs">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}