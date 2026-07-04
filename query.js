import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const dbUrlLine = env.split('\n').find(l => l.startsWith('DATABASE_URL='));
const dbUrl = dbUrlLine.substring('DATABASE_URL='.length).trim().replace(/^"|"$/g, '');
process.env.DATABASE_URL = dbUrl;

const prisma = new PrismaClient();
async function main() {
  const qs = await prisma.questionBank.findMany({
    where: { level: 'Primary 1' },
    select: { id: true, topic: true, subtopic: true }
  });
  const topics = {};
  qs.forEach(q => {
    const key = q.topic + ' | ' + q.subtopic;
    topics[key] = (topics[key] || 0) + 1;
  });
  console.log("P1 TOPICS IN DB:");
  console.log(topics);
}
main().finally(() => prisma.$disconnect());
