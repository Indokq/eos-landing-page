import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EOSLogo3D } from '../three/EOSLogo3D';
import { createUnblurEffect } from '../utils/scrollUpAnimations';
import { 
  splitTextIntoChars,
  splitTextAdvanced,
  scrambleTextAdvanced,
  createMaskReveal,
  createWaveScrollEffect,
  wrapInMask,
  prefersReducedMotion 
} from '../utils/textAnimations';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const reducedMotion = prefersReducedMotion();
    
    if (reducedMotion) {
      // Simple fade-in animation for accessibility
      gsap.to([titleRef.current, subtitleRef.current, badgeRef.current], {
        opacity: 1,
        duration: 0.6,
        stagger: 0.2
      });
      return;
    }

    // Create master timeline with labels for precise control
    const masterTimeline = gsap.timeline({ 
      defaults: { ease: 'power3.out' },
    });

    // Add timeline labels
    masterTimeline.addLabel('badge', 0);
    masterTimeline.addLabel('title', 0.5);
    masterTimeline.addLabel('subtitle', 1.6);
    masterTimeline.addLabel('pills', 2.1);
    masterTimeline.addLabel('cta', 2.6);

    // BADGE SCRAMBLE ANIMATION (Nested Timeline)
    if (badgeRef.current) {
      const originalText = badgeRef.current.textContent || 'EOS ERP Solutions';
      
      const badgeTimeline = gsap.timeline();
      
      // Use gsap.set for better performance
      gsap.set(badgeRef.current, { 
        opacity: 1,
        scale: 0,
        force3D: true
      });
      
      // Scale in with back ease
      badgeTimeline.to(badgeRef.current, {
        scale: 1,
        duration: 0.4,
        ease: 'back.out(2)'
      });
      
      // Then add scramble effect
      badgeTimeline.add(() => {
        scrambleTextAdvanced(badgeRef.current!, originalText, {
          duration: 1.2,
          speed: 1.2,
          chars: 'XO10▓█░▒ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          revealDelay: 0.04,
          wave: true
        });
      });
      
      masterTimeline.add(badgeTimeline, 'badge');
    }

    // TITLE: KEYFRAME CHARACTER ANIMATION (Nested Timeline)
    if (titleRef.current) {
      const titleChars = splitTextIntoChars(titleRef.current, 'char');
      
      const titleTimeline = gsap.timeline();
      
      // Use gsap.set for better performance
      gsap.set(titleChars, {
        opacity: 0,
        y: 100,
        rotation: () => gsap.utils.random(-10, 10),
        scale: 0.5,
        force3D: true,
        willChange: 'transform, opacity'
      });

      // Advanced keyframe animation with overshoot
      titleTimeline.to(titleChars, {
        keyframes: {
          y: [100, -20, 10, 0],           // Overshoot and settle
          rotation: [-10, 5, -2, 0],       // Natural swing
          scale: [0.5, 1.2, 0.95, 1],     // Elastic scaling
          opacity: [0, 1, 1, 1],
          easeEach: 'power2.inOut'
        },
        stagger: {
          each: 0.03,
          from: 'center',
          ease: 'sine.inOut'
        },
        duration: 1.2
      });

      masterTimeline.add(titleTimeline, 'title');

      // Add scroll-triggered wave effect
      if (heroRef.current) {
        createWaveScrollEffect(titleChars, {
          triggerElement: heroRef.current,
          start: 'top center',
          end: 'bottom top',
          scrub: 0.5
        });
      }

      // Add unblur effect on scroll
      createUnblurEffect('.hero-title', '.hero', 6);
    }

    // SUBTITLE: WORD-BY-WORD MASKED REVEAL (Nested Timeline)
    if (subtitleRef.current) {
      const { words } = splitTextAdvanced(subtitleRef.current, {
        types: ['words'],
        wordClass: 'word'
      });
      
      const subtitleTimeline = gsap.timeline();
      
      // Create mask for each word
      createMaskReveal(words, 'word-mask');
      
      // Use gsap.set for initial state
      gsap.set(words, {
        yPercent: 120,
        rotation: 5,
        opacity: 0,
        force3D: true
      });

      // Animate words with mask reveal
      subtitleTimeline.to(words, {
        yPercent: 0,
        rotation: 0,
        opacity: 1,
        stagger: {
          each: 0.08,
          from: 'start'
        },
        duration: 0.8,
        ease: 'power3.out'
      });

      masterTimeline.add(subtitleTimeline, 'subtitle');
    }

    // PILLS: GRID STAGGER + FLIP + COLOR MORPH (Nested Timeline)
    if (pillsRef.current) {
      const pills = Array.from(pillsRef.current.querySelectorAll('.benefit-pill'));
      
      const pillsTimeline = gsap.timeline();
      
      // Wrap each pill in mask
      pills.forEach((pill) => {
        const span = pill.querySelector('span');
        if (span instanceof HTMLElement) {
          wrapInMask(span);
        }
      });

      // Use gsap.set for initial state
      gsap.set(pills, {
        opacity: 0,
        scale: 0.5,
        rotationY: -90,
        force3D: true
      });

      // Animate with grid stagger and flip
      pillsTimeline.to(pills, {
        opacity: 1,
        scale: 1,
        rotationY: 360,
        stagger: {
          each: 0.08,
          from: 'start',
          grid: [2, 2],      // 2x2 grid (4 pills)
          axis: 'x',         // Stagger along X first
          ease: 'circ.inOut'
        },
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        // Color morph during animation
        onUpdate: function() {
          const progress = this.progress();
          pills.forEach((pill) => {
            const hue = 200 + (progress * 40); // Blue to cyan
            (pill as HTMLElement).style.borderColor = `hsl(${hue}, 70%, 60%)`;
          });
        }
      });

      // Nested animation for masked content
      const maskedContent = pillsRef.current.querySelectorAll('.pill-mask span');
      gsap.set(maskedContent, { y: '100%', force3D: true });
      
      pillsTimeline.to(maskedContent, {
        y: '0%',
        stagger: {
          each: 0.08,
          from: 'center'
        },
        duration: 0.6,
        ease: 'power3.out'
      }, '<0.3'); // Overlap by 0.3s

      masterTimeline.add(pillsTimeline, 'pills');
    }

    // CTA BUTTONS WITH BOUNCE AND SHADOW PULSE
    if (ctaRef.current) {
      const buttons = ctaRef.current.querySelectorAll('.cta-button');
      
      gsap.set(buttons, { opacity: 0, y: 30, scale: 0.9 });
      
      masterTimeline.to(buttons, {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.15,
        duration: 0.7,
        ease: 'elastic.out(1, 0.6)'
      }, 2.2);

      // Add continuous shadow pulse
      gsap.to(buttons, {
        boxShadow: '0 20px 60px rgba(96, 165, 250, 0.5)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // Cleanup
    return () => {
      masterTimeline.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        const triggerEl = trigger.vars.trigger;
        if (triggerEl === heroRef.current || 
            (typeof triggerEl === 'string' && triggerEl.includes('.hero'))) {
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
        <div ref={badgeRef} className="hero-badge scramble-text">
          EOS ERP Solutions
        </div>
        
        <div className="hero-title-wrapper">
          <h1 ref={titleRef} className="hero-title">
            Solusi ERP yang cerdas dan<br />hemat biaya
          </h1>
        </div>

      

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

        <div ref={ctaRef} className="hero-cta">
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
