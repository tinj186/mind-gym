import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const allQs = await prisma.questionBank.findMany();
  
  let updatedCount = 0;
  for (const q of allQs) {
    if (q.solution && typeof q.solution === 'string' && q.solution.includes('\\n')) {
      const fixedSolution = q.solution.split('\\n').join('\n');
      await prisma.questionBank.update({
        where: { id: q.id },
        data: { solution: fixedSolution }
      });
      updatedCount++;
    }
  }
  
  console.log(`Successfully updated ${updatedCount} questions using Node.js replacement.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
