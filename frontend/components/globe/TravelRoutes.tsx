'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { useGlobePerformance } from '@/lib/three/useGlobePerformance';

interface RouteData {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  type: 'flight' | 'bus' | 'walking';
}

interface TravelRoutesProps {
  routes: RouteData[];
}

export function TravelRoutes({ routes }: TravelRoutesProps) {
  const { mode, reducedMotion } = useGlobePerformance();

  const getCoordinates = (lat: number, lng: number, radius: number = 2) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  const curves = useMemo(() => {
    return routes.map(route => {
      const start = getCoordinates(route.startLat, route.startLng);
      const end = getCoordinates(route.endLat, route.endLng);
      
      // Calculate mid point for the bezier curve arc
      const mid = start.clone().lerp(end, 0.5);
      const distance = start.distanceTo(end);
      
      // Higher arc for flights, lower for bus/walking
      const arcHeight = route.type === 'flight' ? distance * 0.4 : distance * 0.1;
      mid.normalize().multiplyScalar(2 + arcHeight);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      return { route, curve, points: curve.getPoints(50) };
    });
  }, [routes]);

  if (mode === 'low' || mode === 'no-webgl') return null;

  return (
    <group>
      {curves.map(({ route, curve, points }) => (
        <group key={route.id}>
          {/* Arc Line */}
          <Line
            points={points}
            color={route.type === 'flight' ? "#60a5fa" : "#34d399"}
            lineWidth={1.5}
            transparent
            opacity={0.6}
            dashed={route.type !== 'flight'}
            dashScale={50}
            dashSize={1}
            dashOffset={0}
          />
          {/* Animated Vehicle (simplified as a glowing dot that moves along the curve) */}
          {!reducedMotion && (
            <AnimatedVehicle curve={curve} color={route.type === 'flight' ? "#ffffff" : "#a7f3d0"} />
          )}
        </group>
      ))}
    </group>
  );
}

function AnimatedVehicle({ curve, color }: { curve: THREE.QuadraticBezierCurve3, color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    // Slow down the speed based on time
    const t = (clock.getElapsedTime() * 0.1) % 1;
    
    // Get position on curve
    const position = curve.getPointAt(t);
    meshRef.current.position.copy(position);
    
    // Get tangent for rotation (makes the vehicle point forward)
    // In a full implementation, we'd use lookAt, but for a point it's fine
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.015, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
