'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTravelTransition } from './TravelTransitionEngine';

interface AirplaneAnimationProps {
  radius?: number;
}

export function AirplaneAnimation({ radius = 2.05 }: AirplaneAnimationProps) {
  const { state } = useTravelTransition();
  const airplaneRef = useRef<THREE.Mesh>(null);
  const routeRef = useRef<THREE.Line>(null);

  const { origin, destination, status, type } = state;
  const isPlaying = status === 'PLAYING' && type === 'AIRPLANE';

  // Compute curve when origin and destination change
  const curve = useMemo(() => {
    if (!origin || !destination) return null;

    const start = new THREE.Vector3().setFromSphericalCoords(
      radius,
      THREE.MathUtils.degToRad(90 - origin.lat),
      THREE.MathUtils.degToRad(origin.lng)
    );
    const end = new THREE.Vector3().setFromSphericalCoords(
      radius,
      THREE.MathUtils.degToRad(90 - destination.lat),
      THREE.MathUtils.degToRad(destination.lng)
    );

    // Quadratic bezier curve point for the arc
    const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(radius * 1.2);
    
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [origin, destination, radius]);

  const points = useMemo(() => {
    if (!curve) return [];
    return curve.getPoints(50);
  }, [curve]);

  const lineGeometry = useMemo(() => {
    if (!points.length) return null;
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  const progressRef = useRef(0);

  useFrame((_, delta) => {
    if (!isPlaying || !curve || !airplaneRef.current) return;

    // Simulate 1.5s animation duration
    progressRef.current += delta / 1.5;

    if (progressRef.current > 1) {
      progressRef.current = 1; // End of path
    }

    // Get position on curve
    const pos = curve.getPoint(progressRef.current);
    airplaneRef.current.position.copy(pos);

    // Look ahead to rotate airplane
    if (progressRef.current < 0.99) {
      const nextPos = curve.getPoint(progressRef.current + 0.01);
      airplaneRef.current.lookAt(nextPos);
    }
  });

  // Reset progress when origin changes
  React.useEffect(() => {
    progressRef.current = 0;
  }, [origin, destination]);

  if (!origin || !destination || type !== 'AIRPLANE' || status === 'IDLE' || status === 'CANCELLED') return null;

  return (
    <group>
      {lineGeometry && (
        <line ref={routeRef}>
          <primitive object={lineGeometry} attach="geometry" />
          <lineBasicMaterial color="#ffffff" opacity={0.5} transparent linewidth={2} />
        </line>
      )}
      
      {/* Simple Airplane Mesh (Fallback) */}
      <mesh ref={airplaneRef}>
        <coneGeometry args={[0.02, 0.08, 8]} />
        <meshBasicMaterial color="#FF6B6B" />
      </mesh>
    </group>
  );
}
