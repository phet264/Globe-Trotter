import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const user = await requireAuthenticatedUser();

    const preferences = await prisma.travelPreferenceProfile.findMany({
      where: { userId: user.id },
      orderBy: { score: 'desc' }
    });

    const insights = await prisma.travelInsight.findMany({
      where: { userId: user.id }
    });

    return NextResponse.json({
      preferences,
      insights
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
