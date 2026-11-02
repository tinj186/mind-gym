import { prisma } from '../src/lib/db.js';

async function main() {
  const questions = await prisma.questionBank.findMany({
    where: {
      question: {
        contains: '36,800 takeout boxes'
      }
    }
  });
  for (const q of questions) {
    console.log("ID:", q.id);
    console.log("question:", q.question);
    console.log("entities:", JSON.stringify(q.modelData?.inputRequirement?.barBuilderConfig?.entities, null, 2));
    console.log("target:", JSON.stringify(q.modelData?.inputRequirement?.barBuilderConfig?.target, null, 2));
    console.log("barBuilderConfig keys:", Object.keys(q.modelData?.inputRequirement?.barBuilderConfig || {}));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
