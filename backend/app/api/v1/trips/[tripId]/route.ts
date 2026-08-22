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
        },
        accommodations: true,
        transportations: true,
        preparationItems: true,
        expenses: true
      }
    });
    
    if (!trip) return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });
    return NextResponse.json(successResponse({ trip: { ...trip, name: trip.title, stops: trip.tripStops } }));
  } catch (error) {
    console.error(error);
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to fetch trip', requestId), { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Promise<{ tripId: string }> }) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const { tripId } = await props.params;
    const data = await req.json();
    
    // Ensure the trip belongs to the user
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId, userId: user.id }
    });
    
    if (!existingTrip) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        ...(data.name && { title: data.name }), // map name to title
        ...(data.title && { title: data.title }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.budget !== undefined && { budget: data.budget }),
        ...(data.currency && { currency: data.currency })
      }
    });
    
    return NextResponse.json(successResponse({ trip: updatedTrip }));
  } catch (error) {
    console.error(error);
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to update trip', requestId), { status: 500 });
  }
}
