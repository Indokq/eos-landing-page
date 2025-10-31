import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

export const EOSLogo3D = () => {
  const logoRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (logoRef.current) {
      // Slow elegant rotation
      logoRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      logoRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });
  
  return (
    <group ref={logoRef} position={[0, 0, 0]}>
      <Center>
        {/* Main EOS Text */}
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
          size={1.5}
          height={0.3}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          EOS
          <meshStandardMaterial
            color="#60a5fa"
            metalness={0.9}
            roughness={0.1}
            emissive="#3b82f6"
            emissiveIntensity={0.3}
          />
        </Text3D>
      </Center>
      
      {/* Glow ring behind */}
      <mesh ref={ringRef} position={[0, 0, -0.8]}>
        <torusGeometry args={[2.5, 0.08, 16, 100]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#60a5fa"
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Secondary ring */}
      <mesh position={[0, 0, -1]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[2.8, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Ambient particles */}
      <mesh position={[0, 0, -1.5]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.05}
          wireframe
        />
      </mesh>
    </group>
  );
};
