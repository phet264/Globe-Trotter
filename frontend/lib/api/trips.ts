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
  },

  shareTrip: async (id: string): Promise<{ shareLink: string }> => {
    // Mock implementation
    await new Promise(r => setTimeout(r, 600));
    return { shareLink: `${window.location.origin}/shared/mock-trip-${id}` };
  },

  disableSharing: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 600));
  },

  copyTrip: async (id: string): Promise<{ newTripId: string }> => {
    // Mock implementation for copying
    await new Promise(r => setTimeout(r, 1200));
    return { newTripId: `copied-trip-${Date.now()}` };
  }
};
