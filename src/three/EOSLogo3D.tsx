import { useMemo, Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import type { SceneProps } from './types';

// Text component with TextGeometry
const EOSText = () => {
  const font = useLoader(FontLoader, '/fonts/helvetiker_bold.typeface.json');
  
  const textGeometry = useMemo(() => {
    if (!font) return null;
    
    const geometry = new TextGeometry('EOS', {
      font,
      size: 2.5,
      depth: 0.5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    
    geometry.center();
    geometry.computeBoundingBox();
    
    return geometry;
  }, [font]);

  if (!textGeometry) return null;

  return (
    <mesh geometry={textGeometry}>
      {/* Metallic Material with visible color */}
      <meshStandardMaterial
        color="#3b82f6"
        metalness={0.7}
        roughness={0.3}
      />
    </mesh>
  );
};

export const EOSLogo3D = (_props: SceneProps) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Main EOS Text with TextGeometry */}
      <Suspense fallback={null}>
        <EOSText />
      </Suspense>
    </group>
  );
};
