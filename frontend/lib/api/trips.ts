import { Trip, TripStop } from './types';
import { api } from './client';

export const tripsApi = {
  getTrips: (): Promise<Trip[]> => {
    return api.get<Trip[]>('/v1/trips');
  },

  getTrip: (id: string): Promise<Trip> => {
    return api.get<Trip>(`/v1/trips/${id}`);
  },

  createTrip: (data: Partial<Trip>): Promise<Trip> => {
    return api.post<Trip>('/v1/trips', data);
  },

  updateTrip: (id: string, data: Partial<Trip>): Promise<Trip> => {
    return api.patch<Trip>(`/v1/trips/${id}`, data);
  },

  deleteTrip: (id: string): Promise<void> => {
    return api.delete<void>(`/v1/trips/${id}`);
  },

  reorderStops: (tripId: string, stopIds: string[]): Promise<TripStop[]> => {
    return api.patch<TripStop[]>(`/v1/trips/${tripId}/stops/reorder`, { stopIds });
  }
};
