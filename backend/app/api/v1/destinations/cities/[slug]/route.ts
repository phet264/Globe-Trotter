import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const destination = await prisma.destination.findFirst({
      where: { slug },
      include: {
        country: true,
        places: {
          take: 20,
        },
      },
    });

    if (!destination) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Destination not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: destination });
  } catch (error) {
    console.error('[CITY_GET]', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch destination' } },
      { status: 500 }
    );
  }
}
