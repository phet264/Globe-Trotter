import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DestinationCardProps {
  city: string;
  country: string;
  description: string;
  imageUrl: string;
}

export function DestinationCard({ city, country, description, imageUrl }: DestinationCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all hover:shadow-lg">
      <div className="aspect-[4/3] w-full overflow-hidden">
        {/* We use a colored div as a fallback for the image since we don't have real images yet */}
        <div 
          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})`, backgroundColor: 'var(--muted)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
        <div className="flex items-center gap-1.5 text-primary mb-2">
          <MapPin className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">{country}</span>
        </div>
        <h3 className="font-display text-2xl font-bold mb-2">{city}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {description}
        </p>
        <Button variant="outline" size="sm" className="w-full opacity-0 transition-all duration-500 group-hover:opacity-100 rounded-full">
          Explore {city}
        </Button>
      </div>
    </div>
  );
}
