'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { CityCard } from '@/components/discovery/DestinationCards';
import { useQuery } from '@tanstack/react-query';
import { destinationsApi } from '@/lib/api/destinations';
import { savedApi } from '@/lib/api/saved';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CountryPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const { data: country, isLoading } = useQuery({
    queryKey: ['country', slug],
    queryFn: () => destinationsApi.getCountry(slug),
  });

  const { data: savedCities } = useQuery({
    queryKey: ['savedDestinations'],
    queryFn: savedApi.getSavedDestinations,
  });

  const savedCityIds = new Set(savedCities?.map(s => s.cityId) || []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Country not found</h2>
        <Button onClick={() => router.push('/destinations')}>Back to Explore</Button>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 pb-24">
        <div className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center isolate overflow-hidden bg-slate-900">
          <img 
            src={`https://source.unsplash.com/1600x900/?landscape,${country.name.toLowerCase()}`} 
            alt={country.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />
          
          <Button 
            variant="ghost" 
            className="absolute top-6 left-6 text-white hover:bg-white/20"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>

          <div className="relative z-10 text-center mt-12 px-4">
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-4 drop-shadow-lg">
              {country.name}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
              Discover the beauty, culture, and unforgettable experiences in {country.name}.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900">
              Featured Destinations in {country.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {country.cities?.map(city => (
              <CityCard 
                key={city.id} 
                city={city} 
                isSaved={savedCityIds.has(city.id)} 
              />
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
