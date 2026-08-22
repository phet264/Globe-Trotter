import { api } from './client';
import { Country, City, Activity, PaginatedResponse } from './types';

export const destinationsApi = {
  // Search
  search: (q: string, limit = 5) => 
    api.get<{ countries: Country[], cities: City[], activities: Activity[] }>(`/v1/search`, { params: { q, limit: limit.toString() } }),

  // Countries
  getCountries: (page = 1, pageSize = 20) =>
    api.get<PaginatedResponse<Country>>('/v1/destinations/countries', { params: { page: page.toString(), pageSize: pageSize.toString() } }),
  
  getCountry: (slug: string) =>
    api.get<Country>(`/v1/destinations/countries/${slug}`),

  // Cities
  getCities: (params?: { page?: number, pageSize?: number, country?: string }) => {
    const searchParams: Record<string, string> = {};
    if (params?.page) searchParams.page = params.page.toString();
    if (params?.pageSize) searchParams.pageSize = params.pageSize.toString();
    if (params?.country) searchParams.country = params.country;
    
    return api.get<PaginatedResponse<City>>('/v1/destinations/cities', { params: searchParams });
  },

  getCity: (slug: string) =>
    api.get<City>(`/v1/destinations/cities/${slug}`),

  // Activities
  getActivities: (params?: { page?: number, pageSize?: number, category?: string }) => {
    const searchParams: Record<string, string> = {};
    if (params?.page) searchParams.page = params.page.toString();
    if (params?.pageSize) searchParams.pageSize = params.pageSize.toString();
    if (params?.category) searchParams.category = params.category;
    
    return api.get<PaginatedResponse<Activity>>('/v1/destinations/activities', { params: searchParams });
  }
};
