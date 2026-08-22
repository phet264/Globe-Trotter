'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DestinationCard } from '@/components/discovery/DestinationCard';
import { getMockImage } from '@/lib/utils/images';
import { getDestinationData, getRelatedDestinations, DestinationData } from '@/lib/data/destination-data';
import {
  ArrowLeft, MapPin, Clock, Calendar, Tag,
  Landmark, ChevronRight, Wallet, Star,
} from 'lucide-react';

// ─── Sub-components ───────────────────────────────────────────────────────────

import type { LucideProps } from 'lucide-react';

function InfoChip({ icon: Icon, label, value }: { icon: React.ComponentType<LucideProps>; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={16} />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      </div>
      <p className="font-bold text-slate-800 text-base leading-snug">{value}</p>
    </div>
  );
}

function AttractionCard({ name, description, image }: { name: string; description: string; image: string }) {
  const [imgError, setImgError] = React.useState(false);
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={imgError ? getMockImage('travel') : image}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h4 className="font-bold text-slate-900 mb-1.5 text-base">{name}</h4>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{description}</p>
      </div>
    </div>
  );
}

function SkeletonHero() {
  return (
    <div className="relative h-[60vh] min-h-[480px] w-full bg-slate-200 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 space-y-4">
        <div className="h-4 w-32 bg-white/20 rounded-full" />
        <div className="h-14 w-80 bg-white/20 rounded-xl" />
        <div className="h-5 w-96 bg-white/20 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DestinationDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  // All data is static — no loading state needed for metadata
  const data: DestinationData | null = getDestinationData(slug);
  const relatedData = data ? getRelatedDestinations(data.alsoLike) : [];
  const [imgError, setImgError] = React.useState(false);

  // Not Found
  if (!data) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
            <MapPin size={32} className="text-slate-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-3">Destination Not Found</h1>
          <p className="text-slate-500 max-w-md mb-8">
            We couldn't find the destination "<span className="font-semibold">{slug}</span>". It may not exist yet in our database.
          </p>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Destinations
          </Link>
        </div>
      </AuthGuard>
    );
  }

  const heroImage = imgError ? getMockImage('travel') : getMockImage(slug);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 pb-24">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="relative h-[65vh] min-h-[520px] max-h-[720px] w-full isolate overflow-hidden bg-slate-900 flex items-end">
          <img
            src={heroImage}
            alt={data.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          {/* Layered gradient: strong at bottom, dark at top edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-slate-900/30" />

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Breadcrumb */}
          {data.countrySlug && (
            <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs font-medium px-3 py-2 rounded-full">
              <Link href={`/destinations/${data.countrySlug}`} className="hover:text-white transition-colors">{data.country}</Link>
              <ChevronRight size={12} />
              <span className="text-white">{data.name}</span>
            </div>
          )}

          {/* Hero text */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-16 sm:pb-20">
            <div className="flex items-center gap-2 text-white/70 text-sm font-medium mb-3">
              <MapPin size={16} />
              <span>{data.region ? `${data.region}, ` : ''}{data.country}</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-white tracking-tight mb-4 drop-shadow-2xl">
              {data.name}
            </h1>
            <p className="text-lg sm:text-xl text-white/85 max-w-2xl font-medium drop-shadow-lg">
              {data.tagline}
            </p>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Description ───────────────────────────────────────────── */}
          <section className="mt-14 mb-12">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">
                About {data.name}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">{data.description}</p>
            </div>
          </section>

          {/* ── Travel Info Grid ──────────────────────────────────────── */}
          <section className="mb-14">
            <h2 className="text-xl font-display font-bold text-slate-900 mb-5">Travel Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
              <InfoChip icon={Calendar} label="Best Time" value={data.bestTime} />
              <InfoChip icon={Clock} label="Recommended Stay" value={data.duration} />
              <InfoChip icon={Wallet} label="Budget Level" value={data.budget} />
              <InfoChip icon={Star} label="Experiences" value={data.experience.slice(0, 2).join(' · ')} />
            </div>
            {/* Experience tags */}
            <div className="flex flex-wrap gap-2">
              {data.experience.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm"
                >
                  <Tag size={11} className="text-slate-400" />
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* ── Attractions ───────────────────────────────────────────── */}
          {data.attractions.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <Landmark size={22} className="text-slate-400" />
                <h2 className="text-2xl font-display font-bold text-slate-900">
                  Popular Places in {data.name}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.attractions.map(attr => (
                  <AttractionCard
                    key={attr.name}
                    name={attr.name}
                    description={attr.description}
                    image={attr.image}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── You May Also Like ─────────────────────────────────────── */}
          {relatedData.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
                You May Also Like
              </h2>
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
