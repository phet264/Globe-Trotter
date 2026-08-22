'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import gsap from 'gsap';

export type CameraFocusState = 'world' | 'country' | 'city';

interface CameraControllerProps {
  focusState: CameraFocusState;
  targetLat?: number;
  targetLng?: number;
  onUserInteraction?: () => void;
  reducedMotion: boolean;
}

export function CameraController({ 
  focusState, 
  targetLat, 
  targetLng, 
  onUserInteraction,
  reducedMotion 
}: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  // Helper to convert lat/lng to a 3D point on a sphere of given radius
  const getCoordinates = (lat: number, lng: number, radius: number = 2) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    if (!controlsRef.current) return;

    if (focusState === 'world' || targetLat === undefined || targetLng === undefined) {
      // Zoom out to world view
      if (!reducedMotion) {
        gsap.to(camera.position, {
          x: 0, y: 0, z: 6,
          duration: 1.5,
          ease: 'power3.inOut'
        });
        gsap.to(controlsRef.current.target, {
          x: 0, y: 0, z: 0,
          duration: 1.5,
          ease: 'power3.inOut'
        });
      } else {
        camera.position.set(0, 0, 6);
        controlsRef.current.target.set(0, 0, 0);
      }
    } else {
      // Zoom in to specific lat/lng
      // We calculate a point slightly above the surface for the camera
      const distance = focusState === 'country' ? 3.5 : 2.5;
      const targetPos = getCoordinates(targetLat, targetLng, distance);
      
      if (!reducedMotion) {
        gsap.to(camera.position, {
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z,
          duration: 1.5,
          ease: 'power3.inOut'
        });
      } else {
        camera.position.copy(targetPos);
      }
    }
  }, [focusState, targetLat, targetLng, camera.position, reducedMotion]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      minDistance={2.1}
      maxDistance={6}
      enablePan={false}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      onChange={() => {
        // If the user manually drags the globe, we can pause auto-rotation or reset states
        onUserInteraction?.();
      }}
    />
  );
}
