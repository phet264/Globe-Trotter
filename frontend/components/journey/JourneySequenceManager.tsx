'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelTransition, LocationInfo } from '@/components/globe/TravelTransitionEngine';
import { itineraryApi } from '@/lib/api/itinerary';
import { ItineraryActivity } from '@/lib/api/types';
import { Button } from '@/components/ui/button';

// Mock destinations with hierarchy for the animation
const MOCK_CITIES = [
  { id: '1', name: 'Paris', country: { name: 'France' }, latitude: 48.8566, longitude: 2.3522 },
  { id: '2', name: 'Tokyo', country: { name: 'Japan' }, latitude: 35.6762, longitude: 139.6503 },
  { id: '3', name: 'Dubai', country: { name: 'UAE' }, latitude: 25.2048, longitude: 55.2708 },
  { id: '4', name: 'New York', country: { name: 'USA' }, latitude: 40.7128, longitude: -74.0060 },
  { id: '5', name: 'Amsterdam', country: { name: 'Netherlands' }, latitude: 52.3676, longitude: 4.9041 },
];

// Map activity location data to LocationInfo
function mapActivityToLocation(act: ItineraryActivity): LocationInfo {
  // In a real app, we'd lookup the actual stop details. For mock, we map stopId to a mock city.
  const city = MOCK_CITIES.find(c => c.id === act.stopId) || MOCK_CITIES[0];
  return {
    id: act.id,
    lat: city?.latitude || 0,
    lng: city?.longitude || 0,
    city: city?.name || act.title,
    country: city?.country?.name || 'Unknown'
  };
}

export function JourneySequenceManager({ tripId }: { tripId: string }) {
  const [activities, setActivities] = useState<ItineraryActivity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const router = useRouter();
  
  const { state, startTransition, pauseTransition, resumeTransition, skipTransition, cancelTransition } = useTravelTransition();

  useEffect(() => {
    // Load itinerary
    itineraryApi.getActivities(tripId).then(data => {
      setActivities(data);
    });
    
    // Clean up on unmount
    return () => cancelTransition();
  }, [tripId, cancelTransition]);

  // Handle sequence progression
  useEffect(() => {
    if (!isJourneyActive) return;

    if (state.status === 'COMPLETED' || state.status === 'IDLE') {
      if (currentIndex < activities.length - 1) {
        // Trigger next transition
        const originAct = activities[currentIndex];
        const destAct = activities[currentIndex + 1];
        
        const originLoc = mapActivityToLocation(originAct);
        const destLoc = mapActivityToLocation(destAct);

        const sameCountry = originLoc.country === destLoc.country;
        const isNearby = originAct.stopId === destAct.stopId; // same city = walking/nearby

        // A small delay before next transition starts feels more natural
        const timer = setTimeout(() => {
          startTransition(originLoc, destLoc, sameCountry, isNearby);
          setCurrentIndex(prev => prev + 1);
        }, 1500);

        return () => clearTimeout(timer);
      } else {
        // End of Journey
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsJourneyActive(false);
      }
    }
  }, [state.status, isJourneyActive, currentIndex, activities, startTransition]);

  const handleStart = () => {
    setIsJourneyActive(true);
    setCurrentIndex(0);
    // Kickstart the first step manually
    if (activities.length > 1) {
      const originLoc = mapActivityToLocation(activities[0]);
      const destLoc = mapActivityToLocation(activities[1]);
      const sameCountry = originLoc.country === destLoc.country;
      const isNearby = activities[0].stopId === activities[1].stopId;
      
      startTransition(originLoc, destLoc, sameCountry, isNearby);
      setCurrentIndex(1);
    }
  };

  const handleExit = () => {
    cancelTransition();
    setIsJourneyActive(false);
    router.push(`/trips/${tripId}/itinerary`);
  };

  const currentAct = activities[currentIndex];
  const nextAct = activities[currentIndex + 1];

  const progress = activities.length > 0 ? (currentIndex / (activities.length - 1)) * 100 : 0;

  return (
    <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white w-full shadow-2xl flex flex-col md:flex-row items-center gap-6 pointer-events-auto">
      
      <div className="flex-1 flex flex-col gap-2 w-full">
        {isJourneyActive ? (
          <>
            <div className="flex justify-between text-xs text-white/70 uppercase tracking-widest font-semibold">
              <span>{currentAct?.title} ({currentAct?.stopId ? MOCK_CITIES.find(c => c.id === currentAct.stopId)?.name : ''})</span>
              {nextAct && <span>Next: {nextAct?.title}</span>}
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-white/20 rounded-full overflow-hidden w-full relative">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <div className="text-lg font-bold">Ready to embark on your Journey?</div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {!isJourneyActive ? (
          <Button onClick={handleStart} className="rounded-full bg-white text-black hover:bg-slate-200" size="lg">
            Start Journey
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={state.status === 'PLAYING' ? pauseTransition : resumeTransition}
              className="rounded-full w-12 h-12 bg-white/10 border-white/20 hover:bg-white/20 text-white"
            >
              {state.status === 'PLAYING' ? '⏸' : '▶'}
            </Button>
            <Button 
              variant="outline" 
              onClick={skipTransition}
              className="rounded-full px-6 h-12 bg-white/10 border-white/20 hover:bg-white/20 text-white font-medium"
            >
              Skip
            </Button>
          </>
        )}
        <Button 
          variant="ghost" 
          onClick={handleExit}
          className="rounded-full w-12 h-12 bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 ml-2"
        >
          ✕
        </Button>
      </div>

    </div>
  );
}
