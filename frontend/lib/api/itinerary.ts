import { ItineraryActivity } from './types';
import { api } from './client';

export const itineraryApi = {
  getActivities: async (tripId: string): Promise<ItineraryActivity[]> => {
    return await api.get<ItineraryActivity[]>(`/v1/trips/${tripId}/activities`);
  },

  addActivity: async (data: Partial<ItineraryActivity>): Promise<ItineraryActivity> => {
    return await api.post<ItineraryActivity>(`/v1/trips/${data.tripId}/activities`, data);
  },

  updateActivity: async (id: string, data: Partial<ItineraryActivity>): Promise<ItineraryActivity> => {
    return await api.patch<ItineraryActivity>(`/v1/trips/activities/${id}`, data);
  },

  deleteActivity: async (id: string): Promise<void> => {
    await api.delete<void>(`/v1/trips/activities/${id}`);
  },

  reorderActivities: async ({ tripId, activityIds }: { tripId: string, activityIds: string[] }): Promise<ItineraryActivity[]> => {
    return await api.patch<ItineraryActivity[]>(`/v1/trips/${tripId}/activities/reorder`, { activityIds });
  }
};
