import { prisma } from '@/lib/db';
import QuestionRow from '@/components/admin/QuestionRow'; // This is correct, but ensure file is in src/components

export default async function QuestionBankManager() {
  // Fetch all questions, sorted by topic
  const questions = await prisma.questionBank.findMany({
    orderBy: { topic: 'asc' }
  });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">QUESTION BANK</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
            Inventory Quality Control
          </p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all">
          + ADD MANUAL PART
        </button>
      </header>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Topic / Level</th>
              <th className="px-8 py-5 w-1/3">Question Content</th>
              <th className="px-8 py-5">Correct Answer</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {questions.map((q) => (
              <QuestionRow key={q.id} question={q} />
            ))}
          </tbody>
        </table>
        
        {questions.length === 0 && (
          <div className="p-20 text-center text-slate-300 font-bold uppercase text-xs tracking-widest">
            Inventory Empty. Seed database to begin.
          </div>
        )}
      </div>
    </div>
  );
}