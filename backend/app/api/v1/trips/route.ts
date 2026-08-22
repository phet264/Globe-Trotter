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
    return NextResponse.json(successResponse({ trips: trips.map(t => ({...t, name: t.title})) }));
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
    
    // Assign a dynamic placeholder image if none provided
    // In a real app we'd use Unsplash API based on destination, here we use random beautiful travel images
    const placeholderImages = [
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', // Mountains/Lake
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80', // Paris
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', // Beach
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', // Dubai
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', // New York
    ];
    const defaultImage = body.coverImage || placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    
    const trip = await prisma.trip.create({
      data: {
        userId: user.id,
        title: body.title || body.name,
        destinationId: body.destinationId,
        description: body.description,
        startDate,
        endDate,
        travelers: body.travelers || 1,
        budget: body.budget,
        currency: body.currency,
        coverImage: defaultImage,
      }
    });

    if (body.stops && Array.isArray(body.stops)) {
      const tripStops = body.stops.map((stop: any, index: number) => ({
        tripId: trip.id,
        city: stop.city,
        country: stop.country,
        latitude: stop.lat,
        longitude: stop.lng,
        order: index
      }));
      await prisma.tripStop.createMany({ data: tripStops });
    }

    return NextResponse.json(successResponse({ trip: { ...trip, name: trip.title } }));
  } catch (error) {
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to create trip', requestId), { status: 500 });
  }
}
