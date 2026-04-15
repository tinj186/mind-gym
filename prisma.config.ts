import { defineConfig } from '@prisma/config'

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL is not set in environment.');
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || '',
  },
})