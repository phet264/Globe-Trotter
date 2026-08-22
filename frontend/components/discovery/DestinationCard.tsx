'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';
import { getMockImage } from '@/lib/utils/images';

interface DestinationCardProps {
  slug: string;
  name: string;
  subtitle?: string;        // country or region
  description?: string;
  isSaved?: boolean;
  onSaveToggle?: () => void;
  isSavePending?: boolean;
  aspectRatio?: 'portrait' | 'square' | 'landscape';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
}

const ASPECT_CLASSES = {
  portrait:  'aspect-[4/5]',
  square:    'aspect-square',
  landscape: 'aspect-[16/9]',
};

/**
 * Premium destination card — used for countries, cities, and attractions.
 * All cards link to /destinations/[slug].
 */
export function DestinationCard({
  slug,
  name,
  subtitle,
  description,
  isSaved = false,
  onSaveToggle,
  isSavePending = false,
  aspectRatio = 'portrait',
  showArrow = false,
  className = '',
}: DestinationCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getMockImage(slug || name);
  const fallbackUrl = getMockImage('travel');
  const href = `/destinations/${slug}`;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-slate-900 shadow-md
        hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ease-out
        ${ASPECT_CLASSES[aspectRatio]} ${className}`}
    >
      {/* Background image */}
      <Link href={href} className="block w-full h-full">
        <img
          src={imgError ? fallbackUrl : imageUrl}
          alt={name}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover
            transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />

        {/* Gradient overlay — stronger at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          {subtitle && (
            <div className="flex items-center gap-1.5 text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">
              <MapPin size={11} />
              <span>{subtitle}</span>
            </div>
          )}
          <h3 className="text-white font-display font-bold text-xl leading-tight drop-shadow-md">
            {name}
          </h3>
          {description && (
            <p className="text-white/70 text-xs mt-1 line-clamp-1">{description}</p>
          )}
          {showArrow && (
            <div className="mt-3 flex items-center gap-1.5 text-white/80 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Explore <ArrowRight size={13} />
            </div>
          )}
        </div>
      </Link>

      {/* Save button — only shown if a callback is provided */}
      {onSaveToggle && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSaveToggle();
          }}
          disabled={isSavePending}
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full
            bg-black/30 backdrop-blur-md flex items-center justify-center text-white
            hover:bg-black/50 transition-colors disabled:opacity-50"
          aria-label={isSaved ? 'Unsave destination' : 'Save destination'}
        >
          {isSaved
            ? <BookmarkCheck size={16} className="fill-white" />
            : <Bookmark size={16} />}
        </button>
      )}
    </div>
  );
}
