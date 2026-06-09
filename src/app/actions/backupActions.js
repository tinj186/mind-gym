"use server";
import { prisma } from "@/lib/db";
import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import readline from "readline";

const BACKUP_PATH = path.join(process.cwd(), "public", "backups", "questions_backup.jsonl.gz");
const META_PATH = path.join(process.cwd(), "public", "backups", "questions_backup.meta.json");

export async function getBackupStatusAction() {
  try {
    const stats = await fsPromises.stat(BACKUP_PATH);
    const metaContent = await fsPromises.readFile(META_PATH, 'utf-8');
    const metaData = JSON.parse(metaContent);
    const dbCount = await prisma.questionBank.count();

    return {
      exists: true,
      lastGenerated: stats.mtime,
      fileSize: (stats.size / 1024).toFixed(2) + " KB",
      backupCount: metaData.count || 0,
      dbCount: dbCount
    };
  } catch (error) {
    const dbCount = await prisma.questionBank.count();
    return { exists: false, dbCount: dbCount, backupCount: 0 };
  }
}

export async function triggerJsonDumpAction() {
  try {
    await fsPromises.mkdir(path.dirname(BACKUP_PATH), { recursive: true });
    
    let totalExported = 0;
    const BATCH_SIZE = 1000;
    
    const writeStream = fs.createWriteStream(BACKUP_PATH);
    const gzip = zlib.createGzip();
    gzip.pipe(writeStream);

    let cursor = null;
    let hasMore = true;

    while (hasMore) {
      const batch = await prisma.questionBank.findMany({
        take: BATCH_SIZE,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: 'asc' }
      });

      if (batch.length === 0) {
        hasMore = false;
        break;
      }

      for (const record of batch) {
        gzip.write(JSON.stringify(record) + '\n');
        totalExported++;
      }

      cursor = batch[batch.length - 1].id;
    }

    // Await stream completion properly
    await new Promise((resolve, reject) => {
      gzip.end();
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      gzip.on('error', reject);
    });

    await fsPromises.writeFile(META_PATH, JSON.stringify({ count: totalExported }));
    
    return { success: true, count: totalExported };
  } catch (error) {
    console.error("Dump failed:", error);
    return { success: false, error: error.message };
  }
}

export async function restoreJsonBackupAction() {
  try {
    const readStream = fs.createReadStream(BACKUP_PATH);
    const gunzip = zlib.createGunzip();
    
    // We pipe the read stream to gunzip, then to readline
    readStream.pipe(gunzip);

    const rl = readline.createInterface({
      input: gunzip,
      crlfDelay: Infinity
    });

    let buffer = [];
    let totalRestored = 0;
    const BATCH_SIZE = 500;

    for await (const line of rl) {
      if (!line.trim()) continue;
      buffer.push(JSON.parse(line));

      if (buffer.length >= BATCH_SIZE) {
        const result = await prisma.questionBank.createMany({
          data: buffer,
          skipDuplicates: true,
        });
        totalRestored += result.count;
        buffer = [];
      }
    }

    // Flush any remaining
    if (buffer.length > 0) {
      const result = await prisma.questionBank.createMany({
        data: buffer,
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