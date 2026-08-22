import { calculateTripCost, detectConflicts, calculateTripReadiness, suggestPreparationItems } from './lib/services/intelligence';

function runTests() {
  console.log('Running Intelligence Service Tests...');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, message: string) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
    }
  }

  const mockTrip: any = {
    id: 'trip1',
    destination: 'Paris',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-05'),
    budget: 1000,
    travelers: 2,
    currency: 'USD',
    accommodations: [
      { id: 'a1', checkInDate: '2024-01-01', checkOutDate: '2024-01-05', totalCost: 400 }
    ],
    transportations: [
      { id: 't1', type: 'Flight', departureDate: '2024-01-01', arrivalDate: '2024-01-01', arrivalTime: '10:00', cost: 200 }
    ],
    expenses: [
      { id: 'e1', category: 'FOOD', amount: 50 }
    ],
    itineraryDays: [
      {
        id: 'ts1',
        order: 1,
        date: '2024-01-01',
        activities: [
          { id: 'act1', title: 'Louvre', startTime: '2024-01-01T08:00', endTime: '2024-01-01T11:00', estimatedCost: 30 }
        ]
      }
    ],
    preparationItems: []
  };

  // 1. Cost Engine
  const cost = calculateTripCost(mockTrip);
  assert(cost.totalProjected === 680, 'Cost Engine: Total projected cost is correct (400+200+50+30)');
  assert(cost.remaining === 320, 'Cost Engine: Remaining budget is correct (1000-680)');
  assert(cost.perTraveler === 340, 'Cost Engine: Per traveler is correct (680/2)');

  // 2. Conflict Engine
  const conflicts = detectConflicts(mockTrip);
  assert(conflicts.some(c => c.severity === 'ERROR' && c.message.includes('occurs before Flight arrival')), 'Conflict Engine: Detects activity before transport arrival');

  // 3. Readiness Engine
  const readiness = calculateTripReadiness(mockTrip);
  assert(readiness.score > 50, 'Readiness Engine: Score is calculated properly');
  assert(readiness.completedChecks.includes('Destination configured'), 'Readiness Engine: Destination configured');

  // 4. Preparation Suggestions
  const suggestions = suggestPreparationItems(mockTrip);
  assert(suggestions.some(s => s.name.includes('Flight tickets')), 'Preparation Engine: Suggests flight tickets');

  console.log(`\nTest Results: ${passed}/${total} passed.`);
  if (passed !== total) process.exit(1);
}

runTests();
