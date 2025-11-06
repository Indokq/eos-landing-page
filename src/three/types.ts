export type GeometryType = 
  | 'chrome-box' 
  | 'torus-knot' 
  | 'glass-tube' 
  | 'cylinder' 
  | 'icosahedron' 
  | 'rounded-box'
  | 'glass-sphere'
  | 'mini-box'
  | 'sphere'
  | 'torus';

export type MaterialType = 'chrome' | 'glass' | 'brushed-metal';

export interface MaterialConfig {
  type: MaterialType;
  color: string;
  metalness: number;
  roughness: number;
  clearcoat?: number;
  transmission?: number;
  thickness?: number;
  opacity?: number;
}

export interface FloatingObject {
  geometry: GeometryType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  material: MaterialConfig;
  animationSpeed: { x: number; y: number; z: number };
  orbitSpeed: number;
  orbitRadius: number;
  orbitAngle: number;
  orbitPhi: number;
}

export interface MousePosition {
  normalizedX: number;
  normalizedY: number;
}

export interface SceneProps {
  mousePosition: MousePosition;
  scrollProgress?: number;
}
