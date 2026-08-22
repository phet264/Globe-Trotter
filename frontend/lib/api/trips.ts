import { Trip, TripStop } from './types';
import { api } from './client';
/* eslint-disable @typescript-eslint/no-unused-vars */

export const tripsApi = {
  getTrips: async (): Promise<Trip[]> => {
    const res = await api.get<{ trips: Trip[] }>('/v1/trips');
    return res.trips;
  },

  getTrip: async (id: string): Promise<Trip> => {
    const res = await api.get<{ trip: Trip }>(`/v1/trips/${id}`);
    return res.trip;
  },

  createTrip: async (data: Partial<Trip>): Promise<Trip> => {
    const res = await api.post<{ trip: Trip }>('/v1/trips', data);
    return res.trip;
  },

  updateTrip: async (id: string, data: Partial<Trip>): Promise<Trip> => {
    const res = await api.patch<{ trip: Trip }>(`/v1/trips/${id}`, data);
    return res.trip;
  },

  deleteTrip: (id: string): Promise<void> => {
    return api.delete<void>(`/v1/trips/${id}`);
  },

  reorderStops: async (tripId: string, stopIds: string[]): Promise<TripStop[]> => {
    const res = await api.patch<{ stops: TripStop[] }>(`/v1/trips/${tripId}/stops/reorder`, { stopIds });
    return res.stops;
  },

  addStop: async (tripId: string, data: { city: string, country: string, lat: number, lng: number }): Promise<TripStop> => {
    const res = await api.post<{ stop: TripStop }>(`/v1/trips/${tripId}/stops`, data);
    return res.stop;
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
