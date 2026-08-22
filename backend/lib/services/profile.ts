import { prisma } from '../db/prisma';

export async function logBehaviorEvent(userId: string, eventType: string, entityType?: string, entityId?: string, tripId?: string, metadata?: any) {
  return await prisma.travelBehaviorEvent.create({
    data: {
      userId,
      eventType,
      entityType,
      entityId,
      tripId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    }
  });
}

const CATEGORIES = ['Adventure', 'Nature', 'History', 'Culture', 'Food', 'Shopping', 'Nightlife', 'Photography', 'Relaxation', 'Family'];

export async function recalculateTravelerProfile(userId: string) {
  // 1. Fetch all explicit preferences (highest confidence)
  const trips = await prisma.trip.findMany({
    where: { userId },
    include: {
      preferences: true,
      tripStops: { include: { activities: true } },
      expenses: true,
      accommodations: true
    }
  });

  const behaviorEvents = await prisma.travelBehaviorEvent.findMany({
    where: { userId }
  });

  let scores: Record<string, { points: number; ev: number }> = {};
  CATEGORIES.forEach(c => scores[c] = { points: 0, ev: 0 });

  // Weight explicit preferences heavily
  trips.forEach(t => {
    t.preferences.forEach(p => {
      const cat = CATEGORIES.find(c => p.preference.toLowerCase() === c.toLowerCase());
      if (cat) {
        scores[cat].points += 30; // 30 points per explicit trip pref
        scores[cat].ev += 3;
      }
    });
  });

  // Weight behavior (Activities Added vs Removed)
  behaviorEvents.forEach(e => {
    if (e.eventType === 'ACTIVITY_ADDED' && e.metadata) {
      try {
        const meta = JSON.parse(e.metadata);
        if (meta.category) {
          const cat = CATEGORIES.find(c => meta.category.toLowerCase().includes(c.toLowerCase()));
          if (cat) {
            scores[cat].points += 10;
            scores[cat].ev += 1;
          }
        }
      } catch (err) {}
    }
  });

  // Infer from itinerary categories directly
  trips.forEach(t => {
    t.tripStops.forEach(day => {
      day.activities.forEach(a => {
        if (a.category) {
          const cat = CATEGORIES.find(c => a.category?.toLowerCase().includes(c.toLowerCase()));
          if (cat) {
            scores[cat].points += 5; // 5 points per activity
            scores[cat].ev += 1;
          }
        }
      });
    });
  });

  // Calculate Pace
  let totalDays = 0;
  let totalActs = 0;
  trips.forEach(t => {
    totalDays += t.tripStops.length || 1;
    t.tripStops.forEach(d => totalActs += d.activities.length);
  });
  let actsPerDay = totalDays > 0 ? totalActs / totalDays : 0;
  let paceCategory = 'Unknown';
  if (actsPerDay > 0) {
    if (actsPerDay <= 2) paceCategory = 'RELAXED';
    else if (actsPerDay <= 4) paceCategory = 'MODERATE';
    else if (actsPerDay <= 6) paceCategory = 'ACTIVE';
    else paceCategory = 'INTENSIVE';
  }

  // Update Pace Insight
  if (paceCategory !== 'Unknown') {
    await prisma.travelInsight.upsert({
      where: { id: `pace-${userId}` }, // We don't have composite unique on type, so we'll just delete first and insert, or use a known ID struct
      create: {
        userId,
        type: 'PACE',
        title: 'Preferred Pace',
        description: `You usually prefer a ${paceCategory.toLowerCase()} pace, scheduling about ${actsPerDay.toFixed(1)} activities per day.`,
        confidence: Math.min(1.0, trips.length * 0.2)
      },
      update: {
        description: `You usually prefer a ${paceCategory.toLowerCase()} pace, scheduling about ${actsPerDay.toFixed(1)} activities per day.`,
        confidence: Math.min(1.0, trips.length * 0.2)
      }
    }).catch(async () => {
      // Fallback if upsert fails on ID
      await prisma.travelInsight.deleteMany({ where: { userId, type: 'PACE' } });
      await prisma.travelInsight.create({
        data: {
          userId,
          type: 'PACE',
          title: 'Preferred Pace',
          description: `You usually prefer a ${paceCategory.toLowerCase()} pace, scheduling about ${actsPerDay.toFixed(1)} activities per day.`,
          confidence: Math.min(1.0, trips.length * 0.2)
        }
      });
    });
  }

  // Upsert all preference scores
  for (const cat of CATEGORIES) {
    const data = scores[cat];
    const score = Math.min(100, data.points);
    const confidence = Math.min(1.0, data.ev * 0.1);

    if (data.ev > 0) {
      await prisma.travelPreferenceProfile.upsert({
        where: { userId_category: { userId, category: cat } },
        create: {
          userId,
          category: cat,
          score,
          confidence,
          evidenceCount: data.ev,
          source: data.points >= 30 ? 'MIXED' : 'INFERRED'
        },
        update: {
          score,
          confidence,
          evidenceCount: data.ev,
          source: data.points >= 30 ? 'MIXED' : 'INFERRED'
        }
      });
    }
  }

  return { success: true };
}
