import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function StudentAnalytics() {
  // Aggregate unique student IDs from the attempt logs to show the "Fleet"
  const students = await prisma.attemptLog.groupBy({
    by: ['studentId'],
  });

  return (
    <div className="space-y-8">
      <header>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">STUDENT ANALYTICS</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
            Fleet Operations & Performance
          </p>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="px-8 py-5">Student Identifier</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-8 py-20 text-center text-slate-300 font-bold uppercase text-xs tracking-widest">
                  No student data found. Start training to see analytics.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.studentId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-900">{s.studentId}</td>
                  <td className="px-8 py-5 text-right">
                    <Link 
                      href={`/admin/students/${s.studentId}`} 
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-600 transition-all inline-block"
                    >
                      VIEW DEEP DIVE →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}