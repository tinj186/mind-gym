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
    const questions = await prisma.questionBank.findMany({
      orderBy: { id: 'asc' }
    });

    const serializedData = JSON.stringify(questions);
    
    // Calculate approximate size in KB
    const sizeKB = Buffer.byteLength(serializedData, 'utf8') / 1024;

    await prisma.dataFortressBackup.upsert({
      where: { id: "master_backup" },
      update: {
        data: serializedData,
        count: questions.length,
        sizeKB: sizeKB
      },
      create: {
        id: "master_backup",
        data: serializedData,
        count: questions.length,
        sizeKB: sizeKB
      }
    });

    return { success: true, count: questions.length };
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