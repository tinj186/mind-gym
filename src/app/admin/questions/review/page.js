import { prisma } from '@/lib/db';
import ReviewList from '@/components/admin/ReviewList';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function QuestionReviewPage({ searchParams }) {
  const { level, topic, subtopic, type, difficulty, approved } = searchParams;
  const isApprovedFilter = approved === 'true';

  const whereClause = { isApproved: isApprovedFilter };

  // Only apply metadata filters if they are provided in the URL (non-empty)
  if (level) whereClause.level = level;
  if (topic) whereClause.topic = topic;
  if (type) whereClause.type = type;
  if (difficulty) whereClause.difficulty = difficulty;
  if (subtopic) whereClause.subtopic = subtopic;

  let questions = [];
  try {
    questions = await prisma.questionBank.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.error("❌ Failed to fetch questions for review:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin/questions" className="text-blue-600 font-bold text-sm uppercase tracking-widest hover:underline mb-2 block">
              ← Back to Inventory
            </Link>
            <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tighter">
              {isApprovedFilter ? 'Approved Content' : 'Pending Review'}
            </h1>
            <p className="text-slate-400 font-medium">{level} • {topic} • {type} • {difficulty}</p>
          </div>
        </div>

        <ReviewList initialQuestions={questions} isViewOnly={isApprovedFilter} />
      </div>
    </div>
  );
}