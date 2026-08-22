import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// For Phase 5 we assume user is authenticated and get their ID (mocked for simplicity or from session)
// Since this is a demo, we will extract a mock userId or hardcode one if session isn't available.
const MOCK_USER_ID = 'test-user-id'; // Ideally extract from session

export async function GET(req: NextRequest) {
  try {
    const saved = await prisma.savedDestination.findMany({
      where: { userId: MOCK_USER_ID }, // TODO: replace with real user auth
      include: { city: { include: { country: true } } },
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
    const body = await req.json();
    const { cityId } = body;

    if (!cityId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'cityId is required' } },
        { status: 400 }
      );
    }

    // Ensure the user exists (in a real app, from session)
    // We'll upsert a test user to ensure foreign key constraint passes
    await prisma.user.upsert({
      where: { id: MOCK_USER_ID },
      update: {},
      create: {
        id: MOCK_USER_ID,
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hash',
      }
    });

    const saved = await prisma.savedDestination.upsert({
      where: {
        userId_cityId: {
          userId: MOCK_USER_ID,
          cityId,
        }
      },
      update: {},
      create: {
        userId: MOCK_USER_ID,
        cityId,
      },
      include: { city: { include: { country: true } } }
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
