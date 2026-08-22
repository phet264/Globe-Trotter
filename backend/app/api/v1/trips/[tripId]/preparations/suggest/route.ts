import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';
import { suggestPreparationItems } from '@/lib/services/intelligence';

export async function POST(req: Request, props: { params: Promise<{ tripId: string }> }) {
  const requestId = generateRequestId();
  try {
    const user = await requireAuthenticatedUser();
    const { tripId } = await props.params;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId, userId: user.id },
      include: {
        itineraryDays: { include: { activities: true } },
        accommodations: true,
        transportations: true,
        preparationItems: true,
        expenses: true
      }
    });
    if (!trip) return NextResponse.json(errorResponse('NOT_FOUND', 'Trip not found', requestId), { status: 404 });

    const suggestions = suggestPreparationItems(trip);
    
    // Create them
    if (suggestions.length > 0) {
      await prisma.preparationItem.createMany({
        data: suggestions.map(s => ({
          tripId,
          category: s.category,
          name: s.name,
          isCompleted: false
        }))
      });
    }

    return NextResponse.json(successResponse({ success: true, count: suggestions.length }));
  } catch (error: any) {
    return NextResponse.json(errorResponse('SERVER_ERROR', error.message, requestId), { status: 500 });
  }
}
