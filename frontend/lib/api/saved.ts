import { api } from './client';
import { SavedDestination } from './types';

export const savedApi = {
  getSavedDestinations: () => 
    api.get<SavedDestination[]>('/v1/saved-destinations'),
    
  saveDestination: (cityId: string) =>
    api.post<SavedDestination>('/v1/saved-destinations', { cityId }),
    
  unsaveDestination: (cityId: string) =>
    api.delete<{ success: boolean }>(`/v1/saved-destinations/${cityId}`),
};
