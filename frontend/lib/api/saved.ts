import { api } from './client';
import { SavedDestination } from './types';

export const savedApi = {
  getSavedDestinations: () => 
    api.get<SavedDestination[]>('/v1/saved-destinations'),
    
  saveDestination: (destinationId: string) =>
    api.post<SavedDestination>('/v1/saved-destinations', { destinationId }),
    
  unsaveDestination: (destinationId: string) =>
    api.delete<{ success: boolean }>(`/v1/saved-destinations/${destinationId}`),
};
