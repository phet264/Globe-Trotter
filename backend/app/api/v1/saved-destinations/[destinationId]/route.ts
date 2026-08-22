import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const MOCK_USER_ID = 'test-user-id';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ destinationId: string }> }
) {
  try {
    const { destinationId } = await params;
    
    await prisma.savedDestination.deleteMany({
      where: {
        userId: MOCK_USER_ID,
        destinationId,
      }
    });

    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error) {
    console.error('[SAVED_DESTINATIONS_DELETE]', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to remove saved destination' } },
      { status: 500 }
    );
  }
}
