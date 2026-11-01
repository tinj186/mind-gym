import { prisma } from '../src/lib/db.js';

async function main() {
  const q = await prisma.questionBank.findUnique({
    where: { id: '04115afc-584c-4b88-9a24-0817ceb220b6' }
  });
  console.log('--- QUESTION RECORD ---');
  console.log(JSON.stringify(q, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
