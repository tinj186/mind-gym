import { prisma } from '../src/lib/db.js';

async function main() {
  const q = await prisma.questionBank.findUnique({
    where: { id: '9913cb88-b91d-4d0c-be34-3dbe75e0fc6a' }
  });
  console.log("Question found:", !!q);
  if (q) {
    console.log("ID:", q.id);
    console.log("Type:", q.type);
    console.log("ModelData type:", typeof q.modelData);
    console.log("ModelData:", JSON.stringify(q.modelData, null, 2));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
