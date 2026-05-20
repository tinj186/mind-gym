"use server";
import { prisma } from "@/lib/db";
import { generateAIHint } from "@/lib/intelligence/ai"; 

// Gets the total count so we can set the progress bar max
export async function getMissingHintCount() {
  try {
    return await prisma.questionBank.count({
      where: {
        OR: [
          { hint: null },
          { hint: "" }
        ]
      }
    });
  } catch (error) {
    console.error("❌ [Hint Actions] Failed to count missing hints. Ensure 'npx prisma db push' was successful.", error.message);
    return 0;
  }
}

// Processes a specific number of questions
export async function processHintBatchAction(batchSize = 5) {
  const questions = await prisma.questionBank.findMany({
    where: { OR: [{ hint: null }, { hint: "" }] },
    take: batchSize,
    select: { id: true, question: true, solution: true }
  });

  if (questions.length === 0) return { count: 0 };

  // Process batch in parallel to prevent Next.js Server Action timeouts
  const results = await Promise.allSettled(
    questions.map(async (q) => {
      const prompt = `
        Context: Singapore Math Pedagogy (Primary 1).
        Mandate: Use LOWER_BLOCK reading levels (Sentences < 12 words, high-frequency words).
        Task: Create a conceptual "Spotter" hint for a 6-year-old. 
        Constraint: NEVER include the answer or numbers from the solution.
        Focus: Point to a visual counting strategy or a place-value clue.
        Question: ${q.question}
        Solution: ${q.solution}
      `;

      const hint = await generateAIHint(prompt);
      if (hint && hint.length > 0) {
        await prisma.questionBank.update({
          where: { id: q.id },
          data: { hint: hint.trim() }
        });
        return true;
      }
      throw new Error("Empty AI response");
    })
  );

  const successCount = results.filter(r => r.status === 'fulfilled').length;
  return { count: successCount };
}