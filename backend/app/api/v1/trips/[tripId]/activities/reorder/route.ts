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
    const { activityIds } = await req.json();

    if (!Array.isArray(activityIds)) {
      return NextResponse.json(errorResponse('BAD_REQUEST', 'activityIds must be an array', requestId), { status: 400 });
    }

    // Verify trip belongs to user
    const trip = await prisma.trip.findUnique({
      where: { id: tripId, userId: user.id }
    });
    if (!trip) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });
    }

    // Update orders in a transaction
    await prisma.$transaction(
      activityIds.map((id, index) => 
        prisma.activity.update({
          where: { id },
          data: { order: index }
        })
      )
    );

    // Fetch updated activities to return
    const activities = await prisma.activity.findMany({
      where: { id: { in: activityIds } },
      include: { tripStop: true }
    });

    const formattedActivities = activities.map(a => ({
      id: a.id,
      tripId: a.tripStop.tripId,
      stopId: a.tripStopId,
      day: 1,
      date: a.date?.toISOString().split('T')[0] || a.tripStop.startDate?.toISOString().split('T')[0] || '',
      time: a.startTime ? a.startTime.toISOString().split('T')[1].substring(0, 5) : '00:00',
      title: a.title || 'Untitled',
      description: a.description || undefined,
      location: a.location || undefined,
      cost: a.estimatedCost || undefined,
      order: a.order
    }));

    return NextResponse.json(successResponse(formattedActivities));
  } catch (error) {
    console.error(error);
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to reorder activities', requestId), { status: 500 });
  }
}
