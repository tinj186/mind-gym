"use server";
import { prisma } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

const BACKUP_PATH = path.join(process.cwd(), "public", "backups", "questions_backup.json");

export async function getBackupStatusAction() {
  try {
    const stats = await fs.stat(BACKUP_PATH);
    const content = await fs.readFile(BACKUP_PATH, 'utf-8');
    const backupData = JSON.parse(content);
    const dbCount = await prisma.questionBank.count();

    return {
      exists: true,
      lastGenerated: stats.mtime,
      fileSize: (stats.size / 1024).toFixed(2) + " KB",
      backupCount: backupData.length,
      dbCount: dbCount
    };
  } catch (error) {
    const dbCount = await prisma.questionBank.count();
    return { exists: false, dbCount: dbCount, backupCount: 0 };
  }
}

export async function triggerJsonDumpAction() {
  try {
    const allQuestions = await prisma.questionBank.findMany();
    
    // Ensure backup directory exists
    await fs.mkdir(path.dirname(BACKUP_PATH), { recursive: true });
    
    // Write the file
    await fs.writeFile(BACKUP_PATH, JSON.stringify(allQuestions, null, 2));
    
    return { success: true, count: allQuestions.length };
  } catch (error) {
    console.error("Dump failed:", error);
    return { success: false, error: error.message };
  }
}

export async function restoreJsonBackupAction() {
  try {
    const content = await fs.readFile(BACKUP_PATH, 'utf-8');
    const backupData = JSON.parse(content);

    if (!backupData || !Array.isArray(backupData) || backupData.length === 0) {
      throw new Error("Backup file is empty or invalid.");
    }

    // "Suck" the data back in. 
    // We use skipDuplicates: true to prevent errors if some IDs already exist.
    const result = await prisma.questionBank.createMany({
      data: backupData,
      skipDuplicates: true,
    });

    return { success: true, count: result.count };
  } catch (error) {
    console.error("Restoration failed:", error);
    return { success: false, error: error.message };
  }
}