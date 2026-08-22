import { Trip, ItineraryDay, Activity, Expense, Accommodation, Transportation, PreparationItem } from '@prisma/client';

type FullTrip = Trip & {
  itineraryDays: (ItineraryDay & { activities: Activity[] })[];
  expenses: Expense[];
  accommodations: Accommodation[];
  transportations: Transportation[];
  preparationItems: PreparationItem[];
};

export function calculateTripCost(trip: FullTrip) {
  let accommodation = 0;
  let transportation = 0;
  let activities = 0;
  let food = 0;
  let miscellaneous = 0;

  // Accommodations
  trip.accommodations.forEach(a => {
    accommodation += Number(a.totalCost || 0);
  });

  // Transportations
  trip.transportations.forEach(t => {
    transportation += Number(t.cost || 0);
  });

  // Itinerary Activities
  trip.itineraryDays.forEach(stop => {
    stop.activities.forEach(act => {
      activities += Number(act.estimatedCost || 0);
    });
  });

  // Expenses
  trip.expenses.forEach(e => {
    const amount = Number(e.amount || 0);
    if (e.category === 'ACCOMMODATION') accommodation += amount;
    else if (e.category === 'TRANSPORT') transportation += amount;
    else if (e.category === 'ACTIVITY') activities += amount;
    else if (e.category === 'FOOD') food += amount;
    else miscellaneous += amount;
  });

  const totalProjected = accommodation + transportation + activities + food + miscellaneous;
  const totalBudget = Number(trip.budget || 0);
  const remaining = totalBudget - totalProjected;
  
  const tripDays = trip.itineraryDays.length || 1;
  const perDay = totalProjected / tripDays;
  const perTraveler = totalProjected / (trip.travelers || 1);

  return {
    totalBudget,
    totalProjected,
    remaining,
    perTraveler,
    perDay,
    breakdown: {
      accommodation,
      transportation,
      activities,
      food,
      miscellaneous
    }
  };
}

function parseDateTime(dateStr: string | Date, timeStr?: string | null): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (!timeStr) return d;
  
  // timeStr usually "HH:mm"
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (!isNaN(hours) && !isNaN(minutes)) {
    d.setUTCHours(hours, minutes, 0, 0);
  }
  return d;
}

export function detectConflicts(trip: FullTrip) {
  const conflicts: any[] = [];
  
  // 1. Overloaded Day Detection
  trip.itineraryDays.forEach(stop => {
    // let's assume average duration is 2 hours if missing.
    let totalMinutes = 0;
    stop.activities.forEach(a => {
      if (a.startTime && a.endTime) {
        const diffMs = new Date(a.endTime).getTime() - new Date(a.startTime).getTime();
        totalMinutes += diffMs / 60000;
      } else {
        totalMinutes += 120; // 2 hours default
      }
    });

    if (totalMinutes > 480) { // >8 hours
      conflicts.push({
        id: `overload-${stop.id}`,
        severity: 'WARNING',
        message: `Day ${stop.dayNumber} has ${Math.round(totalMinutes / 60)} hours of scheduled activities.`
      });
    } else if (stop.activities.length > 0 && totalMinutes < 120) {
      conflicts.push({
        id: `underload-${stop.id}`,
        severity: 'INFO',
        message: `Day ${stop.dayNumber} has very few activities planned.`
      });
    }
  });

  // 2. Overlap Detection (Activities within same day)
  trip.itineraryDays.forEach(stop => {
    const timedActs = stop.activities.filter(a => a.startTime).sort((a, b) => new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime());
    for (let i = 0; i < timedActs.length - 1; i++) {
      const curr = timedActs[i];
      const next = timedActs[i+1];
      
      const currEnd = curr.endTime ? new Date(curr.endTime).getTime() : new Date(curr.startTime!).getTime() + 120 * 60000;
      const nextStart = new Date(next.startTime!).getTime();
      
      if (currEnd > nextStart) {
        conflicts.push({
          id: `overlap-${curr.id}-${next.id}`,
          severity: 'ERROR',
          message: `Activity "${curr.title}" overlaps with "${next.title}".`
        });
      }
    }
  });

  // 3. Transport vs Activity conflicts
  trip.transportations.forEach(trans => {
    const arrivalDateObj = parseDateTime(trans.arrivalDate, trans.arrivalTime);
    if (arrivalDateObj) {
      const arrTime = arrivalDateObj.getTime();
      trip.itineraryDays.forEach(stop => {
        stop.activities.forEach(act => {
          if (act.startTime) {
            const actStart = new Date(act.startTime).getTime();
            // If activity starts before transport arrives
            if (actStart > new Date(trans.departureDate).getTime() && actStart < arrTime) {
               conflicts.push({
                 id: `trans-conflict-${trans.id}-${act.id}`,
                 severity: 'ERROR',
                 message: `Activity "${act.title}" occurs before ${trans.type} arrival.`
               });
            }
          }
        });
      });
    }
  });

  // 4. Budget Overload
  const cost = calculateTripCost(trip);
  if (cost.remaining < 0) {
    conflicts.push({
      id: `budget-over`,
      severity: 'WARNING',
      message: `Trip is ${trip.currency || '$'}${Math.abs(cost.remaining).toFixed(2)} over budget.`
    });
  } else if (cost.totalBudget > 0 && cost.remaining < (cost.totalBudget * 0.1)) {
    conflicts.push({
      id: `budget-tight`,
      severity: 'INFO',
      message: `Only ${trip.currency || '$'}${cost.remaining.toFixed(2)} remaining in budget.`
    });
  }

  return conflicts;
}

export function calculateTripReadiness(trip: FullTrip) {
  let score = 0;
  const maxScore = 100;
  const completedChecks: string[] = [];
  const pendingChecks: string[] = [];

  // Basics (30%)
  if (trip.destinationId && trip.destinationId !== 'TBD') {
    score += 15;
    completedChecks.push('Destination configured');
  } else pendingChecks.push('Destination configured');

  if (trip.startDate && trip.endDate) {
    score += 15;
    completedChecks.push('Dates configured');
  } else pendingChecks.push('Dates configured');

  // Logistics (40%)
  if (trip.accommodations.length > 0) {
    score += 20;
    completedChecks.push('Accommodation added');
  } else pendingChecks.push('Accommodation missing');

  if (trip.transportations.length > 0) {
    score += 20;
    completedChecks.push('Transportation added');
  } else pendingChecks.push('Transportation missing');

  // Itinerary (30%)
  const hasActivities = trip.itineraryDays.some(ts => ts.activities.length > 0);
  if (hasActivities) {
    score += 15;
    completedChecks.push('Itinerary activities planned');
  } else pendingChecks.push('Itinerary activities missing');

  const conflicts = detectConflicts(trip);
  const hasErrors = conflicts.some(c => c.severity === 'ERROR');
  if (!hasErrors) {
    score += 15;
    completedChecks.push('No scheduling conflicts');
  } else pendingChecks.push('Resolve scheduling conflicts');

  return {
    score,
    completedChecks,
    pendingChecks
  };
}

export function suggestPreparationItems(trip: FullTrip) {
  const suggestions: { category: string, name: string }[] = [
    { category: 'Documents', name: 'ID/Passport' },
    { category: 'Money', name: 'Credit cards & Cash' },
    { category: 'Electronics', name: 'Phone charger' },
    { category: 'Health/Safety', name: 'First-aid kit' }
  ];

  if (trip.transportations.some(t => t.type.toLowerCase() === 'flight')) {
    suggestions.push({ category: 'Documents', name: 'Flight tickets / Boarding pass' });
  }

  const allCategories = trip.itineraryDays.flatMap(ts => ts.activities.map(a => a.category?.toLowerCase()));
  if (allCategories.includes('beach') || allCategories.includes('swimming')) {
    suggestions.push({ category: 'Clothing', name: 'Swimwear' });
    suggestions.push({ category: 'Health/Safety', name: 'Sunscreen' });
  }
  
  if (allCategories.includes('hiking') || allCategories.includes('adventure')) {
    suggestions.push({ category: 'Clothing', name: 'Comfortable hiking shoes' });
    suggestions.push({ category: 'Other', name: 'Water bottle' });
  }

  // Filter out existing ones
  const existingNames = trip.preparationItems.map(p => p.name.toLowerCase());
  return suggestions.filter(s => !existingNames.includes(s.name.toLowerCase()));
}
