import { prisma } from '@/lib/db';
import ReviewList from '@/components/admin/ReviewList';
import { SYLLABUS_DATA } from '@/lib/syllabus';
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
      orderBy: { createdAt: 'desc' }
    });

    // Sanitize options to ensure they are always strings (prevents opt.includes crashes)
    questions = questions.map(q => ({
      ...q,
      options: Array.isArray(q.options) ? q.options.map(opt => String(opt ?? "")) : (q.type === 'MCQ' ? [] : null)
    }));
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

          {blueprintData && (
            <aside className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm sticky top-8 space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">
                  Pedagogical Blueprint
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Mandatory Phrasing</p>
                    <div className="space-y-2">
                      {blueprintData.blueprint.split(/(?<=[.!?])\s+/).map((sentence, idx) => (
                        <p 
                          key={idx} 
                          className={`text-sm font-bold text-slate-700 leading-snug italic border-l-4 pl-3 py-2 pr-2 rounded-r-xl transition-colors ${
                            idx % 2 === 0 
                              ? 'bg-blue-50/50 border-blue-200' 
                              : 'bg-slate-50/50 border-slate-200'
                          }`}
                        >
                          {sentence}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Required Vocabulary</p>
                    <div className="flex flex-wrap gap-1">
                      {blueprintData.vocabulary.map(v => (
                        <span key={v} className="px-2 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-[9px] font-black uppercase rounded-lg">{v}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}