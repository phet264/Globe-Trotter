export type TripStatus = 'PLANNING' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Trip {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  coverImage?: string;
  progress?: number;
  budget?: number;
  interests?: string[];
  stops: TripStop[];
}

export type TravelMode = 'AIRPLANE' | 'BUS' | 'TRAIN' | 'CAR' | 'WALKING';

export interface TripStop {
  id: string;
  tripId: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  order: number;
  arrivalDate?: string;
  departureDate?: string;
  coverImage?: string;
  travelToNext?: TravelMode; 
}

export interface ItineraryActivity {
  id: string;
  tripId: string;
  stopId: string;
  day: number;
  date: string; // ISO date string
  time: string; // "09:00"
  title: string;
  description?: string;
  location?: string;
  cost?: number;
  order: number;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  slug: string;
  cities?: City[];
  _count?: {
    cities?: number;
  };
}

export interface City {
  id: string;
  countryId: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  description?: string;
  country?: Country;
  activities?: Activity[];
  _count?: {
    activities?: number;
  };
}

export interface Activity {
  id: string;
  cityId: string;
  name: string;
  description?: string;
  category: string;
  estimatedCost: number;
  duration?: number;
  city?: City;
}

export interface SavedDestination {
  id: string;
  userId: string;
  cityId: string;
  city: City;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export type ExpenseCategory = 'Transport' | 'Accommodation' | 'Activities' | 'Meals' | 'Other';

export interface Expense {
  id: string;
  tripId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}

export interface BudgetSummary {
  totalBudget: number;
  spent: number;
  remaining: number;
  dailyAverage: number;
  status: 'Under budget' | 'On track' | 'Near limit' | 'Over budget';
  categoryBreakdown: CategorySummary[];
  dailySpending: { date: string; amount: number }[];
}
