import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const city = await prisma.city.findFirst({
      where: { slug },
      include: {
        country: true,
        activities: {
          take: 20,
        },
      },
    });

    if (!city) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'City not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: city });
  } catch (error) {
    console.error('[CITY_GET]', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch city' } },
      { status: 500 }
    );
  }
}
