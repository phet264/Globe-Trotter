import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function POST(req: Request, props: { params: Promise<{ tripId: string; dayId: string }> }) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const { tripId, dayId } = await props.params;
    
    // Auth check: user owns trip
    const trip = await prisma.trip.findUnique({ where: { id: tripId, userId: user.id } });
    if (!trip) return NextResponse.json(errorResponse('FORBIDDEN', 'Access denied', requestId), { status: 403 });

    const body = await req.json();
    
    const activity = await prisma.activity.create({
      data: {
        itineraryDayId: dayId,
        title: body.title,
        description: body.description,
        location: body.location,
        category: body.category,
        estimatedCost: body.estimatedCost,
        currency: body.currency,
        imageUrl: body.imageUrl,
        order: body.order || 99,
        startTime: body.startTime ? new Date(`1970-01-01T${body.startTime}:00Z`) : null,
        endTime: body.endTime ? new Date(`1970-01-01T${body.endTime}:00Z`) : null,
      }
    });

    return NextResponse.json(successResponse({ activity }));
  } catch (error) {
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to add activity', requestId), { status: 500 });
  }
}
