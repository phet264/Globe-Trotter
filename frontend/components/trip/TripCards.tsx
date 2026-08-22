'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Trip } from '@/lib/api/types';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UpcomingTripCard({ trip }: { trip: Trip }) {
  const destinationText = trip.stops.length > 0 
    ? `${trip.stops[0].city}, ${trip.stops[0].country}${trip.stops.length > 1 ? ` +${trip.stops.length - 1} more` : ''}`
    : 'No destinations yet';

  const daysLeft = trip.startDate ? formatDistanceToNow(parseISO(trip.startDate), { addSuffix: true }) : '';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative w-full h-[400px] md:h-[450px] rounded-3xl overflow-hidden group shadow-lg"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url('${trip.coverImage || '/placeholder.jpg'}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
      
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
        <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium self-start">
          UPCOMING JOURNEY
        </div>
        
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
          {trip.name}
        </h2>
        
        <div className="flex flex-wrap items-center gap-4 text-slate-200 text-sm mb-8">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} className="text-primary/80" />
            <span>{destinationText}</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/40" />
          <div className="flex items-center gap-1.5">
            <Calendar size={16} className="text-primary/80" />
            <span>{trip.startDate ? format(parseISO(trip.startDate), 'MMM d') : ''} — {trip.endDate ? format(parseISO(trip.endDate), 'MMM d, yyyy') : ''}</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/40" />
          <div className="font-medium text-white">
            {daysLeft}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-sm">
            <div className="flex justify-between text-xs text-white/80 mb-1.5">
              <span>Trip Progress</span>
              <span>{trip.progress || 0}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${trip.progress || 0}%` }}
              />
            </div>
          </div>
          
          <Link href={`/trips/${trip.id}`}>
            <Button className="rounded-full bg-white text-slate-900 hover:bg-slate-100 shadow-xl group/btn">
              Open Journey 
              <ArrowRight size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function TripCard({ trip }: { trip: Trip }) {
  const destinationText = trip.stops.length > 0 ? trip.stops[0].city : 'Undecided';
  
  return (
    <Link href={`/trips/${trip.id}`} className="block">
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200 aspect-[4/3]"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${trip.coverImage || '/placeholder.jpg'}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-white/80 text-xs font-medium mb-1 truncate flex items-center gap-1.5">
                <MapPin size={12} />
                {destinationText} {trip.stops.length > 1 ? `+${trip.stops.length - 1}` : ''}
              </div>
              <h3 className="text-white font-bold text-lg leading-tight mb-1">{trip.name}</h3>
              <div className="text-white/70 text-xs">
                {trip.startDate ? format(parseISO(trip.startDate), 'MMM d, yyyy') : 'No dates set'}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
