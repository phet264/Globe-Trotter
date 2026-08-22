import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { successResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function GET() {
  const requestId = generateRequestId();
  let dbStatus = 'unknown';

  try {
    // Attempt a lightweight database query to check connectivity
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    // We do not expose the actual database error to the client
    dbStatus = 'unavailable';
  }

  return NextResponse.json(
    successResponse({
      status: 'healthy',
      service: 'globetrotter-backend',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      requestId,
    })
  );
}
