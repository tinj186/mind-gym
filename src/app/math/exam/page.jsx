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
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50 text-center">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-200">
          <div className="w-32 h-32 mx-auto mb-8 bg-slate-50 rounded-full flex items-center justify-center">
            {/* Friendly Empty Folder SVG */}
            <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Vault Preparation</h2>
          <p className="text-slate-500 font-medium">
            We&apos;re currently stocking the simulation vault for {profile.primaryLevel}. 
            Check back soon for new challenges!
          </p>
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