import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function GET(req: Request) {
  const requestId = generateRequestId();
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    if (q.length < 2) {
      return NextResponse.json(successResponse({ countries: [], cities: [], activities: [] }));
    }

    const countries = await prisma.country.findMany({
      where: { name: { contains: q } },
      take: limit,
      include: {
        _count: { select: { destinations: true } }
      }
    });

    const destinations = await prisma.destination.findMany({
      where: { name: { contains: q } },
      take: limit,
      include: { country: true }
    });

    const places = await prisma.place.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } }
        ]
      },
      take: limit,
      include: { destination: true }
    });

    // Map Prisma models to Frontend expected shapes
    const mappedCountries = countries.map(c => ({
      ...c,
      _count: { cities: c._count.destinations }
    }));

    const mappedCities = destinations.map(d => ({
      id: d.id,
      countryId: d.countryId,
      name: d.name,
      slug: d.slug,
      latitude: d.latitude,
      longitude: d.longitude,
      description: d.description,
      country: d.country,
    }));

    const mappedActivities = places.map(p => ({
      id: p.id,
      cityId: p.destinationId,
      name: p.name,
      description: p.description,
      category: p.category,
      estimatedCost: p.estimatedCost,
      duration: p.duration,
      city: {
        id: p.destination.id,
        name: p.destination.name,
        slug: p.destination.slug
      }
    }));

    return NextResponse.json(successResponse({
      countries: mappedCountries,
      cities: mappedCities,
      activities: mappedActivities
    }));
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Search failed', requestId), { status: 500 });
  }
}
