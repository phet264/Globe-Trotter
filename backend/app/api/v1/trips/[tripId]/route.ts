import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function GET(req: Request, props: { params: Promise<{ tripId: string }> }) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const { tripId } = await props.params;
    
    const trip = await prisma.trip.findUnique({
      where: { id: tripId, userId: user.id },
      include: {
        tripStops: {
          orderBy: { order: 'asc' },
          include: {
            activities: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });
    
    if (!trip) return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });
    return NextResponse.json(successResponse({ trip }));
  } catch {
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to fetch trip', requestId), { status: 500 });
  }
}
