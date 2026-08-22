import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const countrySlug = searchParams.get('country');
    const skip = (page - 1) * pageSize;

    const where = countrySlug ? { country: { slug: countrySlug } } : {};

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: { country: true, _count: { select: { places: true } } },
      }),
      prisma.destination.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: destinations,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('[CITIES_GET]', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch destinations' } },
      { status: 500 }
    );
  }
}
