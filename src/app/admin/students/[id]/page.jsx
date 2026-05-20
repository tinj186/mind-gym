import { getStudentStatsAction } from '@/app/actions/statsActions';
import StudentActionsHeader from '@/components/admin/StudentActionsHeader';

export default async function StudentNeuralDashboard({ params }) {
  // Next.js 15: params is a promise
  const { id } = await params;
  const stats = await getStudentStatsAction(id);

  return (
    <div className="p-12 space-y-12 bg-white min-h-screen text-slate-900">
      {/* Header: Vital Signs */}
      <header className="flex justify-between items-end border-b-8 border-slate-900 pb-8">
        <div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase">{stats.studentProfile?.name || 'Student_Debrief'}</h1>
          <p className="font-mono text-slate-500 uppercase tracking-widest text-xs mt-2">Neural_Signature // ID: {stats.studentProfile?.externalId || id}</p>
        </div>
        <div className="flex gap-12">
          <StatCard label="AVG SYNAPSE" value={`${stats.summary.avgStrength}%`} color="text-blue-600" />
          <StudentActionsHeader studentId={id} />
          <StatCard label="TOTAL REPS" value={stats.summary.totalReps} color="text-indigo-600" />
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        {/* Left Column: Mastery Heatmap */}
        <section className="col-span-8 space-y-8">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-900">
            <span className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-lg text-sm">01</span>
            NEURAL MAP (BY TOPIC)
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {stats.mastery.map((m) => (
              <div key={m.id} className="p-8 border-4 border-slate-900 rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] hover:translate-x-1 transition-transform">
                <div className="space-y-1">
                  <h3 className="font-black text-xl uppercase leading-none">{m.subtopic || 'General Practice'}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{m.topic}</p>
                </div>
                <div className="flex items-center gap-8 w-1/2">
                  <div className="flex-1 h-6 bg-slate-50 rounded-full overflow-hidden border-2 border-slate-900 p-1">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${ // Adjusted color thresholds
                        m.synapseStrength > 70 ? 'bg-green-500' : // GREEN (>70%): 'Standard Level Unlocked'
                        m.synapseStrength >= 40 ? 'bg-amber-500' : // AMBER (40-70%): 'Neural Pathway Forming'
                        'bg-rose-500' // RED (<40%): 'Bottleneck Detected'
                      }`}
                      style={{ width: `${m.synapseStrength}%` }}
                    />
                  </div>
                  <span className="font-black text-2xl w-16 text-right tabular-nums">{m.synapseStrength}%</span>
                </div>
              </div>
            ))}
            {stats.mastery.length === 0 && (
              <div className="p-12 border-4 border-dashed border-slate-300 rounded-[2rem] text-center text-slate-400 font-bold uppercase tracking-widest">
                No Synapse Data Recorded
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Alerts & Bottlenecks */}
        <section className="col-span-4 space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight underline decoration-rose-500 decoration-8 underline-offset-4 text-slate-900">BOTTLENECKS</h2>
            <div className="space-y-4">
              {stats.mastery.filter(m => m.synapseStrength < 40).map(b => (
                <div key={b.id} className="p-5 bg-rose-50 border-4 border-rose-200 rounded-[2rem] flex gap-4 items-center shadow-[8px_8px_0px_0px_rgba(244,63,94,0.2)] animate-pulse">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-black text-rose-900 text-sm uppercase leading-tight">{b.subtopic}</p>
                    <p className="text-[10px] font-bold text-rose-700 uppercase">Form failure detected. Suggest remedial reps.</p>
                  </div>
                </div>
              ))}
              {stats.mastery.filter(m => m.synapseStrength < 40).length === 0 && (
                <p className="text-slate-400 italic text-sm text-center py-12 border-2 border-slate-100 rounded-3xl">No critical bottlenecks found.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight">RECENT LOGS</h2>
            <div className="space-y-3 font-mono text-[10px] bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
              {stats.recentLogs.map(log => (
                <div key={log.id} className="flex justify-between items-center border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                  <span className={`font-black ${log.isCorrect ? 'text-green-600' : 'text-rose-600'}`}>
                    {log.isCorrect ? '✓ SUCCESS' : '✗ FAILED'}
                  </span>
                  <span className="text-slate-400">{new Date(log.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="text-right">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className={`text-5xl font-black tracking-tighter tabular-nums ${color}`}>{value}</p>
    </div>
  );
}