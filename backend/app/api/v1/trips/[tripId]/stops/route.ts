import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function POST(req: Request, props: { params: Promise<{ tripId: string }> }) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const { tripId } = await props.params;
    const body = await req.json();

    const trip = await prisma.trip.findUnique({
      where: { id: tripId, userId: user.id }
    });
    if (!trip) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });
    }

    const currentStops = await prisma.tripStop.count({ where: { tripId } });

    const newStop = await prisma.tripStop.create({
      data: {
        tripId,
        city: body.city,
        country: body.country,
        latitude: body.lat,
        longitude: body.lng,
        order: currentStops
      }
    });

    return NextResponse.json(successResponse({ stop: newStop }));
  } catch (error) {
    console.error(error);
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to add stop', requestId), { status: 500 });
  }
}
