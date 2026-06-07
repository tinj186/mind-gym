import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function AdminDashboard() {
  // Fetch live KPIs
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // 1. Workout Reps Today
  const totalRepsToday = await prisma.attemptLog.count({
    where: {
      createdAt: {
        gte: todayStart,
      },
    },
  });

  // 2. Active Athletes
  const activeAthletes = await prisma.studentProfile.count();

  // 3. Avg. Synapse Strength
  const masteryRecords = await prisma.studentMastery.aggregate({
    _avg: {
      synapseStrength: true,
    },
  });
  const avgSynapseStrength = masteryRecords._avg.synapseStrength
    ? `${Math.round(masteryRecords._avg.synapseStrength)}`
    : '0';

  // 4. Top Defect Code
  // Extracting top defect code by grouping
  const defectGroups = await prisma.attemptLog.groupBy({
    by: ['defectCode'],
    _count: {
      defectCode: true,
    },
    where: {
      defectCode: {
        not: null,
      },
    },
    orderBy: {
      _count: {
        defectCode: 'desc',
      },
    },
    take: 1,
  });
  
  const topDefectCode = defectGroups.length > 0 
    ? defectGroups[0].defectCode.replace(/_/g, ' ') 
    : 'None Tracked';

  const kpis = [
    { label: "Workout Reps Today", value: totalRepsToday.toString(), change: "Live" },
    { label: "Active Athletes", value: activeAthletes.toString(), change: "Live" },
    { label: "Avg. Synapse Strength", value: avgSynapseStrength, change: "Live" },
    { label: "Top Defect Code", value: topDefectCode, change: "Intervene" },
  ];

  // Fetch Pending Workout Content
  const pendingQuestions = await prisma.questionBank.findMany({
    where: {
      isApproved: false,
      isArchived: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Command Center</h2>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">Real-time Mind Gym Operations</p>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[140px]">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest break-words leading-tight">{kpi.label}</p>
            <div>
              <p className="text-3xl font-black text-slate-900 mt-2 truncate" title={kpi.value}>{kpi.value}</p>
              <p className={`text-xs font-bold mt-2 ${kpi.change === 'Intervene' ? 'text-rose-500' : 'text-blue-500'}`}>
                {kpi.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Question Approval Table */}
      <section className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-slate-900 uppercase tracking-tighter">Pending Workout Content</h3>
          <Link href="/admin/questions/review" className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors">
            VIEW ALL
          </Link>
        </div>
        
        {pendingQuestions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-bold text-sm">
            All equipment is prepped. No pending content!
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-white border-b border-slate-100">
              <tr>
                <th className="px-8 py-4">Topic</th>
                <th className="px-8 py-4">Level</th>
                <th className="px-8 py-4">Type</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-600 divide-y divide-slate-50">
              {pendingQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="truncate max-w-[200px] md:max-w-[300px]" title={q.topic}>
                      {q.topic}
                    </div>
                  </td>
                  <td className="px-8 py-4 font-mono text-slate-500">{q.level}</td>
                  <td className="px-8 py-4">
                    <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs">
                      {q.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <Link href={`/admin/questions/review`} className="text-blue-600 hover:text-blue-800 hover:underline">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}