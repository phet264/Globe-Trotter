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
  const [colorMap, bumpMap, specularMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png',
    'https://unpkg.com/three-globe/example/img/earth-water.png'
  ]);

  useFrame(() => {
    if (cloudsRef.current && mode === 'high') {
      cloudsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <group>
      {/* 1. Base Earth Sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshPhongMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.015}
          specularMap={specularMap}
          specular={new THREE.Color('grey')}
          shininess={15}
        />
      </Sphere>

      {/* 2. Cloud Layer (High quality only) */}
      {mode === 'high' && (
        <Sphere ref={cloudsRef} args={[2.02, 64, 64]}>
          <meshPhongMaterial
            map={bumpMap} // A simple trick to use topology map as clouds for an artistic look, or ideally a cloud map
            transparent={true}
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </Sphere>
      )}

      {/* 3. Atmospheric Edge / Fresnel Rim Glow */}
      <Sphere args={[2.08, 64, 64]}>
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </group>
  );
}
