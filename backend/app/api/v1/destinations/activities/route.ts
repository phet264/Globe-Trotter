import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const category = searchParams.get('category');
    const cityId = searchParams.get('cityId');
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (category) where.category = category;
    if (cityId) where.destinationId = cityId;

    const [activities, total] = await Promise.all([
      prisma.place.findMany({
        where,
        skip,
        take: pageSize,
        include: { destination: { include: { country: true } } },
      }),
      prisma.place.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: activities,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('[ACTIVITIES_GET]', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch activities' } },
      { status: 500 }
    );
  }
}
