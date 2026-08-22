'use client';

import React from 'react';
import { useTravelTransition } from '@/components/globe/TravelTransitionEngine';
import { Button } from '@/components/ui/button';

export function JourneyControls() {
  const { state, pauseTransition, resumeTransition, skipTransition, cancelTransition } = useTravelTransition();

  if (state.status === 'IDLE' || state.status === 'CANCELLED' || state.status === 'COMPLETED') {
    return null;
  }

  const isPlaying = state.status === 'PLAYING';

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/20 z-50">
      <div className="flex flex-col items-center mr-4 hidden sm:flex">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Traveling</span>
        <span className="text-sm font-bold text-slate-900">
          {state.origin?.city} → {state.destination?.city}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={isPlaying ? pauseTransition : resumeTransition}
          className="rounded-full h-10 w-10 hover:bg-slate-100"
        >
          {isPlaying ? '⏸' : '▶'}
        </Button>
        <Button 
          variant="outline" 
          onClick={skipTransition}
          className="rounded-full h-10 px-4 text-sm font-medium hover:bg-slate-100"
        >
          Skip
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={cancelTransition}
          className="rounded-full h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          ✕
        </Button>
      </div>
    </div>
  );
}
