'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SearchBar } from '@/components/discovery/SearchBar';
import { CountryCard, CityCard } from '@/components/discovery/DestinationCards';
import { FilterSidebar } from '@/components/discovery/FilterSidebar';
import { useQuery } from '@tanstack/react-query';
import { destinationsApi } from '@/lib/api/destinations';
import { savedApi } from '@/lib/api/saved';
import { Button } from '@/components/ui/button';
import { Filter, Loader2 } from 'lucide-react';

export default function ExplorePage() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  const { data: countries, isLoading: loadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: () => destinationsApi.getCountries(1, 4),
  });

  const { data: cities, isLoading: loadingCities } = useQuery({
    queryKey: ['cities', category],
    queryFn: () => destinationsApi.getCities({ pageSize: 12 }),
  });

  const { data: savedCities } = useQuery({
    queryKey: ['savedDestinations'],
    queryFn: savedApi.getSavedDestinations,
  });

  const savedCityIds = new Set(savedCities?.map(s => s.cityId) || []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Cinematic Hero */}
        <div className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center isolate overflow-hidden bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Explore the world" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />
          
          <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center mt-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-6 drop-shadow-lg">
              EXPLORE THE WORLD
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
              Discover extraordinary places, popular cities, and unique experiences for your next adventure.
            </p>
            <SearchBar />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-20">
          
          {/* Countries Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900">Trending Countries</h2>
            </div>
            
            {loadingCountries ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {countries?.items.map(country => (
                  <CountryCard key={country.id} country={country} />
                ))}
              </div>
            )}
          </section>

          {/* Cities Discovery Section with Filters */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900">Popular Destinations</h2>
              <Button variant="outline" className="lg:hidden" onClick={() => setMobileFilterOpen(true)}>
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <FilterSidebar 
                categories={['SIGHTSEEING', 'MUSEUM', 'NATURE', 'ADVENTURE', 'FOOD']}
                selectedCategory={category}
                onSelectCategory={setCategory}
                isMobileOpen={mobileFilterOpen}
                onCloseMobile={() => setMobileFilterOpen(false)}
              />

              <div className="flex-1">
                {loadingCities ? (
                  <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {cities?.items.map(city => (
                      <CityCard 
                        key={city.id} 
                        city={city} 
                        isSaved={savedCityIds.has(city.id)} 
                      />
                    ))}
                  </div>
                )}
                
                {cities?.pagination && cities.pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Button variant="outline" size="lg" className="rounded-full px-8">
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </AuthGuard>
  );
}
