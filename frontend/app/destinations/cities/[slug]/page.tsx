'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ActivityCard } from '@/components/discovery/ActivityCard';
import { DestinationCard } from '@/components/discovery/DestinationCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { destinationsApi } from '@/lib/api/destinations';
import { savedApi } from '@/lib/api/saved';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Bookmark, BookmarkCheck, MapPin, Calendar, Clock, Wallet, Tag, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMockImage } from '@/lib/utils/images';
import { getDestinationData, getRelatedDestinations } from '@/lib/data/destination-data';

export default function CityPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imgError, setImgError] = React.useState(false);

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

  const staticData = getDestinationData(slug);
  const relatedData = staticData ? getRelatedDestinations(staticData.alsoLike) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!city && !staticData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
          <MapPin size={32} className="text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">City Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm">We couldn't find the destination "{slug}".</p>
        <Button onClick={() => router.push('/destinations')}>Back to Explore</Button>
      </div>
    );
  }

  const heroImage = imgError ? getMockImage('travel') : getMockImage(slug);
  const displayName = staticData?.name || city?.name || slug;
  const countryName = staticData?.country || city?.country?.name || '';
  const tagline = staticData?.tagline || city?.description || `Discover the beauty and culture of ${displayName}.`;

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

          {/* Nav */}
          <div className="absolute top-6 w-full px-6 flex items-center justify-between z-20">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold px-4 py-2 rounded-full transition-colors"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            {city && (
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-full"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
              >
                {isSaved ? (
                  <><BookmarkCheck size={18} className="mr-2" /> Saved</>
                ) : (
                  <><Bookmark size={18} className="mr-2" /> Save Destination</>
                )}
              </Button>
            )}
          </div>

          {/* Hero text */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-14">
            <div className="flex items-center gap-2 text-white/70 text-sm font-medium mb-3">
              <MapPin size={16} />
              {staticData?.region ? `${staticData.region}, ` : ''}{countryName}
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
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Calendar size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Best Time</span>
                  </div>
                  <p className="font-bold text-slate-800">{staticData.bestTime}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Clock size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Stay</span>
                  </div>
                  <p className="font-bold text-slate-800">{staticData.duration}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Wallet size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Budget</span>
                  </div>
                  <p className="font-bold text-slate-800">{staticData.budget}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Tag size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Type</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{staticData.experience.slice(0, 2).join(' · ')}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {staticData.experience.map(tag => (
                  <span key={tag} className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Static attractions */}
          {staticData?.attractions && staticData.attractions.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Landmark size={22} className="text-slate-400" />
                <h2 className="text-2xl font-display font-bold text-slate-900">Popular Places in {displayName}</h2>
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

          {/* DB activities */}
          {city?.activities && city.activities.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Top Experiences</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {city.activities.map(activity => (
                  <ActivityCard key={activity.id} activity={activity} />
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
