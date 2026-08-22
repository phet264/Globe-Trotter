import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function GET() {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const trips = await prisma.trip.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(successResponse({ trips }));
  } catch {
    return NextResponse.json(errorResponse('UNAUTHENTICATED', 'Not authenticated', requestId), { status: 401 });
  }
}

export async function POST(req: Request) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const body = await req.json();
    
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    
    const trip = await prisma.trip.create({
      data: {
        userId: user.id,
        title: body.title,
        destination: body.destination,
        description: body.description,
        startDate,
        endDate,
        travelers: body.travelers,
        budget: body.budget,
        currency: body.currency,
        coverImage: body.coverImage,
      }
    });

    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (daysDiff > 0 && daysDiff <= 30) {
      const stops = Array.from({ length: daysDiff }).map((_, index) => {
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + index);
        return {
          tripId: trip.id,
          order: index + 1,
          date: dayDate,
          title: `Day ${index + 1}`
        };
      });
      await prisma.tripStop.createMany({ data: stops });
    }

    return NextResponse.json(successResponse({ trip }));
  } catch (error) {
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to create trip', requestId), { status: 500 });
  }
}
