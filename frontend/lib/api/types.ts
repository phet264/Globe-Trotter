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
