import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ destinationId: string }> }
) {
  try {
    const user = await requireAuthenticatedUser();
    const { destinationId } = await params;
    
    await prisma.savedDestination.deleteMany({
      where: {
        userId: user.id,
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
