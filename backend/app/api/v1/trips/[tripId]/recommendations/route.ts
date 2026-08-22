import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';
import { getRecommendations } from '@/lib/services/recommendation';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request, props: { params: Promise<{ tripId: string }> }) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const { tripId } = await props.params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId, userId: user.id }});
    if (!trip) return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });

    const recommendations = await getRecommendations(tripId);
    return NextResponse.json(successResponse({ recommendations }));
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(errorResponse('SERVER_ERROR', err.message || 'Failed to get recommendations', requestId), { status: 500 });
  }
}
