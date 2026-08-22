import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const skip = (page - 1) * pageSize;

    const [countries, total] = await Promise.all([
      prisma.country.findMany({
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: { _count: { select: { destinations: true } } },
      }),
      prisma.country.count(),
    ]);

    // Normalize: remap _count.destinations -> _count.cities to match frontend types
    const normalized = countries.map(({ _count, ...rest }: any) => ({
      ...rest,
      _count: { cities: _count?.destinations ?? 0 },
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: normalized,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('[COUNTRIES_GET]', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch countries' } },
      { status: 500 }
    );
  }
}
