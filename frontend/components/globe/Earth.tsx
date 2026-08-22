'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import { useGlobePerformance } from '@/lib/three/useGlobePerformance';

export function Earth() {
  const { mode } = useGlobePerformance();
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Load high-res textures for the Earth
  // Using reliable public CDNs for earth textures
  const [colorMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-day.jpg'
  ]);

  // Enhance texture sharpness and color resolution
  React.useEffect(() => {
    colorMap.anisotropy = 16;
    colorMap.colorSpace = THREE.SRGBColorSpace;
  }, [colorMap]);

  useFrame(() => {
    if (cloudsRef.current && mode === 'high') {
      cloudsRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <group>
      {/* 1. Base Earth Sphere - Using PBR Standard Material for realism */}
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial
          map={colorMap}
        />
      </Sphere>

    </group>
  );
}
