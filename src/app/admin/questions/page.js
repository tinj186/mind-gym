import { prisma } from '@/lib/db';
import QuestionFilter from '@/components/admin/QuestionFilter';
import QuestionTable from '@/components/admin/QuestionTable';
import { SYLLABUS_DATA, getSyllabusRows, DEFAULT_TYPES, DEFAULT_DIFFICULTIES, GET_DISTINCT } from '@/lib/syllabus';

export const dynamic = 'force-dynamic'; // Ensure this page is always dynamic

export default async function AdminQuestionsPage({ searchParams }) {
  const { level, topic, subtopic, type, difficulty } = searchParams;

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
    groupedSummary = getSyllabusRows().filter(item => {
      if (level && item.level !== level) return false;
      if (topic && item.topic !== topic) return false;
      if (type && item.type !== type) return false;
      return true;
    }).map(s => {
      // Count questions matching this specific syllabus row and difficulty filter
      const matches = allFiltered.filter(q => 
        q.level === s.level && 
        q.topic === s.topic && 
        q.type === s.type &&
        (!difficulty || q.difficulty === difficulty) &&
        (!subtopic || q.subtopic === subtopic)
      );

      const pending = matches.filter(m => !m.isApproved).length;
      const approved = matches.filter(m => m.isApproved).length;
      
      return {
        ...s,
        subtopic: subtopic || "", // Pass specific subtopic filter if active
        difficulty: difficulty || "Medium",
        pending,
        approved,
        needsGeneration: (pending + approved) === 0
      };
    });

  } catch (err) {
    console.error("❌ Failed to fetch questions:", err);
    error = "Failed to load questions. Please try again.";
  }

  // Use the Syllabus constants for filters instead of DB values
  const distinctLevels = GET_DISTINCT('level');
  const distinctTopics = GET_DISTINCT('topic');
  const distinctSubtopics = GET_DISTINCT('subtopic');
  const distinctTypes = DEFAULT_TYPES;
  const distinctDifficulties = DEFAULT_DIFFICULTIES;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900">Question Bank Admin</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Filters</h2>
          <QuestionFilter
            levels={distinctLevels}
            topics={distinctTopics}
            subtopics={distinctSubtopics}
            types={distinctTypes}
            difficulties={distinctDifficulties}
            currentFilters={{ level, topic, subtopic, type, difficulty }}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Question Inventory</h2>
          </div>
          {error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <QuestionTable data={groupedSummary} />
          )}
        </div>
      </div>
    </div>
  );
}