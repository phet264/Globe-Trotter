import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const country = await prisma.country.findUnique({
      where: { slug },
      include: {
        destinations: {
          orderBy: { name: 'asc' },
          take: 10,
        },
      },
    });

    if (!country) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Country not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: country });
  } catch (error) {
    console.error('[COUNTRY_GET]', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch country' } },
      { status: 500 }
    );
  }
}
