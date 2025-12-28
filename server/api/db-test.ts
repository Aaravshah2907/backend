// server/api/db-test.ts
export default defineEventHandler(async (event) => {
  try {
    // 1. Check if the prisma object exists (auto-imported from utils)
    if (!prisma || typeof prisma.$queryRaw !== 'function') {
      throw createError({
        statusCode: 500,
        statusMessage: 'Prisma client was not initialized correctly.',
      })
    }

    // 2. Perform a simple query to verify the connection
    // We use a raw query so this works even if you haven't run migrations yet.
    const startTime = Date.now();
    const result = await prisma.$queryRaw`SELECT NOW() as connection_time`;
    const duration = Date.now() - startTime;

    return {
      status: 'success',
      message: 'Database connection established.',
      data: result,
      latency: `${duration}ms`,
      environment: process.env.NODE_ENV,
    }
  } catch (error: any) {
    // 3. Detailed error logging for Cloudflare logs
    console.error('Database Connection Error:', error);

    return createError({
      statusCode: 500,
      statusMessage: 'Database connection failed.',
      data: {
        error: error.message,
        code: error.code, // Prisma error codes (e.g., P2002)
      },
    })
  }
})