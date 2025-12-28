import { PrismaClient } from '../../generated/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Required for some environments to handle WebSockets correctly
if (process.env.NODE_ENV === 'development') {
  neonConfig.webSocketConstructor = ws
}

let prisma: PrismaClient

export const getPrisma = (databaseUrl: string) => {
  if (prisma) return prisma

  // 1. Create the Neon connection pool
  const pool = new Pool({ connectionString: databaseUrl })
  
  // 2. Setup the adapter
  const adapter = new PrismaNeon(pool)
  
  // 3. Initialize the client with the adapter
  prisma = new PrismaClient({ adapter })
  
  return prisma
}