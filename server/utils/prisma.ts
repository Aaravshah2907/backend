import { PrismaClient } from '#prisma-client' // Use the alias defined in nitro.config
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

if (process.env.NODE_ENV === 'development') {
  neonConfig.webSocketConstructor = ws
}

/**
 * Exporting as 'prisma' allows Nitro to auto-import it 
 * globally across your server routes.
 */
export const prisma = (() => {
  const databaseUrl = process.env.DATABASE_URL
  
  // Build-time safety: prevent crashes if env is missing during bundling
  if (!databaseUrl) {
    return {} as PrismaClient
  }

  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaNeon(pool)
  
  return new PrismaClient({ adapter })
})()