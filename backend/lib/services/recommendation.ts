import { Place, Trip, ItineraryDay, Activity, TripPreference } from '@prisma/client';
import { prisma } from '../db/prisma';

// Haversine distance formula
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

export type ScoredPlace = Place & { matchScore: number; reason: string; distanceInfo?: string };

export function calculatePlaceScore(
  place: Place,
  trip: Trip & { preferences?: TripPreference[] },
  remainingBudget: number,
  lastLocation?: { lat: number, lng: number }
): { score: number, reason: string, distanceInfo?: string } {
  let score = 0;
  let reason = 'Popular attraction';
  let distanceInfo = undefined;

  // 1. Interest match (up to 40 points)
  let interestMatches = 0;
  const tripInterests = trip.preferences?.map(p => p.preference) || [];
  if (tripInterests.length > 0 && place.tags) {
    for (const interest of tripInterests) {
      if (place.tags.includes(interest)) {
        interestMatches++;
      }
    }
  }
  if (interestMatches > 0) {
    score += Math.min(40, interestMatches * 15);
    reason = `Matches your interest in ${tripInterests.find(i => place.tags!.includes(i))}`;
  }

  // 2. Popularity (up to 20 points)
  if (place.popularity) {
    score += (place.popularity / 100) * 20;
  }

  // 3. Budget (up to 20 points)
  const cost = Number(place.estimatedCost);
  if (cost === 0) {
    score += 20;
    if (interestMatches === 0) reason = 'Great free activity';
  } else if (remainingBudget > 0 && cost <= remainingBudget * 0.2) {
    score += 15;
  } else if (remainingBudget > 0 && cost <= remainingBudget) {
    score += 10;
  } else if (remainingBudget > 0 && cost > remainingBudget) {
    // over budget penalty
    score -= 20;
  }

  // 4. Location Relevance (up to 20 points)
  if (lastLocation && place.latitude && place.longitude) {
    const distKm = getDistanceFromLatLonInKm(lastLocation.lat, lastLocation.lng, place.latitude, place.longitude);
    distanceInfo = `~${distKm.toFixed(1)} km away`;
    if (distKm < 2) {
      score += 20;
      reason += ' • Very close to your previous activity';
    } else if (distKm < 10) {
      score += 10;
    }
  }

  return { score: Math.max(0, Math.min(100, score)), reason, distanceInfo };
}

export async function getRecommendations(tripId: string): Promise<ScoredPlace[]> {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { 
      preferences: true,
      itineraryDays: { include: { activities: true } },
      destination: true
    }
  });
  if (!trip) throw new Error('Trip not found');

  // get all planned activities
  const plannedPlaceIds = trip.itineraryDays.flatMap(day => day.activities.map(a => a.placeId)).filter(Boolean);
  
  // get total planned cost
  let plannedCost = 0;
  trip.itineraryDays.forEach(day => {
    day.activities.forEach(a => {
      if (a.estimatedCost) plannedCost += Number(a.estimatedCost);
    });
  });

  const remainingBudget = Math.max(0, Number(trip.budget || 0) - plannedCost);

  // find available
  const availablePlaces = await prisma.place.findMany({
    where: {
      id: { notIn: plannedPlaceIds as string[] },
      ...(trip.destinationId ? { destinationId: trip.destinationId } : {})
    }
  });

  const scored = availablePlaces.map(place => {
    const { score, reason, distanceInfo } = calculatePlaceScore(place, trip, remainingBudget);
    return { ...place, matchScore: score, reason, distanceInfo };
  });

  // Sort by score
  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

export async function generateSuggestedItinerary(tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { 
      preferences: true,
      itineraryDays: { include: { activities: true }, orderBy: { dayNumber: 'asc' } } 
    }
  });
  if (!trip) throw new Error('Trip not found');

  let recommendations = await getRecommendations(tripId);
  
  let plannedCost = 0;
  trip.itineraryDays.forEach(day => day.activities.forEach(a => plannedCost += Number(a.estimatedCost || 0)));
  let budget = Number(trip.budget || 0);

  const newActivities: Activity[] = [];
  
  for (const day of trip.itineraryDays) {
    let currentDayMinutes = 0;
    let lastLat: number | undefined;
    let lastLng: number | undefined;
    
    day.activities.forEach(a => {
      currentDayMinutes += 120; // Avg 2 hours
      // We could try to fetch coords of existing, but skip for simplicity
    });

    // Fill the day up to ~6 hours (360 mins)
    while (currentDayMinutes < 360 && recommendations.length > 0) {
      // Re-score based on last location and budget
      const remainingBudget = budget > 0 ? Math.max(0, budget - plannedCost) : 0;
      const rescored = recommendations.map(place => {
        const { score, reason, distanceInfo } = calculatePlaceScore(
          place, 
          trip, 
          remainingBudget, 
          lastLat && lastLng ? { lat: lastLat, lng: lastLng } : undefined
        );
        return { ...place, matchScore: score, reason, distanceInfo };
      }).sort((a, b) => b.matchScore - a.matchScore);

      const top = rescored[0];
      
      const placeDuration = top.duration || 120;
      
      // Stop if adding this exceeds 8 hours (480 mins)
      if (currentDayMinutes + placeDuration > 480) {
        break;
      }

      const newAct = await prisma.activity.create({
        data: {
          itineraryDayId: day.id,
          placeId: top.id,
          title: top.name,
          description: top.description,
          category: top.category,
          estimatedCost: top.estimatedCost,
          imageUrl: top.imageUrl,
          order: day.activities.length + newActivities.filter(na => na.itineraryDayId === day.id).length + 1,
          notes: `Suggested: ${top.reason}`
        }
      });
      newActivities.push(newAct);

      currentDayMinutes += placeDuration;
      plannedCost += Number(top.estimatedCost);
      if (top.latitude && top.longitude) {
        lastLat = top.latitude;
        lastLng = top.longitude;
      }

      // Remove from pool
      recommendations = recommendations.filter(r => r.id !== top.id);
    }
  }

  return trip;
}
