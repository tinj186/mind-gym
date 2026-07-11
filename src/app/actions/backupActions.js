"use server";
import { prisma } from "@/lib/db";

export async function getBackupStatusAction() {
  try {
    const backup = await prisma.dataFortressBackup.findUnique({
      where: { id: "master_backup" }
    });

    const dbCount = await prisma.questionBank.count();

    if (!backup) {
      return { exists: false, dbCount, backupCount: 0 };
    }

    return {
      exists: true,
      lastGenerated: backup.updatedAt,
      fileSize: backup.sizeKB.toFixed(2) + " KB",
      backupCount: backup.count,
      dbCount: dbCount
    };
  } catch (error) {
    const dbCount = await prisma.questionBank.count();
    return { exists: false, dbCount: dbCount, backupCount: 0 };
  }
}

export async function triggerJsonDumpAction() {
  try {
    const result = await prisma.$executeRaw`
      INSERT INTO "DataFortressBackup" (id, data, count, "sizeKB", "updatedAt")
      SELECT 
        'master_backup',
        json_agg(row_to_json(t))::jsonb,
        COUNT(*)::int,
        (LENGTH(json_agg(row_to_json(t))::text) / 1024.0),
        NOW()
      FROM "QuestionBank" t
      ON CONFLICT (id) DO UPDATE SET 
        data = EXCLUDED.data,
        count = EXCLUDED.count,
        "sizeKB" = EXCLUDED."sizeKB",
        "updatedAt" = EXCLUDED."updatedAt"
      RETURNING count;
    `;

    // Fetch the count to return it, since executeRaw might just return the number of affected rows
    const backup = await prisma.dataFortressBackup.findUnique({
      where: { id: 'master_backup' },
      select: { count: true }
    });

    return { success: true, count: backup?.count || 0 };
  } catch (error) {
    console.error("Dump failed:", error);
    return { success: false, error: error.message };
  }
}

export async function restoreJsonBackupAction() {
  try {
    const backup = await prisma.dataFortressBackup.findUnique({
      where: { id: "master_backup" }
    });

    if (!backup) {
      throw new Error("No backup found in database.");
    }

    const questions = JSON.parse(backup.data);

    // Batch insert to avoid hitting transaction limits if it gets huge
    const BATCH_SIZE = 500;
    let totalRestored = 0;

    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
      const batch = questions.slice(i, i + BATCH_SIZE);
      const result = await prisma.questionBank.createMany({
        data: batch,
        skipDuplicates: true,
      });
      totalRestored += result.count;
    }

    return { success: true, count: totalRestored };
  } catch (error) {
    console.error("Restoration failed:", error);
    return { success: false, error: error.message };
  }
}