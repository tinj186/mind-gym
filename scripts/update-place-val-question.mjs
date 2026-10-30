import { prisma } from '../src/lib/db.js';

async function main() {
  const qId = '04115afc-584c-4b88-9a24-0817ceb220b6';
  const q = await prisma.questionBank.findUnique({ where: { id: qId } });
  if (!q) {
    console.log('Question not found:', qId);
    return;
  }
  console.log('Current question modelData:', q.modelData);
  const updatedModelData = {
    ...(q.modelData || {}),
    inputRequirement: {
      inputType: 'STANDARD_TEXT',
      acceptedAnswers: ['3 tens 3 ones', '33', '3 tens and 3 ones', '33 ones', '3 ten 3 one']
    }
  };

  const updated = await prisma.questionBank.update({
    where: { id: qId },
    data: {
      modelData: updatedModelData
    }
  });

  console.log('Updated question modelData:', updated.modelData);
}

main().catch(console.error).finally(() => prisma.$disconnect());
