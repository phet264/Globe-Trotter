export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  code: string;
  name: string;
  region?: string;
}

export interface City {
  id: string;
  name: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  description?: string;
  imageUrl?: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  cityId: string;
  durationMinutes?: number;
  estimatedCost?: number;
  imageUrl?: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface TripStop {
  id: string;
  tripId: string;
  cityId: string;
  order: number;
  arrivalDate?: string;
  departureDate?: string;
}

export interface ItineraryActivity {
  id: string;
  tripId: string;
  activityId: string;
  scheduledAt: string;
  order: number;
}

export interface Expense {
  id: string;
  tripId: string;
  amount: number;
  currency: string;
  category: 'accommodation' | 'transport' | 'food' | 'activity' | 'other';
  description?: string;
  date: string;
}

export interface SavedDestination {
  id: string;
  userId: string;
  cityId: string;
  savedAt: string;
}

export interface SharedTrip {
  id: string;
  tripId: string;
  token: string;
  permissions: 'view' | 'edit';
  expiresAt?: string;
}
