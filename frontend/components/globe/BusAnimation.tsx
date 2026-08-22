'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTravelTransition } from './TravelTransitionEngine';

interface BusAnimationProps {
  radius?: number;
}

export function BusAnimation({ radius = 2.01 }: BusAnimationProps) {
  const { state } = useTravelTransition();
  const busRef = useRef<THREE.Mesh>(null);
  const routeRef = useRef<THREE.Line>(null);

  const { origin, destination, status, type } = state;
  const isPlaying = status === 'PLAYING' && type === 'BUS';

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

    // Surface route - slightly less elevated than airplane
    const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(radius * 1.05);
    
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
    if (!isPlaying || !curve || !busRef.current) return;

    // Simulate 2s animation duration (bus is slower than plane)
    progressRef.current += delta / 2.0;

    if (progressRef.current > 1) {
      progressRef.current = 1;
    }

    const pos = curve.getPoint(progressRef.current);
    busRef.current.position.copy(pos);

    if (progressRef.current < 0.99) {
      const nextPos = curve.getPoint(progressRef.current + 0.01);
      busRef.current.lookAt(nextPos);
    }
  });

  React.useEffect(() => {
    progressRef.current = 0;
  }, [origin, destination]);

  if (!origin || !destination || type !== 'BUS' || status === 'IDLE' || status === 'CANCELLED') return null;

  return (
    <group>
      {lineGeometry && (
        <line ref={routeRef as any}>
          <primitive object={lineGeometry} attach="geometry" />
          <lineDashedMaterial color="#4CAF50" dashSize={0.05} gapSize={0.02} linewidth={3} opacity={0.8} transparent />
        </line>
      )}
      
      {/* Simple Bus Mesh */}
      <mesh ref={busRef}>
        <boxGeometry args={[0.04, 0.04, 0.08]} />
        <meshBasicMaterial color="#4CAF50" />
      </mesh>
    </group>
  );
}
