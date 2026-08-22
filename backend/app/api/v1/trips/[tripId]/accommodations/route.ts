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

    const acc = await prisma.accommodation.create({
      data: {
        tripId,
        name: body.name,
        address: body.address,
        checkInDate: new Date(body.checkInDate),
        checkOutDate: new Date(body.checkOutDate),
        checkInTime: body.checkInTime,
        checkOutTime: body.checkOutTime,
        nights: body.nights,
        pricePerNight: body.pricePerNight,
        totalCost: body.totalCost || (body.pricePerNight * body.nights),
        currency: body.currency || trip.currency || 'USD',
        guests: body.guests || 1,
        bookingReference: body.bookingReference,
        notes: body.notes
      }
    });

    return NextResponse.json(successResponse({ accommodation: acc }));
  } catch (error: any) {
    return NextResponse.json(errorResponse('SERVER_ERROR', error.message, requestId), { status: 500 });
  }
}
