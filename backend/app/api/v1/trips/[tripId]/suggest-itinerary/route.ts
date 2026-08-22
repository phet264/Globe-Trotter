import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';
import { generateSuggestedItinerary } from '@/lib/services/recommendation';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: Request, props: { params: Promise<{ tripId: string }> }) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const { tripId } = await props.params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId, userId: user.id }});
    if (!trip) return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });

    await generateSuggestedItinerary(tripId);
    
    return NextResponse.json(successResponse({ success: true }));
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(errorResponse('SERVER_ERROR', err.message || 'Failed to suggest itinerary', requestId), { status: 500 });
  }
}
