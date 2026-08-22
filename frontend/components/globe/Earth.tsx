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
  const [colorMap, bumpMap, specularMap, cloudMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-day.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png',
    'https://unpkg.com/three-globe/example/img/earth-water.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ]);

  // Enhance texture sharpness and color resolution
  React.useEffect(() => {
    [colorMap, bumpMap, specularMap, cloudMap].forEach((tex) => {
      tex.anisotropy = 16;
    });
    colorMap.colorSpace = THREE.SRGBColorSpace;
  }, [colorMap, bumpMap, specularMap, cloudMap]);

  useFrame(() => {
    if (cloudsRef.current && mode === 'high') {
      cloudsRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <group>
      {/* 1. Base Earth Sphere - Using PBR Standard Material for realism */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.02}
          roughnessMap={specularMap}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>

      {/* 2. Cloud Layer (High quality only) */}
      {mode === 'high' && (
        <Sphere ref={cloudsRef} args={[2.02, 64, 64]}>
          <meshStandardMaterial
            map={cloudMap}
            transparent={true}
            opacity={0.4}
            blending={THREE.NormalBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </Sphere>
      )}

      {/* 3. Atmospheric Edge / Fresnel Rim Glow */}
      <Sphere args={[2.15, 64, 64]}>
        <meshBasicMaterial
          color="#4f8aff"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
      
      {/* 4. Inner Atmosphere Glow for softer edge */}
      <Sphere args={[2.05, 64, 64]}>
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </group>
  );
}
