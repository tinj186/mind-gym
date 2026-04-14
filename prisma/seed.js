import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- 🏋️ Seeding Math Mind Gym: P4 Syllabus ---');

  const questions = [
    {
      subject: "Math",
      level: "Primary 4",
      topic: "Fractions",
      subtopic: "Mixed Numbers & Improper Fractions",
      type: "SAQ",
      difficulty: "Medium",
      question: "Express 13/4 as a mixed number in its simplest form.",
      solution: "13 ÷ 4 = 3 remainder 1. Therefore, 13/4 = 3 1/4.",
      finalAnswer: "3 1/4",
      isApproved: true
    },
    // ... add your other questions here
  ];

  for (const q of questions) {
    // We use a specific ID or find by question text to prevent duplicates
    await prisma.questionBank.upsert({
      where: { id: 'seed-q1' }, // You can generate specific IDs for your seeds
      update: {},
      create: {
        ...q,
        id: 'seed-q1' 
      },
    });
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