import { PrismaClient } from '~~/prisma-client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Required for local development with Neon
if (process.env.NODE_ENV === 'development') {
  neonConfig.webSocketConstructor = ws
}

/**
 * We export a single 'prisma' instance. 
 * Nitro's auto-import will detect this 'export const prisma' 
 * and fix the [unimport] error you saw in the build logs.
 */
export const prisma = (() => {
  // Cloudflare Workers provide env vars on the process.env object 
  // or via the event context. For Nitro, process.env is standard.
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // During build time, DATABASE_URL might be empty. 
    // We return a proxy or null to prevent the build from crashing.
    return {} as PrismaClient;
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  
  return new PrismaClient({ adapter });
})();