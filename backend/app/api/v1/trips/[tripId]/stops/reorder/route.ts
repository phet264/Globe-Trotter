import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function PATCH(req: Request, props: { params: Promise<{ tripId: string }> }) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const { tripId } = await props.params;
    const { stopIds } = await req.json();

    if (!Array.isArray(stopIds)) {
      return NextResponse.json(errorResponse('BAD_REQUEST', 'stopIds must be an array', requestId), { status: 400 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId, userId: user.id }
    });
    if (!trip) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });
    }

    await prisma.$transaction(
      stopIds.map((id, index) => 
        prisma.tripStop.update({
          where: { id },
          data: { order: index }
        })
      )
    );

    const updatedStops = await prisma.tripStop.findMany({
      where: { tripId },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(successResponse({ stops: updatedStops }));
  } catch (error) {
    console.error(error);
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to reorder stops', requestId), { status: 500 });
  }
}
