import { defineConfig } from '@prisma/config'

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL is not set in environment.');
}

export default defineConfig({
  migrations: {
    seed: 'node ./prisma/seed.js',
  },
  datasource: {
    url: process.env.DATABASE_URL || '',
  },
})