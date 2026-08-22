import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function DELETE(req: Request, props: { params: Promise<{ activityId: string }> }) {
  const requestId = generateRequestId();
  try {
    await requireAuthenticatedUser(); // We can implement deeper trip ownership check here for production
    const { activityId } = await props.params;
    
    await prisma.itineraryActivity.delete({
      where: { id: activityId }
    });

    return NextResponse.json(successResponse({ success: true }));
  } catch {
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to delete activity', requestId), { status: 500 });
  }
}
