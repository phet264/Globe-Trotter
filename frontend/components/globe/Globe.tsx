'use client';

import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { GlobeFallback } from './GlobeFallback';
import { useGlobePerformance } from '@/lib/three/useGlobePerformance';
import { Earth } from './Earth';
import { Countries } from './Countries';
import { CameraController, CameraFocusState } from './CameraController';
import { GlobeMarker, MarkerData } from './GlobeMarker';
import { TravelRoutes } from './TravelRoutes';

// Mock destinations with hierarchy
const DEFAULT_DESTINATIONS: MarkerData[] = [
  { id: '1', city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, type: 'major' },
  { id: '2', city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, type: 'major' },
  { id: '3', city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, type: 'major' },
  { id: '4', city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, type: 'major' },
  { id: '5', city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, type: 'major' },
  { id: '6', city: 'Lyon', country: 'France', lat: 45.7640, lng: 4.8357, type: 'minor' }
];

// Mock travel routes
const DEFAULT_ROUTES = [
  { id: 'r1', startLat: 40.7128, startLng: -74.0060, endLat: 48.8566, endLng: 2.3522, type: 'flight' as const },
  { id: 'r2', startLat: 48.8566, startLng: 2.3522, endLat: 45.7640, endLng: 4.8357, type: 'bus' as const }
];

interface GlobeProps {
  markers?: MarkerData[];
  routes?: any[];
  focusedLocation?: { lat: number; lng: number } | null;
  interactive?: boolean;
}

export default function Globe({ 
  markers = DEFAULT_DESTINATIONS, 
  routes = DEFAULT_ROUTES,
  focusedLocation = null,
  interactive = true 
}: GlobeProps) {
  const { dpr, mode, reducedMotion } = useGlobePerformance();
  const [internalFocusState, setInternalFocusState] = useState<CameraFocusState>('world');
  const [internalActiveTarget, setInternalActiveTarget] = useState<{lat: number, lng: number} | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  // If a focusedLocation is provided via props (e.g. during trip creation), use it.
  const activeTarget = focusedLocation || internalActiveTarget;
  const focusState = focusedLocation ? 'city' : internalFocusState;

  // Handle clicking a marker
  const handleMarkerClick = useCallback((id: string) => {
    if (!interactive) return;
    const dest = markers.find(d => d.id === id);
    if (dest) {
      setActiveMarkerId(id);
      setInternalActiveTarget({ lat: dest.lat, lng: dest.lng });
      setInternalFocusState('city');
    }
  }, [markers, interactive]);

  // When user drags, revert to world state to allow free rotation
  const handleUserInteraction = useCallback(() => {
    if (focusState !== 'world') {
      setInternalFocusState('world');
      setActiveMarkerId(null);
    }
  }, [focusState]);

  if (mode === 'no-webgl') {
    return <GlobeFallback message="Interactive globe unavailable" />;
  }

  return (
    <div className={`w-full h-full relative ${interactive ? 'cursor-grab active:cursor-grabbing' : ''}`}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }} 
        dpr={dpr}
        gl={{ antialias: mode === 'high', alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#4f46e5" />
        
        <React.Suspense fallback={null}>
          <group>
            {/* The Earth Surface and Atmosphere */}
            <Earth />
            
            {/* Country Borders (GeoJSON/Graticule) */}
            <Countries />
            
            {/* Travel Routes */}
            <TravelRoutes routes={routes} />
            
            {/* Destination Markers */}
            {markers.map(dest => (
              <GlobeMarker 
                key={dest.id} 
                data={dest} 
                radius={2.02} 
                isActive={activeMarkerId === dest.id}
                onClick={handleMarkerClick}
              />
            ))}
          </group>
        </React.Suspense>
        
        {/* State-driven Camera Controller */}
        <CameraController 
          focusState={focusState}
          targetLat={activeTarget?.lat}
          targetLng={activeTarget?.lng}
          onUserInteraction={handleUserInteraction}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
