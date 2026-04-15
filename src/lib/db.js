import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1. Prevent multiple instances of Prisma Client in development 
// by saving it to the global object.
const globalForPrisma = global;

// Initialize the Postgres Pool
const pool = globalForPrisma.pool || new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Recommended for Synology NAS to prevent memory spikes
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool;

// Initialize the Driver Adapter
const adapter = globalForPrisma.adapter || new PrismaPg(pool);
if (process.env.NODE_ENV !== 'production') globalForPrisma.adapter = adapter;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' 
      ? ['error', 'warn'] // Reduced 'query' logging to keep Synology logs readable
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;