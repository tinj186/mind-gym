export default function AdminDashboard() {
  const kpis = [
    { label: "Total Reps Today", value: "1,240", change: "+12%" },
    { label: "Active Students", value: "85", change: "+5%" },
    { label: "Avg. Accuracy", value: "78%", change: "-2%" },
    { label: "Syllabus Coverage", value: "92%", change: "Stable" },
  ];

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">OPERATIONS OVERVIEW</h2>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">Real-time platform performance</p>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{kpi.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{kpi.value}</p>
            <p className={`text-xs font-bold mt-2 ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-slate-400'}`}>
              {kpi.change} vs last week
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder for Task/Syllabus Table */}
      <section className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-slate-900 uppercase tracking-tighter">Pending Question Approval</h3>
          <button className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-full">VIEW ALL</button>
        </div>
        
        <table className="w-full text-left">
          <thead className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-white">
            <tr>
              <th className="px-8 py-4">Topic</th>
              <th className="px-8 py-4">Level</th>
              <th className="px-8 py-4">Source</th>
              <th className="px-8 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold text-slate-600 divide-y divide-slate-50">
            <tr>
              <td className="px-8 py-4">Fractions (Advanced)</td>
              <td className="px-8 py-4 font-mono">P4</td>
              <td className="px-8 py-4">Gemini-Gen-01</td>
              <td className="px-8 py-4 text-right">
                <button className="text-blue-600 hover:underline">Review</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}