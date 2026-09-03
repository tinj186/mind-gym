import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  const q = await prisma.questionBank.findMany({
    where: { heuristic: 'foundation_repeated_addition', level: 'Primary 1' },
    select: { level: true, topic: true, heuristic: true }
  });
  console.log('With Primary 1 filter:', q);

  const q2 = await prisma.questionBank.findMany({
    where: { heuristic: 'foundation_repeated_addition' },
    select: { level: true, topic: true, heuristic: true }
  });
  console.log('Without filter:', q2);
}
test();
