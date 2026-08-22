import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { NextResponse } from 'next/server';
import { logBehaviorEvent, recalculateTravelerProfile } from '@/lib/services/profile';

export async function POST(req: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const { eventType, entityType, entityId, tripId, metadata } = await req.json();

    if (!eventType) {
      return NextResponse.json({ error: 'Missing eventType' }, { status: 400 });
    }

    await logBehaviorEvent(user.id, eventType, entityType, entityId, tripId, metadata);

    // Optionally trigger recalculation asynchronously (in real app, use queue)
    recalculateTravelerProfile(user.id).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
