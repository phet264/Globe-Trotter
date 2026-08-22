import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthenticatedUser();
    const saved = await prisma.savedDestination.findMany({
      where: { userId: user.id },
      include: { destination: { include: { country: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error('[SAVED_DESTINATIONS_GET]', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch saved destinations' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthenticatedUser();
    const body = await req.json();
    const { destinationId } = body;

    if (!destinationId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'destinationId is required' } },
        { status: 400 }
      );
    }

    const saved = await prisma.savedDestination.upsert({
      where: {
        userId_destinationId: {
          userId: user.id,
          destinationId,
        }
      },
      update: {},
      create: {
        userId: user.id,
        destinationId,
      },
      include: { destination: { include: { country: true } } }
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error('[SAVED_DESTINATIONS_POST]', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to save destination' } },
      { status: 500 }
    );
  }
}
