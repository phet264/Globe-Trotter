'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

export type TransitionType = 'AIRPLANE' | 'BUS' | 'WALKING';
export type TransitionStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface LocationInfo {
  id: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
}

export interface TransitionState {
  status: TransitionStatus;
  origin: LocationInfo | null;
  destination: LocationInfo | null;
  type: TransitionType | null;
}

interface TravelTransitionContextType {
  state: TransitionState;
  startTransition: (origin: LocationInfo, destination: LocationInfo, sameCountry: boolean, isNearbyActivity: boolean) => void;
  pauseTransition: () => void;
  resumeTransition: () => void;
  skipTransition: () => void;
  cancelTransition: () => void;
  completeTransition: () => void;
}

const TravelTransitionContext = createContext<TravelTransitionContextType | null>(null);

export function TravelTransitionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TransitionState>({
    status: 'IDLE',
    origin: null,
    destination: null,
    type: null,
  });

  const startTransition = useCallback((origin: LocationInfo, destination: LocationInfo, sameCountry: boolean, isNearbyActivity: boolean) => {
    let type: TransitionType = 'AIRPLANE';
    if (isNearbyActivity) {
      type = 'WALKING';
    } else if (sameCountry) {
      type = 'BUS';
    }

    setState({
      status: 'PLAYING',
      origin,
      destination,
      type,
    });
  }, []);

  const pauseTransition = useCallback(() => {
    setState((prev) => (prev.status === 'PLAYING' ? { ...prev, status: 'PAUSED' } : prev));
  }, []);

  const resumeTransition = useCallback(() => {
    setState((prev) => (prev.status === 'PAUSED' ? { ...prev, status: 'PLAYING' } : prev));
  }, []);

  const skipTransition = useCallback(() => {
    setState((prev) => (prev.status !== 'IDLE' ? { ...prev, status: 'COMPLETED' } : prev));
  }, []);

  const cancelTransition = useCallback(() => {
    setState({
      status: 'CANCELLED',
      origin: null,
      destination: null,
      type: null,
    });
    
    // Reset back to idle after a tiny delay so subscribers can catch the cancellation
    setTimeout(() => {
      setState((prev) => (prev.status === 'CANCELLED' ? { status: 'IDLE', origin: null, destination: null, type: null } : prev));
    }, 100);
  }, []);

  const completeTransition = useCallback(() => {
    setState({
      status: 'IDLE',
      origin: null,
      destination: null,
      type: null,
    });
  }, []);

  return (
    <TravelTransitionContext.Provider
      value={{
        state,
        startTransition,
        pauseTransition,
        resumeTransition,
        skipTransition,
        cancelTransition,
        completeTransition
      }}
    >
      {children}
    </TravelTransitionContext.Provider>
  );
}

export function useTravelTransition() {
  const context = useContext(TravelTransitionContext);
  if (!context) {
    throw new Error('useTravelTransition must be used within a TravelTransitionProvider');
  }
  return context;
}
