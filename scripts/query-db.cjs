const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const q = await prisma.questionBank.findFirst({
    where: { topic: "Whole Numbers - Numbers up to 1000", subtopic: "Number Comparison and Ordering" },
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(q, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
