import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const dbUrlLine = env.split('\n').find(l => l.startsWith('DATABASE_URL='));
const dbUrl = dbUrlLine.substring('DATABASE_URL='.length).trim().replace(/^"|"$/g, '');
process.env.DATABASE_URL = dbUrl;

const prisma = new PrismaClient();
async function main() {
  const result = await prisma.questionBank.updateMany({
    where: { 
      level: 'Primary 1',
      topic: 'Whole Numbers',
      subtopic: 'Place Value (Tens/Ones)'
    },
    data: {
      topic: 'Whole Numbers - Numbers up to 100',
      subtopic: 'Place Values (Tens, Ones)'
    }
  });
  console.log("UPDATE RESULT:", result);
}
main().finally(() => prisma.$disconnect());
