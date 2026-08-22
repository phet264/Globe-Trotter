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

    // Verify trip belongs to user
    const trip = await prisma.trip.findUnique({
      where: { id: tripId, userId: user.id }
    });
    if (!trip) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });
    }

    const activities = await prisma.activity.findMany({
      where: { tripStop: { tripId: tripId } },
      orderBy: { order: 'asc' },
      include: { tripStop: true }
    });

    // Map Prisma models to frontend ItineraryActivity schema
    const formattedActivities = activities.map(a => ({
      id: a.id,
      tripId: a.tripStop.tripId,
      stopId: a.tripStopId,
      day: 1, // To be deprecated, frontend uses stopId now
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
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to fetch activities', requestId), { status: 500 });
  }
}

export async function POST(req: Request, props: { params: Promise<{ tripId: string }> }) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const { tripId } = await props.params;
    const data = await req.json();

    const trip = await prisma.trip.findUnique({
      where: { id: tripId, userId: user.id }
    });
    if (!trip) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });
    }

    // Default to the first stop if no stopId is provided
    let tripStopId = data.stopId;
    if (!tripStopId) {
      const firstStop = await prisma.tripStop.findFirst({
        where: { tripId: tripId },
        orderBy: { order: 'asc' }
      });
      if (firstStop) tripStopId = firstStop.id;
    }

    if (!tripStopId) {
      return NextResponse.json(errorResponse('BAD_REQUEST', 'No trip stop found to attach activity', requestId), { status: 400 });
    }

    // Create a generic date if time is provided
    let startTime = undefined;
    if (data.time) {
      const [hours, minutes] = data.time.split(':');
      const d = data.date ? new Date(data.date) : new Date();
      d.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      startTime = d;
    }

    const newActivity = await prisma.activity.create({
      data: {
        tripStopId: tripStopId,
        title: data.title || 'New Activity',
        description: data.description,
        location: data.location,
        estimatedCost: data.cost,
        order: data.order !== undefined ? data.order : 0,
        date: data.date ? new Date(data.date) : null,
        startTime: startTime,
      },
      include: { tripStop: true }
    });

    const formattedActivity = {
      id: newActivity.id,
      tripId: newActivity.tripStop.tripId,
      stopId: newActivity.tripStopId,
      day: 1,
      date: newActivity.date?.toISOString().split('T')[0] || newActivity.tripStop.startDate?.toISOString().split('T')[0] || '',
      time: newActivity.startTime ? newActivity.startTime.toISOString().split('T')[1].substring(0, 5) : (data.time || '00:00'),
      title: newActivity.title || 'Untitled',
      description: newActivity.description || undefined,
      location: newActivity.location || undefined,
      cost: newActivity.estimatedCost || undefined,
      order: newActivity.order
    };

    return NextResponse.json(successResponse(formattedActivity));
  } catch (error) {
    console.error(error);
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to create activity', requestId), { status: 500 });
  }
}
