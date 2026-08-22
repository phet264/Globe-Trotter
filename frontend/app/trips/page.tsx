'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { tripsApi } from '@/lib/api/trips';
import { TripCard } from '@/components/trip/TripCards';
import { Button } from '@/components/ui/button';
import { Plus, Compass, AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

function TripsListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-full aspect-[4/3] bg-slate-200 rounded-2xl" />)}
    </div>
  );
}

function TripsListError({ retry }: { retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-4">
        <AlertTriangle size={24} />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Unable to load trips</h2>
      <p className="text-slate-500 mb-6">There was an error communicating with the server.</p>
      <Button variant="outline" onClick={retry} className="rounded-full">
        <RefreshCcw size={16} className="mr-2" /> Try again
      </Button>
    </div>
  );
}

export default function TripsPage() {
  const { data: trips = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['trips'],
    queryFn: tripsApi.getTrips,
    retry: 2
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">My Trips</h1>
          <p className="text-slate-500 text-lg">Manage all your upcoming and past journeys.</p>
        </div>
        <Link href="/trips/new">
          <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-md">
            <Plus size={16} className="mr-2" />
            Plan a trip
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <TripsListSkeleton />
      ) : isError ? (
        <TripsListError retry={refetch} />
      ) : trips.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-3xl bg-white border border-slate-200 shadow-sm"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <Compass size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">No journeys yet.</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            You haven&apos;t created any trips yet. Start planning your first adventure!
          </p>
          <Link href="/trips/new">
            <Button size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white">
              Start planning
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {Array.isArray(trips) ? trips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          )) : null}
        </motion.div>
      )}
    </div>
  );
}
