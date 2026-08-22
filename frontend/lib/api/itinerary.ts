import { ItineraryActivity } from './types';
import { api } from './client';

export const itineraryApi = {
  getActivities: async (tripId: string): Promise<ItineraryActivity[]> => {
    const res = await api.get<{ data: ItineraryActivity[] }>(`/v1/trips/${tripId}/activities`);
    return res.data;
  },

  addActivity: async (data: Partial<ItineraryActivity>): Promise<ItineraryActivity> => {
    const res = await api.post<{ data: ItineraryActivity }>(`/v1/trips/${data.tripId}/activities`, data);
    return res.data;
  },

  updateActivity: async (id: string, data: Partial<ItineraryActivity>): Promise<ItineraryActivity> => {
    const res = await api.patch<{ data: ItineraryActivity }>(`/v1/trips/activities/${id}`, data);
    return res.data;
  },

  deleteActivity: async (id: string): Promise<void> => {
    await api.delete<void>(`/v1/trips/activities/${id}`);
  },

  reorderActivities: async ({ tripId, activityIds }: { tripId: string, activityIds: string[] }): Promise<ItineraryActivity[]> => {
    const res = await api.patch<{ data: ItineraryActivity[] }>(`/v1/trips/${tripId}/activities/reorder`, { activityIds });
    return res.data;
  }
};
