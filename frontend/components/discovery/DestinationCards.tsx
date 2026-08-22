'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Bookmark, BookmarkCheck } from 'lucide-react';
import { City, Country } from '@/lib/api/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savedApi } from '@/lib/api/saved';

// Helper to extract a mock image based on name for cinematic feel
const getMockImage = (name: string, type: 'city' | 'country') => {
  const seed = name.toLowerCase().replace(/[^a-z]/g, '');
  return `https://source.unsplash.com/800x600/?${type},${seed}`;
};

export function CountryCard({ country }: { country: Country }) {
  const imageUrl = getMockImage(country.name, 'country');
  
  return (
    <Link href={`/destinations/countries/${country.slug}`} className="group relative block overflow-hidden rounded-3xl aspect-[4/5] bg-slate-100 isolate">
      <img 
        src={imageUrl} 
        alt={country.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h3 className="text-white font-display text-2xl font-bold tracking-tight mb-1">{country.name}</h3>
        {country._count?.cities !== undefined && (
          <p className="text-white/80 text-sm">{country._count.cities} Destinations</p>
        )}
      </div>
    </Link>
  );
}

export function CityCard({ city, isSaved = false }: { city: City, isSaved?: boolean }) {
  const queryClient = useQueryClient();
  const imageUrl = getMockImage(city.name, 'city');
  
  const saveMutation = useMutation<any, Error, void>({
    mutationFn: () => isSaved ? savedApi.unsaveDestination(city.id) : savedApi.saveDestination(city.id),
    onMutate: async () => {
      // Optimistic UI update could go here
      await queryClient.cancelQueries({ queryKey: ['savedDestinations'] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedDestinations'] });
    }
  });

  return (
    <div className="group relative block overflow-hidden rounded-3xl aspect-square bg-slate-100 isolate">
      <Link href={`/destinations/cities/${city.slug}`}>
        <img 
          src={imageUrl} 
          alt={city.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      </Link>
      
      <button 
        onClick={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
      >
        {isSaved ? <BookmarkCheck size={20} className="fill-white" /> : <Bookmark size={20} />}
      </button>

      <div className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none">
        <div className="flex items-center gap-1.5 text-white/80 text-sm mb-1">
          <MapPin size={14} />
          {city.country?.name || 'Country'}
        </div>
        <h3 className="text-white font-display text-xl font-bold tracking-tight">{city.name}</h3>
      </div>
    </div>
  );
}
