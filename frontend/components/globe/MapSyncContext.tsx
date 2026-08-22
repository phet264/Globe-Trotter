'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MapSyncContextType {
  hoveredCityId: string | null;
  setHoveredCityId: (id: string | null) => void;
  selectedCityId: string | null;
  setSelectedCityId: (id: string | null) => void;
}

const MapSyncContext = createContext<MapSyncContextType | undefined>(undefined);

export function MapSyncProvider({ children }: { children: ReactNode }) {
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  return (
    <MapSyncContext.Provider value={{ hoveredCityId, setHoveredCityId, selectedCityId, setSelectedCityId }}>
      {children}
    </MapSyncContext.Provider>
  );
}

export function useMapSync() {
  const context = useContext(MapSyncContext);
  if (context === undefined) {
    // Graceful fallback for components rendered outside the provider (e.g. error boundaries or isolated portals)
    return {
      hoveredCityId: null,
      setHoveredCityId: () => {},
      selectedCityId: null,
      setSelectedCityId: () => {}
    };
  }
  return context;
}
