import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const q = await prisma.questionBank.findFirst({
    where: { subtopic: 'Number Comparison and Ordering' }
  });
  console.log("Solution field:", q.solution);
  console.log("Includes literal '\\n' ?", q.solution.includes('\\n'));
  console.log("Includes actual newline ?", q.solution.includes('\n'));
}

main().catch(console.error).finally(() => prisma.$disconnect());
