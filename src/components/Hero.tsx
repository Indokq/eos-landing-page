import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { EOSLogo3D } from '../three/EOSLogo3D';
import { EOSBackground3D } from '../three/EOSBackground3D';
import { SceneEnvironment } from '../three/SceneEnvironment';
import { FloatingMetallicObjects } from '../three/FloatingMetallicObjects';
import { useMouseParallax } from '../hooks/useMouseParallax';
import './Hero.css';

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mousePosition = useMouseParallax(0.1);

  useEffect(() => {
    // Track scroll progress for 3D scene
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, 1 - (rect.bottom / window.innerHeight)));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <div className="hero-canvas-fullscreen">
        <Canvas 
          camera={{ position: [0, 0, 6], fov: 75 }}
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]}
          onCreated={({ scene }) => {
            scene.background = new THREE.Color('#000000');
          }}
        >
          {/* Professional lighting and environment */}
          <SceneEnvironment />
          
          {/* Background gradient shader */}
          <EOSBackground3D mousePosition={mousePosition} scrollProgress={scrollProgress} />
          
          {/* Floating metallic objects */}
          <FloatingMetallicObjects mousePosition={mousePosition} scrollProgress={scrollProgress} />
          
          {/* Hero EOS logo */}
          <EOSLogo3D mousePosition={mousePosition} scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* Main website CTA button */}
      <div className="main-cta-wrapper">
        <a 
          href="https://eosteknologi.com/" 
          className="main-website-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Visit Main Website</span>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M5 12H19M19 12L12 5M19 12L12 19" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
};
