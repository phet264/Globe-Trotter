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

    const trip = await prisma.trip.findUnique({ where: { id: tripId, userId: user.id } });
    if (!trip) return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });

    const trans = await prisma.transportation.create({
      data: {
        tripId,
        type: body.type,
        provider: body.provider,
        departureLocation: body.departureLocation,
        arrivalLocation: body.arrivalLocation,
        departureDate: new Date(body.departureDate),
        departureTime: body.departureTime,
        arrivalDate: new Date(body.arrivalDate),
        arrivalTime: body.arrivalTime,
        cost: body.cost,
        currency: body.currency || trip.currency || 'USD',
        bookingReference: body.bookingReference,
        notes: body.notes
      }
    });

    return NextResponse.json(successResponse({ transportation: trans }));
  } catch (error: any) {
    return NextResponse.json(errorResponse('SERVER_ERROR', error.message, requestId), { status: 500 });
  }
}
