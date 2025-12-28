// server/utils/prisma.ts
import { PrismaClient } from '../generated/client' // Direct path
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

if (process.env.NODE_ENV === 'development') {
  neonConfig.webSocketConstructor = ws
}

export const prisma = (() => {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return {} as PrismaClient

  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter })
})()