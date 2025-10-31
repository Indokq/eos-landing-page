import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EOSLogo3D } from '../three/EOSLogo3D';
import { createUnblurEffect } from '../utils/scrollUpAnimations';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ 
      defaults: { ease: 'power3.out' },
      onComplete: () => console.log('Hero animations complete')
    });

    // Advanced keyframe animation for title
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        keyframes: [
          { opacity: 0, scale: 0.8, y: 30, duration: 0 },
          { opacity: 0.5, scale: 0.95, y: 15, duration: 0.4 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6 }
        ],
        delay: 0.3
      });

      // Unblur effect on scroll up
      createUnblurEffect('.hero-title', '.hero', 6);
    }

    // Timeline with callbacks
    if (subtitleRef.current) {
      tl.to(subtitleRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8 
      }, 0.9)
      .call(() => {
        console.log('Subtitle animation complete');
      });
    }

    // Advanced stagger from center with back ease
    if (pillsRef.current) {
      const pills = pillsRef.current.querySelectorAll('.benefit-pill');
      tl.to(pills, {
        opacity: 1,
        scale: 1,
        stagger: {
          each: 0.12,
          from: 'center',
          ease: 'back.out(1.7)'
        },
        duration: 0.6,
        ease: 'back.out(1.4)'
      }, '-=0.3');
    }

    // CTA buttons with bounce
    const ctaButtons = document.querySelectorAll('.hero-cta .cta-button');
    if (ctaButtons.length > 0) {
      tl.fromTo(ctaButtons,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: 'back.out(1.4)'
        },
        '-=0.2'
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        const triggerEl = trigger.vars.trigger;
        if (triggerEl === '.hero' || (typeof triggerEl === 'string' && triggerEl.includes('.hero'))) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <div className="hero-canvas">
        <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#60a5fa" />
          <EOSLogo3D />
        </Canvas>
      </div>

      <div className="hero-content">
        <div className="hero-badge">EOS ERP Solutions</div>
        
        <h1 ref={titleRef} className="hero-title">
          Solusi ERP yang cerdas dan hemat biaya
        </h1>

        <p ref={subtitleRef} className="hero-subtitle">
          untuk bisnis global di Indonesia
        </p>

        <div ref={pillsRef} className="hero-benefits-pills">
          <span className="benefit-pill">
            <span>Hemat Biaya</span>
          </span>
          <span className="benefit-pill">
            <span>Fleksibel</span>
          </span>
          <span className="benefit-pill">
            <span>Integrasi Mulus</span>
          </span>
          <span className="benefit-pill">
            <span>Multibahasa</span>
          </span>
        </div>

        <div className="hero-cta">
          <a href="#solutions" className="cta-button primary">
            Jelajahi Solusi
          </a>
          <a href="https://api.whatsapp.com/send?phone=628111170405" className="cta-button secondary">
            Hubungi Kami
          </a>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>
  );
};
