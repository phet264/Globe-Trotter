'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ActivityCard } from '@/components/discovery/ActivityCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { destinationsApi } from '@/lib/api/destinations';
import { savedApi } from '@/lib/api/saved';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Bookmark, BookmarkCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CityPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: city, isLoading } = useQuery({
    queryKey: ['city', slug],
    queryFn: () => destinationsApi.getCity(slug),
  });

  const { data: savedCities } = useQuery({
    queryKey: ['savedDestinations'],
    queryFn: savedApi.getSavedDestinations,
  });

  const isSaved = savedCities?.some(s => s.cityId === city?.id);

  const saveMutation = useMutation<any, Error, void>({
    mutationFn: () => isSaved && city ? savedApi.unsaveDestination(city.id) : savedApi.saveDestination(city!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedDestinations'] }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">City not found</h2>
        <Button onClick={() => router.push('/destinations')}>Back to Explore</Button>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 pb-24">
        <div className="relative h-[55vh] min-h-[450px] w-full flex items-center justify-center isolate overflow-hidden bg-slate-900">
          <img 
            src={`https://source.unsplash.com/1600x900/?city,${city.name.toLowerCase()}`} 
            alt={city.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-900/40 to-transparent" />
          
          <div className="absolute top-6 w-full px-6 flex items-center justify-between z-20">
            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => router.back()}>
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {isSaved ? (
                <><BookmarkCheck size={18} className="mr-2" /> Saved</>
              ) : (
                <><Bookmark size={18} className="mr-2" /> Save Destination</>
              )}
            </Button>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-16 flex flex-col justify-end h-full pb-16">
            <div className="flex items-center gap-2 text-white/80 font-medium mb-3">
              <MapPin size={18} />
              {city.country?.name}
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-4 drop-shadow-lg">
              {city.name}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl font-medium drop-shadow-md line-clamp-3">
              {city.description || `Discover the culture, attractions, and vibrant lifestyle of ${city.name}, a premier destination in ${city.country?.name}.`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900">
              Top Experiences
            </h2>
          </div>

          {city.activities && city.activities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {city.activities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-100">
              No experiences found for this destination yet.
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
