import { prisma } from '@/lib/db';

export default async function AdminMatrix() {
  const questions = await prisma.questionBank.findMany({
    orderBy: { topic: 'asc' }
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Syllabus Coverage Matrix</h1>
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
            Total Questions: {questions.length}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Topic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Subtopic</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Difficulty</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {questions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{q.topic}</td>
                  <td className="px-6 py-4 text-slate-600">{q.subtopic || 'General'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      q.difficulty === 'Hard' ? 'bg-red-50 text-red-700' : 
                      q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-500">{q.type}</td>
                  <td className="px-6 py-4 text-center">
                    {q.isApproved ? (
                      <span className="text-green-600 font-medium">✅ Vetted</span>
                    ) : (
                      <span className="text-slate-400 italic">🛠 Draft</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}