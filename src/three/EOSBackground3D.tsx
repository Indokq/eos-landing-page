import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import type { SceneProps } from './types';

export const EOSBackground3D = ({ mousePosition }: SceneProps) => {
  const starsRef = useRef<THREE.Points>(null);

  // Create star cloud with Perlin noise
  const { starsGeometry, starsMaterial } = useMemo(() => {
    // Create star sprite texture
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d')!;
    
    // Outer glow
    context.globalAlpha = 0.3;
    context.filter = 'blur(16px)';
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(64, 64, 40, 0, 2 * Math.PI);
    context.fill();
    
    // Inner bright core
    context.globalAlpha = 1;
    context.filter = 'blur(7px)';
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(64, 64, 16, 0, 2 * Math.PI);
    context.fill();
    
    const texture = new THREE.CanvasTexture(canvas);

    const N = 10000; // Number of stars
    const perlin = new ImprovedNoise();
    
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const v = new THREE.Vector3();
    const c = new THREE.Color();
    
    let validStars = 0;
    
    for (let i = 0; i < N; i++) {
      // Create organic cloud shape using distorted sphere
      v.randomDirection().setLength(15 * Math.pow(Math.random(), 1/3));
      v.x = v.x * (1 + 0.4 * Math.sin(3 * v.y) + 0.4 * Math.sin(2 * v.z));
      v.y = v.y * (1 + 0.4 * Math.sin(3 * v.z) + 0.4 * Math.sin(2 * v.x));
      v.z = v.z * (1 + 0.4 * Math.sin(3 * v.x) + 0.4 * Math.sin(2 * v.y));
      
      // Skip stars in front of camera (positive Z) - camera is at z=6
      if (v.z > 3) {
        i--;
        continue;
      }
      
      // Use Perlin noise to create density variations (cloudy effect)
      const noise = perlin.noise(v.x * 0.1, v.y * 0.1, v.z * 0.1) +
                    perlin.noise(v.y * 0.1, v.z * 0.1, v.x * 0.1) +
                    perlin.noise(v.z * 0.1, v.x * 0.1, v.y * 0.1);
      
      // Skip this star if it's in a low-density area (creates clouds)
      if (noise < 0.3) {
        i--;
        continue;
      }
      
      positions[validStars * 3] = v.x;
      positions[validStars * 3 + 1] = v.y;
      positions[validStars * 3 + 2] = v.z;
      
      // Color variation - blues and whites
      c.setHSL(0.55 + 0.1 * Math.random(), 0.5 + 0.5 * Math.random(), 0.6 + 0.4 * Math.random());
      colors[validStars * 3] = c.r;
      colors[validStars * 3 + 1] = c.g;
      colors[validStars * 3 + 2] = c.b;
      
      validStars++;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      color: 'white',
      vertexColors: true,
      size: 0.3,
      sizeAttenuation: true,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
    });

    return { starsGeometry: geometry, starsMaterial: material };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Camera subtle movement
    state.camera.position.x = mousePosition.normalizedX * 0.5;
    state.camera.position.y = mousePosition.normalizedY * 0.5;
    state.camera.lookAt(0, 0, 0);
    
    // Slow organic rotation of star cloud
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.015;
      starsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
    }
  });

  return (
    <>
      <PerformanceMonitor>
        <AdaptiveDpr pixelated />
      </PerformanceMonitor>

      {/* Star field background */}
      <points ref={starsRef} geometry={starsGeometry} material={starsMaterial} />
      
      {/* Subtle blue ambient background plane */}
      <mesh position={[0, 0, -50]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};
