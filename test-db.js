const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: "postgresql://postgres:postgres@localhost:54322/postgres" } }
});
async function run() {
  const q = await prisma.questionBank.findMany({ take: 3, select: { id: true, level: true, topic: true, heuristic: true } });
  console.log(q);
}
run();
