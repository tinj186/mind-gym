import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Simple query to verify connection to the NAS DB
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'online' });
  } catch (error) {
    console.error("❌ Database health check failed:", error);
    return NextResponse.json({ 
      status: 'offline', 
      message: error.message 
    }, { status: 500 });
  }
}