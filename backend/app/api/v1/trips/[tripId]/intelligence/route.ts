import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';
import { calculateTripCost, detectConflicts, calculateTripReadiness } from '@/lib/services/intelligence';

export async function GET(req: Request, props: { params: Promise<{ tripId: string }> }) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const { tripId } = await props.params;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId, userId: user.id },
      include: {
        itineraryDays: { include: { activities: true } },
        accommodations: true,
        transportations: true,
        preparationItems: true,
        expenses: true
      }
    });

    if (!trip) return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });

    const cost = calculateTripCost(trip);
    const conflicts = detectConflicts(trip);
    const readiness = calculateTripReadiness(trip);

    return NextResponse.json(successResponse({ cost, conflicts, readiness }));
  } catch (error: any) {
    return NextResponse.json(errorResponse('SERVER_ERROR', error.message || 'Failed to analyze trip', requestId), { status: 500 });
  }
}
