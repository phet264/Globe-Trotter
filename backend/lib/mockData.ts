export const MOCK_COUNTRIES = [
  { id: '1', name: 'France', code: 'FR', slug: 'france', _count: { destinations: 5 } },
  { id: '2', name: 'Italy', code: 'IT', slug: 'italy', _count: { destinations: 8 } },
  { id: '3', name: 'Japan', code: 'JP', slug: 'japan', _count: { destinations: 12 } },
  { id: '4', name: 'Australia', code: 'AU', slug: 'australia', _count: { destinations: 6 } },
];

export const MOCK_CITIES = [
  { id: '1', countryId: '1', name: 'Paris', slug: 'paris', latitude: 48.8566, longitude: 2.3522, description: 'The Destination of Light', country: MOCK_COUNTRIES[0], _count: { activities: 20 } },
  { id: '2', countryId: '2', name: 'Rome', slug: 'rome', latitude: 41.9028, longitude: 12.4964, description: 'The Eternal Destination', country: MOCK_COUNTRIES[1], _count: { activities: 15 } },
  { id: '3', countryId: '3', name: 'Tokyo', slug: 'tokyo', latitude: 35.6762, longitude: 139.6503, description: 'Metropolis of the Future', country: MOCK_COUNTRIES[2], _count: { activities: 30 } },
];

export const MOCK_ACTIVITIES = [
  { id: '1', destinationId: '1', name: 'Eiffel Tower', description: 'Iconic iron tower', category: 'SIGHTSEEING', estimatedCost: 25.00, duration: 120, destination: MOCK_CITIES[0] },
  { id: '2', destinationId: '1', name: 'Louvre Museum', description: 'World largest art museum', category: 'MUSEUM', estimatedCost: 17.00, duration: 180, destination: MOCK_CITIES[0] },
  { id: '3', destinationId: '2', name: 'Colosseum', description: 'Ancient amphitheatre', category: 'SIGHTSEEING', estimatedCost: 16.00, duration: 150, destination: MOCK_CITIES[1] },
];

// In-memory store for saved destinations
export const MOCK_SAVED = new Set<string>();
