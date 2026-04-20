import { db } from './src/lib/db.js';

async function proveLife() {
  console.log("🧪 Starting Database Proof of Life (using 'Question' model)...");
  try {
    // 1. Clean up
    await db.question.deleteMany({ where: { text: 'Sanity Check' } });

    // 2. Attempt to Write
    const newQuestion = await db.question.create({
      data: {
        text: 'Sanity Check',
        answer: '20'
      }
    });
    console.log("✅ WRITE SUCCESS: ID:", newQuestion.id);

    // 3. Attempt to Read
    const saved = await db.question.findUnique({ where: { id: newQuestion.id } });
    
    if (saved) {
      console.log("✅ READ SUCCESS: Retreived:", saved.text);
      console.log("\n🎊 INFRASTRUCTURE VERIFIED!");
    }
  } catch (err) {
    console.error("❌ PROOF FAILED!");
    console.error("Error Detail:", err.message);
  } finally {
    await db.$disconnect();
  }
}

proveLife();