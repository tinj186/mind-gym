import { prisma } from '@/lib/db';
import ArenaSession from './ArenaSession';
import { redirect } from 'next/navigation';
import { getCurrentStudentId } from '@/lib/auth-utils';

export default async function MockExamPage() {
  const studentId = await getCurrentStudentId() || "default-student";

  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentId }
  });

  if (!profile?.primaryLevel) {
    redirect('/math');
  }

  // Fetch random exam questions across the entire vault natively at the database level,
  // strictly excluding any questions the student has already seen.
  const rawQuestions = await prisma.$queryRaw`
    SELECT * FROM "QuestionBank" 
    WHERE level = ${profile.primaryLevel} 
    AND id NOT IN (
      SELECT DISTINCT "questionId" 
      FROM "AttemptLog" 
      WHERE "studentId" = ${studentId}
    )
    ORDER BY RANDOM() 
    LIMIT 150
  `;

  // Normalize question data (parsing options and modelData)
  const formattedQuestions = rawQuestions.map(q => ({
    ...q,
    options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
    modelData: typeof q.modelData === 'string' ? JSON.parse(q.modelData) : q.modelData
  }));

  // Structural grouping matching MOE Paper Booklet sections
  const examPaper = {
    mcq: formattedQuestions.filter(q => q.type?.toUpperCase().includes('MCQ')).slice(0, 15),
    short: formattedQuestions.filter(q => q.type?.toUpperCase().includes('SHORT')).slice(0, 10),
    structured: formattedQuestions.filter(q => q.type?.toUpperCase().includes('STRUCTURED') || q.type?.toUpperCase().includes('LONG')).slice(0, 5)
  };

  const totalQuestionsCount = examPaper.mcq.length + examPaper.short.length + examPaper.structured.length;

  if (totalQuestionsCount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-white text-center">
        <div className="max-w-md border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase">Simulation Vault Empty</h2>
          <p className="text-slate-500 font-bold mt-2">No standardized test items have been seeded for {profile.primaryLevel} yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12">
      <ArenaSession 
        studentId={studentId}
        level={profile.primaryLevel}
        examPaper={examPaper}
        durationMinutes={60} // MOE Standard Booklet time boundary
      />
    </div>
  );
}