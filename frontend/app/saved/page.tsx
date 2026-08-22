'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { CityCard } from '@/components/discovery/DestinationCards';
import { useQuery } from '@tanstack/react-query';
import { savedApi } from '@/lib/api/saved';
import { Loader2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SavedPage() {
  const { data: savedDestinations, isLoading } = useQuery({
    queryKey: ['savedDestinations'],
    queryFn: savedApi.getSavedDestinations,
  });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 p-6 md:p-10 max-w-7xl mx-auto pb-24">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">Saved Destinations</h1>
          <p className="text-slate-500 text-lg">Your personal bucket list of places to visit.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : savedDestinations && savedDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedDestinations.map(saved => (
              <CityCard key={saved.id} city={saved.city} isSaved={true} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 px-4 text-center rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <Bookmark size={32} />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">No saved destinations</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Keep track of places you want to visit. Click the bookmark icon on any destination to save it here.
            </p>
            <Link href="/destinations">
              <Button size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white">
                Explore Destinations
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
