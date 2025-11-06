import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import type { FloatingObject, SceneProps, GeometryType, MaterialConfig } from './types';

export const FloatingMetallicObjects = ({ mousePosition }: SceneProps) => {
  const objectRefs = useRef<(THREE.Mesh | THREE.Group | null)[]>([]);

  // Generate objects in spherical distribution surrounding the text
  const objectConfigs: FloatingObject[] = useMemo(() => {
    const objects: FloatingObject[] = [];
    const objectCount = 60;
    const minRadius = 3;   // Inner shell radius (very close to text)
    const maxRadius = 7;   // Outer shell radius (tight cluster)
    
    const geometries: GeometryType[] = [
      'torus-knot', 'torus-knot', 'torus-knot', 'chrome-box', 'glass-tube',
      'cylinder', 'icosahedron', 'rounded-box', 'sphere', 'torus'
    ];
    
    const materials: MaterialConfig[] = [
      { type: 'chrome', color: '#e2e8f0', metalness: 1.0, roughness: 0.05, clearcoat: 1.0 },
      { type: 'glass', color: '#60a5fa', metalness: 0.0, roughness: 0.1, transmission: 0.9, thickness: 0.5, opacity: 0.8 },
      { type: 'brushed-metal', color: '#94a3b8', metalness: 0.9, roughness: 0.3, clearcoat: 0.5 },
      { type: 'glass', color: '#3b82f6', metalness: 0.0, roughness: 0.15, transmission: 0.85, thickness: 0.4, opacity: 0.75 },
      { type: 'chrome', color: '#cbd5e1', metalness: 1.0, roughness: 0.1, clearcoat: 1.0 },
    ];

    for (let i = 0; i < objectCount; i++) {
      // Random spherical coordinates for uniform 3D distribution
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const theta = Math.random() * Math.PI * 2;  // Azimuthal angle (0 to 2π)
      const phi = Math.acos(2 * Math.random() - 1); // Polar angle (0 to π)
      
      // Convert to Cartesian coordinates
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      objects.push({
        geometry: geometries[Math.floor(Math.random() * geometries.length)],
        position: [x, y, z],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ],
        scale: 0.5 + Math.random() * 0.8, // Random size 0.5-1.3
        material: materials[Math.floor(Math.random() * materials.length)],
        animationSpeed: { 
          x: 0.1 + Math.random() * 0.3,
          y: 0.1 + Math.random() * 0.3,
          z: 0.05 + Math.random() * 0.15
        },
        orbitSpeed: 0.05 + Math.random() * 0.1,
        orbitRadius: radius,
        orbitAngle: theta,
        orbitPhi: phi,
      });
    }
    
    return objects;
  }, []);

  // Render material based on config
  const renderMaterial = (config: MaterialConfig) => {
    if (config.type === 'glass') {
      return (
        <meshPhysicalMaterial
          color={config.color}
          metalness={config.metalness}
          roughness={config.roughness}
          transmission={config.transmission || 0.9}
          thickness={config.thickness || 0.5}
          clearcoat={1.0}
          ior={1.5}
          transparent={true}
          opacity={config.opacity || 0.8}
        />
      );
    }

    return (
      <meshPhysicalMaterial
        color={config.color}
        metalness={config.metalness}
        roughness={config.roughness}
        clearcoat={config.clearcoat || 0.5}
        clearcoatRoughness={0.1}
        reflectivity={1.0}
        envMapIntensity={config.type === 'chrome' ? 2.0 : 1.0}
      />
    );
  };

  // Render geometry based on type
  const renderGeometry = (type: GeometryType, scale: number) => {
    switch (type) {
      case 'chrome-box':
      case 'mini-box':
        return <boxGeometry args={[scale, scale, scale]} />;
      case 'torus-knot':
        return <torusKnotGeometry args={[scale * 0.5, scale * 0.15, 128, 32]} />;
      case 'glass-tube':
        return <cylinderGeometry args={[scale * 0.15, scale * 0.15, scale * 2, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[scale * 0.3, scale * 0.3, scale * 1.5, 32]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[scale * 0.6, 0]} />;
      case 'rounded-box':
        return null; // Will use RoundedBox component
      case 'glass-sphere':
      case 'sphere':
        return <sphereGeometry args={[scale * 0.5, 32, 32]} />;
      case 'torus':
        return <torusGeometry args={[scale * 0.5, scale * 0.2, 16, 32]} />;
      default:
        return <boxGeometry args={[scale, scale, scale]} />;
    }
  };

  // Orbital animation - spherical rotation around text
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    objectRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const config = objectConfigs[index];
      
      // Spherical orbital motion
      const newTheta = config.orbitAngle + time * config.orbitSpeed;
      
      // Add gentle drift in phi for smooth 3D motion
      const phiDrift = Math.sin(time * config.orbitSpeed * 0.5) * 0.15;
      const newPhi = config.orbitPhi + phiDrift;
      
      // Update position in 3D spherical coordinates
      const x = config.orbitRadius * Math.sin(newPhi) * Math.cos(newTheta);
      const y = config.orbitRadius * Math.sin(newPhi) * Math.sin(newTheta);
      const z = config.orbitRadius * Math.cos(newPhi);
      
      ref.position.set(x, y, z);
      
      // Rotation animation
      ref.rotation.x += config.animationSpeed.x * 0.01;
      ref.rotation.y += config.animationSpeed.y * 0.01;
      ref.rotation.z += config.animationSpeed.z * 0.005;
    });
  });

  return (
    <group>
      {objectConfigs.map((config, index) => {
        if (config.geometry === 'rounded-box') {
          return (
            <RoundedBox
              key={index}
              ref={(el) => {
                objectRefs.current[index] = el;
              }}
              args={[config.scale, config.scale, config.scale]}
              position={config.position}
              rotation={config.rotation}
              radius={0.1}
              smoothness={4}
            >
              {renderMaterial(config.material)}
            </RoundedBox>
          );
        }

        return (
          <mesh
            key={index}
            ref={(el) => {
              objectRefs.current[index] = el;
            }}
            position={config.position}
            rotation={config.rotation}
          >
            {renderGeometry(config.geometry, config.scale)}
            {renderMaterial(config.material)}
          </mesh>
        );
      })}
    </group>
  );
};
