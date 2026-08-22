'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DestinationCard } from '@/components/discovery/DestinationCard';
import { useQuery } from '@tanstack/react-query';
import { destinationsApi } from '@/lib/api/destinations';
import { savedApi } from '@/lib/api/saved';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, MapPin, Calendar, Clock, Wallet, Tag, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMockImage } from '@/lib/utils/images';
import { getDestinationData, getRelatedDestinations } from '@/lib/data/destination-data';

export default function CountryPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [imgError, setImgError] = React.useState(false);

  const { data: country, isLoading } = useQuery({
    queryKey: ['country', slug],
    queryFn: () => destinationsApi.getCountry(slug),
  });

  const { data: savedCities } = useQuery({
    queryKey: ['savedDestinations'],
    queryFn: savedApi.getSavedDestinations,
  });

  const staticData = getDestinationData(slug);
  const relatedData = staticData ? getRelatedDestinations(staticData.alsoLike) : [];
  const savedCityIds = new Set(savedCities?.map(s => s.cityId) || []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!country && !staticData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
          <MapPin size={32} className="text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Country Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm">We couldn't find the country "{slug}".</p>
        <Button onClick={() => router.push('/destinations')}>Back to Explore</Button>
      </div>
    );
  }

  const heroImage = imgError ? getMockImage('travel') : getMockImage(slug);
  const displayName = staticData?.name || country?.name || slug;
  const tagline = staticData?.tagline || `Discover the beauty and culture of ${displayName}.`;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 pb-24">

        {/* Hero */}
        <div className="relative h-[60vh] min-h-[480px] max-h-[680px] w-full flex items-end isolate overflow-hidden bg-slate-900">
          <img
            src={heroImage}
            alt={displayName}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-slate-900/30" />

          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-14">
            <div className="flex items-center gap-2 text-white/70 text-sm font-medium mb-3">
              <MapPin size={16} />
              Country
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-white tracking-tight mb-4 drop-shadow-2xl">
              {displayName}
            </h1>
            <p className="text-lg text-white/85 max-w-2xl font-medium drop-shadow-lg">{tagline}</p>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Description */}
          {staticData?.description && (
            <section className="mt-14 mb-12">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">About {displayName}</h2>
              <p className="text-slate-600 text-base leading-relaxed">{staticData.description}</p>
            </section>
          )}

          {/* Travel Info */}
          {staticData && (
            <section className="mb-12">
              <h2 className="text-xl font-display font-bold text-slate-900 mb-5">Travel Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
                {[
                  { label: 'Best Time', value: staticData.bestTime, icon: Calendar },
                  { label: 'Stay', value: staticData.duration, icon: Clock },
                  { label: 'Budget', value: staticData.budget, icon: Wallet },
                  { label: 'Type', value: staticData.experience.slice(0, 2).join(' · '), icon: Tag },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Icon size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {staticData.experience.map(tag => (
                  <span key={tag} className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">{tag}</span>
                ))}
              </div>
            </section>
          )}

          {/* Static attractions */}
          {staticData?.attractions && staticData.attractions.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Landmark size={22} className="text-slate-400" />
                <h2 className="text-2xl font-display font-bold text-slate-900">Must-See in {displayName}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {staticData.attractions.map(attr => (
                  <div key={attr.name} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                      <img
                        src={attr.image}
                        alt={attr.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = getMockImage('travel'); }}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 mb-1.5 text-sm">{attr.name}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{attr.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cities from DB */}
          {country?.cities && country.cities.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
                Featured Destinations in {displayName}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {country.cities.map(city => (
                  <DestinationCard
                    key={city.id}
                    slug={city.slug}
                    name={city.name}
                    isSaved={savedCityIds.has(city.id)}
                    aspectRatio="square"
                    showArrow
                  />
                ))}
              </div>
            </section>
          )}

          {/* You May Also Like */}
          {relatedData.length > 0 && (
            <section>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedData.map(dest => (
                  <DestinationCard
                    key={dest.slug}
                    slug={dest.slug}
                    name={dest.name}
                    subtitle={dest.country}
                    description={dest.tagline}
                    aspectRatio="portrait"
                    showArrow
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </AuthGuard>
  );
}
