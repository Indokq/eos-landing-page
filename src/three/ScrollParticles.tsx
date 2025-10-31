import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ScrollParticlesProps {
  scrollVelocity: number;
  scrollDirection: 'up' | 'down' | null;
}

export const ScrollParticles = ({ scrollVelocity, scrollDirection }: ScrollParticlesProps) => {
  const particlesRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(0));
  const lifetimesRef = useRef<Float32Array>(new Float32Array(0));
  const particleCount = 100;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Initial positions (will be reset on burst)
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      // Blue color palette
      colors[i * 3] = 0.2 + Math.random() * 0.3; // R
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.3; // G
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1; // B

      // Initial velocities
      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = 0;

      // Lifetimes
      lifetimes[i] = 0;
    }

    velocitiesRef.current = velocities;
    lifetimesRef.current = lifetimes;

    return { positions, colors };
  }, [particleCount]);

  useEffect(() => {
    // Trigger particle burst when scrolling up fast
    if (scrollDirection === 'up' && scrollVelocity > 1.5) {
      triggerBurst();
    }
  }, [scrollVelocity, scrollDirection]);

  const triggerBurst = () => {
    if (!particlesRef.current || !velocitiesRef.current || !lifetimesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = velocitiesRef.current;
    const lifetimes = lifetimesRef.current;

    for (let i = 0; i < particleCount; i++) {
      // Start from center-bottom
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = -3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

      // Velocity upward with random spread
      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = 0.3 + Math.random() * 0.4; // Strong upward
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      // Random lifetime
      lifetimes[i] = 1.0 + Math.random() * 1.0;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  };

  useFrame((_state, delta) => {
    if (!particlesRef.current || !velocitiesRef.current || !lifetimesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = velocitiesRef.current;
    const lifetimes = lifetimesRef.current;

    for (let i = 0; i < particleCount; i++) {
      if (lifetimes[i] > 0) {
        // Update positions
        positions[i * 3] += velocities[i * 3] * delta * 10;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * 10;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * 10;

        // Apply gravity
        velocities[i * 3 + 1] -= delta * 0.5;

        // Decrease lifetime
        lifetimes[i] -= delta;

        // Keep particles above ground
        positions[i * 3 + 1] = Math.max(-10, positions[i * 3 + 1]);
      } else {
        // Hide dead particles
        positions[i * 3 + 1] = -100;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};
