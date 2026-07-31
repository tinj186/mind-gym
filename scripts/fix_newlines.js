import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Starting DB update...");
  // In JS, '\\\\n' evaluates to '\\n' (backslash backslash n).
  // In Postgres, string literal '\\n' is interpreted as a literal backslash followed by 'n'.
  const query = `UPDATE "QuestionBank" SET solution = REPLACE(solution, '\\\\n', CHR(10)) WHERE solution LIKE '%\\\\n%';`;
  const result = await prisma.$executeRawUnsafe(query);
  console.log("Updated rows:", result);
}

main().catch(console.error).finally(() => prisma.$disconnect());
