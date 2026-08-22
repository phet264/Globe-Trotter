import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function PATCH(req: Request, props: { params: Promise<{ activityId: string }> }) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const { activityId } = await props.params;
    const data = await req.json();

    // Verify activity exists and belongs to user's trip
    const existingActivity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { tripStop: { include: { trip: true } } }
    });

    if (!existingActivity || existingActivity.tripStop.trip.userId !== user.id) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Activity not found', requestId), { status: 404 });
    }

    let startTime = undefined;
    if (data.time) {
      const [hours, minutes] = data.time.split(':');
      const d = data.date ? new Date(data.date) : (existingActivity.date || new Date());
      d.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      startTime = d;
    }

    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.cost !== undefined && { estimatedCost: data.cost }),
        ...(data.date && { date: new Date(data.date) }),
        ...(startTime !== undefined && { startTime }),
      },
      include: { tripStop: true }
    });

    const formattedActivity = {
      id: updatedActivity.id,
      tripId: updatedActivity.tripStop.tripId,
      stopId: updatedActivity.tripStopId,
      day: 1,
      date: updatedActivity.date?.toISOString().split('T')[0] || updatedActivity.tripStop.startDate?.toISOString().split('T')[0] || '',
      time: updatedActivity.startTime ? updatedActivity.startTime.toISOString().split('T')[1].substring(0, 5) : '00:00',
      title: updatedActivity.title || 'Untitled',
      description: updatedActivity.description || undefined,
      location: updatedActivity.location || undefined,
      cost: updatedActivity.estimatedCost || undefined,
      order: updatedActivity.order
    };

    return NextResponse.json(successResponse(formattedActivity));
  } catch (error) {
    console.error(error);
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to update activity', requestId), { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ activityId: string }> }) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const { activityId } = await props.params;

    const existingActivity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { tripStop: { include: { trip: true } } }
    });

    if (!existingActivity || existingActivity.tripStop.trip.userId !== user.id) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Activity not found', requestId), { status: 404 });
    }

    await prisma.activity.delete({ where: { id: activityId } });

    return NextResponse.json(successResponse({ success: true }));
  } catch (error) {
    console.error(error);
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to delete activity', requestId), { status: 500 });
  }
}
