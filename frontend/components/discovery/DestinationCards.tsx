'use client';

/**
 * Legacy DestinationCards — kept for backwards compatibility with
 * /destinations/countries/[slug] and /destinations/cities/[slug] pages.
 * 
 * New code should use DestinationCard directly.
 */

import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { DestinationCard } from './DestinationCard';
import { City, Country } from '@/lib/api/types';
import { savedApi } from '@/lib/api/saved';

export function CountryCard({ country }: { country: Country }) {
  return (
    <DestinationCard
      slug={country.slug}
      name={country.name}
      subtitle={`${country._count?.cities ?? 0} Destinations`}
      aspectRatio="portrait"
      showArrow
    />
  );
}

export function CityCard({ city, isSaved = false }: { city: City; isSaved?: boolean }) {
  const queryClient = useQueryClient();

  const saveMutation = useMutation<any, Error, void>({
    mutationFn: () =>
      isSaved ? savedApi.unsaveDestination(city.id) : savedApi.saveDestination(city.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedDestinations'] }),
  });

  return (
    <DestinationCard
      slug={city.slug}
      name={city.name}
      subtitle={city.country?.name}
      description={city.description}
      isSaved={isSaved}
      onSaveToggle={() => saveMutation.mutate()}
      isSavePending={saveMutation.isPending}
      aspectRatio="square"
    />
  );
}
