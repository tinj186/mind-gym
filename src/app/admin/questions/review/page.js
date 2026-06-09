import { prisma } from '@/lib/db';
import ReviewList from '@/components/admin/ReviewList';
import { SYLLABUS_DATA } from '@/lib/syllabus';
import { blueprintRegistry } from '@/lib/syllabus/index';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function QuestionReviewPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const { level, strand, topic, subtopic, type, difficulty, approved } = resolvedSearchParams;
  const isApprovedFilter = approved === 'true';

  // Keep the query mapping focus cleanly on approval status, allowing archived questions through for admin tracking
  const whereClause = { isApproved: isApprovedFilter };

  // Only apply metadata filters if they are provided in the URL (non-empty)
  if (level) whereClause.level = level;
  if (topic) whereClause.topic = topic;
  if (type) whereClause.type = type;
  if (difficulty) whereClause.difficulty = difficulty;
  if (subtopic) whereClause.subtopic = subtopic;
  if (strand) whereClause.strand = strand;

  const levelData = SYLLABUS_DATA[level] || [];
  const topicEntry = levelData.find(t => t.topic === topic);
  const blueprintData = topicEntry?.subtopics.find(s => s.name === subtopic);

  let questions = [];
  try {
    questions = await prisma.questionBank.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        attempts: {
          select: { isCorrect: true }
        }
      }
    });

    // Sanitize options to ensure they are always strings (prevents opt.includes crashes)
    questions = questions.map(q => {
      const attemptsCount = q.attempts?.length || 0;
      const correctCount = q.attempts?.filter(a => a.isCorrect).length || 0;
      const successRate = attemptsCount > 0 ? Math.round((correctCount / attemptsCount) * 100) : 0;
      
      let variantDescription = null;
      if (q.heuristic) {
        const blueprintId = `${q.level}-${q.topic}-${q.subtopic}`;
        const blueprint = blueprintRegistry[blueprintId];
        if (blueprint && blueprint.variants && blueprint.variants[q.heuristic]) {
          variantDescription = blueprint.variants[q.heuristic];
        }
      }

      const { attempts, ...rest } = q;
      return {
        ...rest,
        stats: { attemptsCount, successRate, variantDescription },
        options: Array.isArray(q.options) ? q.options.map(opt => String(opt ?? "")) : (q.type === 'MCQ' ? [] : null)
      };
    });
  } catch (err) {
    console.error("❌ Failed to fetch questions for review:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <div>
                <Link 
                  href={{
                    pathname: "/admin/questions",
                    query: { level, strand, topic, subtopic, type, difficulty }
                  }}
                  className="text-blue-600 font-bold text-sm uppercase tracking-widest hover:underline mb-2 block"
                >
                  ← Back to Inventory
                </Link>
                <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tighter">
                  {isApprovedFilter ? 'Approved Content' : 'Pending Review'}
                </h1>
                <p className="text-slate-400 font-medium">
                  {[level, topic, subtopic?.replace(/\s+to\s+\d+/, ''), type, difficulty].filter(Boolean).join(' • ')}
                </p>
              </div>
            </div>

            <ReviewList initialQuestions={questions} isViewOnly={isApprovedFilter} />
          </main>
        </div>
      </div>
    </div>
  );
}