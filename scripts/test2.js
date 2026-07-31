import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const q = await prisma.questionBank.findFirst({
    where: { 
      subtopic: 'Number Comparison and Ordering',
      modelData: { not: null }
    }
  });
  
  if (q && q.modelData) {
    const stringified = JSON.stringify(q.modelData);
    console.log("modelData includes literal '\\n' ?", stringified.includes('\\\\n')); // Checking for literal backslash n in JSON string
    console.log("modelData stringified:", stringified.substring(0, 500));
  } else {
    console.log("No modelData found.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
