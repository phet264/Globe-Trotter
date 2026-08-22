import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { recalculateTravelerProfile } from '@/lib/services/profile';

export async function POST(req: Request) {
  try {
    const user = await requireAuthenticatedUser();

    // Reset learned preferences by clearing them
    await prisma.travelPreferenceProfile.deleteMany({
      where: { userId: user.id }
    });
    await prisma.travelInsight.deleteMany({
      where: { userId: user.id }
    });
    await prisma.travelBehaviorEvent.deleteMany({
      where: { userId: user.id }
    });

    // Optionally do a clean recalculation based ONLY on explicit trips now
    await recalculateTravelerProfile(user.id);

    return NextResponse.json({ success: true, message: 'Profile reset' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
