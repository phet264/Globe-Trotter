'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <meshStandardMaterial
        color="#001833"
        wireframe
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
}

export default function Globe() {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <GlobeMesh />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
