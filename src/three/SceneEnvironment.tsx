export const SceneEnvironment = () => {
  return (
    <>
      {/* Front RectAreaLight - Main logo illumination */}
      <rectAreaLight
        position={[0, 0, 8]}
        width={10}
        height={6}
        intensity={5}
        color="#ffffff"
      />
      
      {/* Additional RectAreaLight from top */}
      <rectAreaLight
        position={[0, 5, 3]}
        rotation={[-Math.PI / 3, 0, 0]}
        width={8}
        height={8}
        intensity={3}
        color="#e0f2fe"
      />

      {/* Key Light - Main illumination */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2} 
        color="#ffffff"
        castShadow
      />

      {/* Fill Light - Soften shadows */}
      <directionalLight 
        position={[-8, 5, 8]} 
        intensity={1.5} 
        color="#dbeafe"
      />

      {/* Ambient base */}
      <ambientLight intensity={0.8} />

      {/* Point lights for dynamic accents */}
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#60a5fa" />
      <pointLight position={[10, -5, 0]} intensity={0.4} color="#3b82f6" />

      {/* Subtle fog for depth */}
      <fog attach="fog" args={['#000000', 10, 50]} />
    </>
  );
};
