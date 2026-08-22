'use client';

import React from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SearchBar } from '@/components/discovery/SearchBar';
import { DestinationCard } from '@/components/discovery/DestinationCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { destinationsApi } from '@/lib/api/destinations';
import { savedApi } from '@/lib/api/saved';
import { Loader2, Globe, TrendingUp, MapPin } from 'lucide-react';
import { DESTINATIONS } from '@/lib/data/destination-data';

// The 4 trending countries we always feature at the top
const TRENDING_COUNTRY_SLUGS = ['france', 'india', 'italy', 'japan'];

// The 12 Indian cities to feature — in order of prominence
const INDIA_CITY_SLUGS = [
  'mumbai', 'delhi', 'agra', 'jaipur',
  'varanasi', 'goa', 'kolkata', 'hyderabad',
  'bengaluru', 'chennai', 'pune', 'ahmedabad',
];

function SectionHeader({
  label,
  labelColor = 'text-primary',
  title,
  subtitle,
}: {
  label: string;
  labelColor?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <p className={`${labelColor} font-semibold text-xs uppercase tracking-[0.15em] mb-2`}>{label}</p>
      <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900">{title}</h2>
      {subtitle && <p className="text-slate-500 mt-1.5 text-sm">{subtitle}</p>}
    </div>
  );
}

export default function ExplorePage() {
  const queryClient = useQueryClient();

  // Saved destinations for bookmark state
  const { data: savedCities } = useQuery({
    queryKey: ['savedDestinations'],
    queryFn: savedApi.getSavedDestinations,
  });

  // Fetch India country for its city list
  const { data: indiaCountry, isLoading: loadingIndia } = useQuery({
    queryKey: ['country', 'india'],
    queryFn: () => destinationsApi.getCountry('india'),
  });

  // Fetch "popular destinations" for the 3rd section (non-India cities)
  const { data: allCities, isLoading: loadingCities } = useQuery({
    queryKey: ['allCities'],
    queryFn: () => destinationsApi.getCities({ pageSize: 20 }),
  });

  const saveMutation = useMutation<any, Error, { cityId: string; isSaved: boolean }>({
    mutationFn: ({ cityId, isSaved }) =>
      isSaved ? savedApi.unsaveDestination(cityId) : savedApi.saveDestination(cityId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedDestinations'] }),
  });

  const savedCityIds = new Set(savedCities?.map(s => s.cityId) || []);

  // Build indian cities list — merge DB data with our ordered slug list
  const dbIndianCities = indiaCountry?.cities || [];
  const indianCitiesOrdered = INDIA_CITY_SLUGS.map(slug => {
    const dbCity = dbIndianCities.find(c => c.slug === slug);
    const staticData = DESTINATIONS[slug];
    if (!staticData) return null;
    return {
      id: dbCity?.id || slug,
      slug,
      name: staticData.name,
      subtitle: staticData.region || staticData.country,
      description: staticData.tagline,
      isSaved: dbCity ? savedCityIds.has(dbCity.id) : false,
      dbCityId: dbCity?.id,
    };
  }).filter(Boolean) as Array<{
    id: string; slug: string; name: string; subtitle: string; description: string; isSaved: boolean; dbCityId?: string;
  }>;

  // Popular international destinations (non-India)
  const popularInternational = (allCities?.items || [])
    .filter(c => c.country?.name !== 'India')
    .slice(0, 6);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">

        {/* ── Cinematic Hero ───────────────────────────────────────────── */}
        <div className="relative h-[55vh] min-h-[440px] max-h-[640px] w-full flex items-end isolate overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2200&q=80"
            alt="Explore the world"
            className="absolute inset-0 w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

          <div className="relative z-10 w-full pb-16 pt-8 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-white/90 text-xs font-semibold mb-5 uppercase tracking-widest">
                <Globe size={14} />
                Discover Destinations
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white mb-5 drop-shadow-xl">
                Explore The World
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Discover extraordinary cities, cultures, and experiences for your next unforgettable adventure.
              </p>
              <SearchBar />
            </div>
          </div>
        </div>

        {/* ── Main Content ─────────────────────────────────────────────── */}
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-16 space-y-20">

          {/* ── Section 1: Trending Countries ─────────────────────────── */}
          <section>
            <SectionHeader
              label="Popular Worldwide"
              labelColor="text-blue-600"
              title="Trending Countries"
              subtitle="Hand-picked destinations loved by travellers worldwide"
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {TRENDING_COUNTRY_SLUGS.map(slug => {
                const data = DESTINATIONS[slug];
                if (!data) return null;
                return (
                  <DestinationCard
                    key={slug}
                    slug={slug}
                    name={data.name}
                    description={data.tagline}
                    aspectRatio="portrait"
                    showArrow
                  />
                );
              })}
            </div>
          </section>

          {/* ── Section 2: Explore Indian Cities ──────────────────────── */}
          <section>
            <SectionHeader
              label="Incredible India"
              labelColor="text-orange-500"
              title="Explore Indian Cities"
              subtitle="From the Himalayan north to the tropical coasts — India's most iconic cities await"
            />
            {loadingIndia ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {indianCitiesOrdered.map(city => (
                  <DestinationCard
                    key={city.slug}
                    slug={city.slug}
                    name={city.name}
                    subtitle={city.subtitle}
                    description={city.description}
                    isSaved={city.isSaved}
                    onSaveToggle={city.dbCityId ? () =>
                      saveMutation.mutate({ cityId: city.dbCityId!, isSaved: city.isSaved })
                    : undefined}
                    isSavePending={saveMutation.isPending}
                    aspectRatio="square"
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Section 3: Popular International Destinations ─────────── */}
          {popularInternational.length > 0 && (
            <section>
              <SectionHeader
                label="Don't Miss"
                labelColor="text-emerald-600"
                title="Popular Destinations"
                subtitle="Iconic cities celebrated for their unique culture, history and beauty"
              />
              {loadingCities ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {popularInternational.map(city => {
                    const isSaved = savedCityIds.has(city.id);
                    return (
                      <DestinationCard
                        key={city.id}
                        slug={city.slug}
                        name={city.name}
                        subtitle={city.country?.name}
                        description={DESTINATIONS[city.slug]?.tagline || city.description}
                        isSaved={isSaved}
                        onSaveToggle={() => saveMutation.mutate({ cityId: city.id, isSaved })}
                        isSavePending={saveMutation.isPending}
                        aspectRatio="landscape"
                        showArrow
                      />
                    );
                  })}
                </div>
              )}
            </section>
          )}

        </div>
      </div>
    </AuthGuard>
  );
}
