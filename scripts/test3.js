import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const allQs = await prisma.questionBank.findMany({
    where: { subtopic: 'Number Comparison and Ordering' }
  });
  
  let badCount = 0;
  for (const q of allQs) {
    if (q.solution.includes('\\n')) {
      badCount++;
      if (badCount === 1) {
        console.log("Example of bad solution:", q.solution);
      }
    }
  }
  
  console.log(`Total questions with literal '\\n': ${badCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
