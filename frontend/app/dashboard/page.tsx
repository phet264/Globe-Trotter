'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { tripsApi } from '@/lib/api/trips';
import { UpcomingTripCard, TripCard } from '@/components/trip/TripCards';
import { TravelIntelligence } from '@/components/dashboard/TravelIntelligence';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, Compass, Map, MapPin, DollarSign, Bookmark, ArrowRight, AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12 animate-pulse pb-24">
      <div className="w-1/3 h-10 bg-slate-200 rounded-lg" />
      <div className="w-full h-[450px] bg-slate-200 rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-slate-200 rounded-3xl" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="w-full aspect-[4/3] bg-slate-200 rounded-2xl" />)}
      </div>
    </div>
  );
}

function DashboardError({ retry }: { retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center h-[calc(100vh-100px)]">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-6">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">Unable to load dashboard</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        We couldn&apos;t reach the travel servers. Please check your connection and try again.
      </p>
      <Button size="lg" onClick={retry} className="rounded-full">
        <RefreshCcw size={16} className="mr-2" /> Try again
      </Button>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  
  const { data: trips = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['trips'],
    queryFn: tripsApi.getTrips,
    retry: 2
  });

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <DashboardError retry={refetch} />;

  const upcomingTrip = trips.find(t => t.status === 'UPCOMING' || t.status === 'PLANNING' || t.status === 'ACTIVE');
  const otherTrips = trips.filter(t => t.id !== upcomingTrip?.id).slice(0, 4); // Show top 4 recent

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}
          </h1>
          <p className="text-slate-500 text-lg">Your Travel Command Center.</p>
        </div>
        <Link href="/trips/new">
          <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-md">
            <Plus size={16} className="mr-2" />
            Plan a trip
          </Button>
        </Link>
      </motion.div>

      {/* Main Content */}
      {trips.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-white border border-slate-200 shadow-sm"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <Compass size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">No journeys yet.</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Start planning your first adventure.
          </p>
          <Link href="/trips/new">
            <Button size="lg" className="rounded-full bg-[#3B6654] hover:bg-[#2D4F41] text-white">
              Start planning
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-12">
          {upcomingTrip && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <UpcomingTripCard trip={upcomingTrip} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Trip Info (Mini map / Activity Placeholder) */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[100px] -z-0">
                     {/* Mini map placeholder */}
                     <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                        <Map size={48} />
                     </div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Current Itinerary Status</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center gap-2 text-primary font-medium mb-1"><MapPin size={16} /> Current City</div>
                        <div className="text-2xl font-display font-bold text-slate-900">{upcomingTrip.stops[0]?.city || 'TBD'}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-slate-500 font-medium mb-1"><ArrowRight size={16} /> Next Destination</div>
                        <div className="text-2xl font-display font-bold text-slate-900">{upcomingTrip.stops[1]?.city || 'None'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                     <div>
                       <div className="text-xs text-slate-500 mb-1">Next Activity</div>
                       <div className="font-medium text-slate-900">Not scheduled yet</div>
                     </div>
                     <Button variant="outline" size="sm" className="rounded-full">View Itinerary</Button>
                  </div>
                </div>

                {/* Budget Summary Placeholder */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                      <DollarSign size={16} /> Budget Summary
                    </h3>
                    <div className="text-4xl font-display font-bold mb-2">
                      ${upcomingTrip.budget?.toLocaleString() || '0'}
                    </div>
                    <div className="text-slate-400 text-sm">Total estimated budget</div>
                  </div>

                  <div className="mt-8">
                    <div className="flex justify-between text-xs text-white/80 mb-2">
                      <span>Spent</span>
                      <span>$0</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: '0%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Recent Trips</h3>
              <Link href="/trips" className="text-sm font-medium text-primary hover:underline">View all</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {otherTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
              
              {otherTrips.length < 4 && (
                <Link href="/trips/new" className="block">
                  <div className="h-full aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                      <Plus size={24} />
                    </div>
                    <span className="font-medium">Plan new trip</span>
                  </div>
                </Link>
              )}
            </div>
          </motion.section>

          {/* Phase 9: Travel Intelligence */}
          <TravelIntelligence />

          {/* Saved / Recommendations */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
             <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-start gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
               <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                 <Bookmark size={24} />
               </div>
               <div>
                 <h4 className="font-bold text-slate-900 mb-1">Saved Destinations</h4>
                 <p className="text-sm text-slate-500">You have 12 destinations saved for future trips. Explore them now.</p>
               </div>
             </div>

             <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-start gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
               <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                 <Compass size={24} />
               </div>
               <div>
                 <h4 className="font-bold text-slate-900 mb-1">Recommendations</h4>
                 <p className="text-sm text-slate-500">Based on your interests, we think you&apos;d love a trip to Southeast Asia.</p>
               </div>
             </div>
          </motion.section>

        </div>
      )}
    </div>
  );
}
