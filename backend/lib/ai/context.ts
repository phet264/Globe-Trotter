import { prisma } from '@/lib/db/prisma';
import { calculateTripCost, detectConflicts, calculateTripReadiness } from '@/lib/services/intelligence';

export async function buildTripContext(tripId: string, userId: string) {
  // Fetch full trip with all relations
  const trip = await prisma.trip.findUnique({
    where: { id: tripId, userId },
    include: {
      destination: true,
      tripStops: {
        orderBy: { dayNumber: 'asc' },
        include: {
          activities: {
            orderBy: { order: 'asc' }
          }
        }
      },
      accommodations: true,
      transportations: true,
      preparationItems: true,
      expenses: true,
      preferences: true,
      user: { include: { travelPreferences: true, travelInsights: true } }
    }
  });

  if (!trip) {
    throw new Error('Trip not found or unauthorized');
  }

  // Calculate current intelligence metrics
  const costSummary = calculateTripCost(trip as any);
  const conflicts = detectConflicts(trip as any);
  const readiness = calculateTripReadiness(trip as any);

  // Return a structured, token-efficient summary
  return {
    id: trip.id,
    name: trip.title,
    destination: trip.destination?.name || 'Unknown',
    dates: {
      start: trip.startDate,
      end: trip.endDate
    },
    travelers: trip.travelers,
    budget: trip.budget,
    currency: trip.currency || 'USD',
    preferences: trip.preferences.map(p => p.preference),
    status: trip.status,
    intelligence: {
      costSummary,
      conflicts,
      readiness
    },
    itinerary: trip.tripStops.map(day => ({
      id: day.id,
      dayNumber: day.dayNumber,
      date: day.date,
      activities: day.activities.map(act => ({
        id: act.id,
        title: act.title,
        startTime: act.startTime,
        endTime: act.endTime,
        estimatedCost: act.estimatedCost
      }))
    })),
    logistics: {
      accommodations: trip.accommodations.map(a => ({
        id: a.id,
        name: a.name,
        checkIn: a.checkInDate,
        checkOut: a.checkOutDate
      })),
      transportations: trip.transportations.map(t => ({
        id: t.id,
        type: t.type,
        departure: t.departureLocation,
        arrival: t.arrivalLocation
      }))
    },
    travelerProfile: {
      insights: trip.user.travelInsights.map(i => i.description),
      preferences: trip.user.travelPreferences.map(p => ({
        category: p.category,
        score: p.score,
        confidence: p.confidence
      }))
    }
  };
}
