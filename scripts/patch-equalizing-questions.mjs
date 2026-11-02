import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const ids = [
    '292a6a4d-b528-4eb2-8af7-cb70caeb1789',
    '7e94ed41-1c09-4280-93ef-e22af0ab09c4',
    '5fa0436c-025a-47c3-9059-881b8fdb951a'
  ];

  for (const id of ids) {
    const q = await prisma.questionBank.findUnique({ where: { id } });
    if (!q) {
      console.log(`Question ${id} not found.`);
      continue;
    }

    const modelData = typeof q.modelData === 'string' ? JSON.parse(q.modelData) : q.modelData;
    const config = modelData?.inputRequirement?.barBuilderConfig;
    if (!config) {
      console.log(`Question ${id} has no barBuilderConfig.`);
      continue;
    }

    console.log(`Updating ${id}:`);
    console.log('Old entities:', JSON.stringify(config.entities));

    const updatedEntities = (config.entities || []).map(ent => {
      if (ent.relation === 'MORE' || ent.relation === 'FEWER' || ent.diffValue !== undefined) {
        return {
          ...ent,
          value: ent.value === undefined ? '?' : ent.value,
          diffValue: '?',
          displayDiff: '?',
          actualDiff: ent.actualDiff || ent.diffValue || config.differenceValue
        };
      }
      return {
        ...ent,
        value: '?',
        displayValue: '?'
      };
    });

    config.entities = updatedEntities;
    console.log('New entities:', JSON.stringify(config.entities));

    await prisma.questionBank.update({
      where: { id },
      data: {
        modelData: modelData
      }
    });

    console.log(`Successfully updated ${id}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

