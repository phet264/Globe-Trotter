import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const category = searchParams.get('category');
    const skip = (page - 1) * pageSize;

    const where = category ? { category } : {};

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: pageSize,
        include: { city: { include: { country: true } } },
      }),
      prisma.activity.count({ where }),
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
