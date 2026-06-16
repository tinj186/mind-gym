import { prisma } from '@/lib/db';
import QuestionFilter from '@/components/admin/QuestionFilter';
import QuestionTable from '@/components/admin/QuestionTable';
import Link from 'next/link';
import { SYLLABUS_DATA, getSyllabusRows, DEFAULT_TYPES, DEFAULT_DIFFICULTIES, GET_DISTINCT } from '@/lib/syllabus';

export const dynamic = 'force-dynamic'; // Ensure this page is always dynamic

export default async function AdminQuestionsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const { level, topic, subtopic, type, difficulty } = resolvedSearchParams;

  let questions = [];
  let error = null;
  let groupedSummary = [];

  try {
    // Fetch question metadata once to calculate inventory coverage
    const allFiltered = await prisma.questionBank.findMany({
      select: {
        level: true, topic: true, subtopic: true, type: true, difficulty: true, isApproved: true
      }
    });

    // Generate rows for every syllabus combination, filtered by current UI selection
    const baseSyllabusRows = getSyllabusRows().filter(item => {
      if (level && item.level !== level) return false;
      if (topic && item.topic !== topic) return false;
      if (type && item.type !== type) return false;
      if (subtopic && item.subtopic !== subtopic) return false;
      return true;
    });

    const expandedRows = [];
    const difficultiesToProcess = difficulty ? [difficulty] : DEFAULT_DIFFICULTIES;

    baseSyllabusRows.forEach(s => {
      difficultiesToProcess.forEach(d => {
        const matches = allFiltered.filter(q => 
          q.level === s.level && 
          q.topic === s.topic && 
          q.type === s.type &&
          (q.subtopic === s.subtopic || (!q.subtopic && s.subtopic === "")) &&
          q.difficulty === d
        );

        const pending = matches.filter(m => !m.isApproved).length;
        const approved = matches.filter(m => m.isApproved).length;
        
        expandedRows.push({
          ...s,
          difficulty: d,
          pending,
          approved,
          needsGeneration: (pending + approved) === 0
        });
      });
    });
    groupedSummary = expandedRows;

  } catch (err) {
    console.error("❌ Failed to fetch questions:", err);
    error = "Failed to load questions. Please try again.";
  }

  // Use the Syllabus constants for filters instead of DB values
  const distinctLevels = GET_DISTINCT('level');
  const distinctTopics = GET_DISTINCT('topic', { level, type }); 
  const distinctSubtopics = GET_DISTINCT('subtopic', { level, topic, type }); 
  const distinctTypes = GET_DISTINCT('type', { level, topic, subtopic });
  const distinctDifficulties = DEFAULT_DIFFICULTIES;

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-white">Question Bank Admin</h1>
        </div>

        <div className="bg-slate-700 rounded-3xl shadow-sm p-8 mb-8 border border-slate-600">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Filters</h2>
            {(level || topic || subtopic || type || difficulty) && (
              <Link href="/admin/questions" className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1">
                ✕ Reset Defaults
              </Link>
            )}
          </div>
          <QuestionFilter
            levels={distinctLevels}
            topics={distinctTopics}
            subtopics={distinctSubtopics}
            types={distinctTypes}
            difficulties={distinctDifficulties}
            currentFilters={{ level, topic, subtopic, type, difficulty }}
          />
        </div>

        <div className="bg-slate-700 rounded-3xl shadow-sm p-8 border border-slate-600">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Question Inventory</h2>
          </div>
          {error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <QuestionTable data={groupedSummary} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}