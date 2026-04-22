import { prisma } from '../src/lib/db.js';

async function main() {
  console.log('--- 🏋️ Seeding Math Mind Gym: Phase 2.3 Aligned ---');

  const questions = [
    {
      id: 'seed-q1',
      subject: "Math",
      level: "Primary 4",
      gradeLevel: "P4",
      heuristic: "REPEATED_IDENTITY",
      topic: "REPEATED_IDENTITY", 
      subtopic: "Whole Numbers",
      type: "Structured",
      difficulty: "Medium",
      question: "Ali and Ben have $150. Ali has twice as much money as Ben. How much money does Ali have?",
      solution: "3 units = 150. 1 unit = 50. Ali (2 units) = 100.",
      finalAnswer: "100",
      isApproved: true
    },
    {
      id: 'seed-q2',
      subject: "Math",
      level: "Primary 4",
      gradeLevel: "P4",
      heuristic: "PART_WHOLE",
      topic: "Fractions",
      subtopic: "Mixed Numbers",
      type: "Short",
      difficulty: "Easy",
      question: "Express 13/4 as a mixed number.",
      solution: "3 1/4",
      finalAnswer: "3 1/4",
      isApproved: true
    }
  ];

  for (const q of questions) {
    try {
      console.log(`Upserting question: ${q.id}`);
      await prisma.questionBank.upsert({
        where: { id: q.id },
        update: q,
        create: q,
      });
    } catch (error) {
      console.error(`❌ Failed to upsert ${q.id}:`, error.message);
    }
  }

  console.log(`✅ Successfully seeded ${questions.length} questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });