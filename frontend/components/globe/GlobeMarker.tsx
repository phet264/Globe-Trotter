'use client';

import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { useGlobePerformance } from '@/lib/three/useGlobePerformance';

export interface MarkerData {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  type?: 'major' | 'minor'; // Hierarchy
}

interface GlobeMarkerProps {
  data: MarkerData;
  radius: number;
  isActive?: boolean;
  onClick?: (id: string) => void;
}

export function GlobeMarker({ data, radius, isActive, onClick }: GlobeMarkerProps) {
  const { reducedMotion, mode } = useGlobePerformance();
  const [hovered, setHovered] = useState(false);

  if (mode === 'low' && data.type === 'minor') return null; // Occlude minor cities on low performance

  // Convert lat/lng to 3D Cartesian coordinates
  const phi = (90 - data.lat) * (Math.PI / 180);
  const theta = (data.lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  const isMajor = data.type === 'major';
  const size = isMajor ? 0.025 : 0.015;

  return (
    <group position={[x, y, z]}>
      {/* Interactive Core */}
      <mesh 
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(data.id);
        }}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={isActive || hovered ? "#ffffff" : (isMajor ? "#60a5fa" : "#94a3b8")} />
      </mesh>

      {/* Subtle Halo for active or major items */}
      {(isActive || (isMajor && !reducedMotion)) && (
        <mesh>
          <ringGeometry args={[size * 1.5, size * 1.8, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={isActive ? 0.8 : 0.3} side={2} />
        </mesh>
      )}

      {/* HTML Tooltip (Only show if hovered or active to reduce clutter) */}
      <Html distanceFactor={15} center style={{ pointerEvents: 'none', opacity: hovered || isActive ? 1 : 0, transition: 'opacity 0.2s' }}>
        <div className={`flex flex-col items-center bg-background/90 backdrop-blur-sm border ${isActive ? 'border-primary' : 'border-border'} rounded-lg shadow-xl px-3 py-2 transform -translate-y-8 animate-in zoom-in-95`}>
          <span className={`text-sm font-semibold whitespace-nowrap ${isActive ? 'text-primary' : ''}`}>{data.city}</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{data.country}</span>
        </div>
      </Html>
    </group>
  );
}
