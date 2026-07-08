import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database migration...");
  
  // 1. Update Prisma Database
  const result = await prisma.questionBank.updateMany({
    where: {
      level: 'Primary 1',
      topic: 'Whole Numbers',
      subtopic: 'Addition and Subtraction'
    },
    data: {
      topic: 'Whole Numbers - Addition and Subtraction',
      subtopic: 'Addition/Subtraction Within 100'
    }
  });
  console.log(`Updated ${result.count} questions in Prisma database.`);

  // 2. Update JSON Backup
  const backupPath = path.join(process.cwd(), 'public/backups/questions_backup.json');
  if (fs.existsSync(backupPath)) {
    console.log("Updating backup JSON...");
    let data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    let updatedCount = 0;
    
    data = data.map(q => {
      if (q.level === 'Primary 1' && q.topic === 'Whole Numbers' && q.subtopic === 'Addition and Subtraction') {
        q.topic = 'Whole Numbers - Addition and Subtraction';
        q.subtopic = 'Addition/Subtraction Within 100';
        updatedCount++;
      }
      return q;
    });
    
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
    console.log(`Updated ${updatedCount} questions in questions_backup.json.`);
  }

  console.log("Migration complete.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
