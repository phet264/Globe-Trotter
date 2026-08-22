import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const body = await req.json();
    const { tripId, actionType, parameters } = body;

    if (!tripId || !actionType) {
      return NextResponse.json({ error: 'Missing tripId or actionType' }, { status: 400 });
    }

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({
      where: { id: tripId, userId: user.id }
    });

    if (!trip) {
      return NextResponse.json({ error: 'Unauthorized or trip not found' }, { status: 403 });
    }

    // Execute the action transactionally
    switch (actionType) {
      case 'REMOVE_ACTIVITY': {
        const { activityId } = parameters;
        // Verify activity belongs to trip
        const act = await prisma.activity.findFirst({
          where: { id: activityId, itineraryDay: { tripId } }
        });
        if (!act) return NextResponse.json({ error: 'Activity not found on this trip' }, { status: 404 });
        await prisma.activity.delete({ where: { id: activityId } });
        break;
      }

      case 'ADD_ACTIVITY': {
        const { title, description, time, date, estimatedCost } = parameters;
        const day = await prisma.itineraryDay.findFirst({
          where: { tripId },
          orderBy: { dayNumber: 'asc' }
        });
        if (!day) return NextResponse.json({ error: 'No days in itinerary' }, { status: 400 });

        await prisma.activity.create({
          data: {
            title,
            description,
            estimatedCost: Number(estimatedCost) || 0,
            startTime: new Date(`${day.date?.toISOString().split('T')[0]}T${time || '09:00'}:00Z`),
            order: 99,
            itineraryDayId: day.id
          }
        });
        break;
      }
      default:
        return NextResponse.json({ error: `Action ${actionType} not fully implemented` }, { status: 501 });
    }

    return NextResponse.json({ success: true, message: `Successfully executed ${actionType}` });
  } catch (error: any) {
    console.error('AI Action Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process AI action' }, { status: 500 });
  }
}
