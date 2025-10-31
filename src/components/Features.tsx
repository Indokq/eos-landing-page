import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextToLetters } from '../utils/textSplit';
import { createFloatingAnimation, staggerPresets } from '../utils/gsapAdvanced';
import { createWaveReveal, createUnblurEffect, createStaggeredReveal } from '../utils/scrollUpAnimations';
import './Features.css';

gsap.registerPlugin(ScrollTrigger);

export const Features = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll('.letter');
      gsap.fromTo(
        letters,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.02,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        }
      );
    }

    if (featuresRef.current) {
      const items = Array.from(featuresRef.current.querySelectorAll('.feature-item'));
      
      // Advanced stagger from center
      gsap.fromTo(items,
        {
          opacity: 0,
          scale: 0.5,
          rotation: -5
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: {
            each: 0.2,
            ...staggerPresets.center
          },
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Floating animation with infinite repeat
      items.forEach((item, i) => {
        createFloatingAnimation(item, -10, 2 + (i * 0.2), i * 0.3);
      });
    }

    // Wave reveal effect when scrolling up
    createWaveReveal('.feature-item', '.features');

    // Unblur effect for title when scrolling up
    createUnblurEffect('.features-title', '.features', 5);

    // Staggered reveal with enhanced scroll-up
    createStaggeredReveal('.feature-item', '.features', 0.15);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        const triggerEl = trigger.vars.trigger;
        if (triggerEl === '.features' || (typeof triggerEl === 'string' && triggerEl.includes('.feature'))) {
          trigger.kill();
        }
      });
    };
  }, []);

  const title = "F i t u r   U t a m a";
  const titleLetters = splitTextToLetters(title);

  return (
    <section className="features" id="features">
      <div className="features-container">
        <div className="features-label">私たちのフィーチャーをご覧ください！</div>
        
        <h2 ref={titleRef} className="features-title">
          {titleLetters.map((item) => (
            <span key={item.index} className="letter">
              {item.char}
            </span>
          ))}
        </h2>

        <div ref={featuresRef} className="features-list">
          <div className="feature-item">
            <div className="feature-number">01</div>
            <div className="feature-content">
              <h3 className="feature-name">ERP (Enterprise Resource Planning)</h3>
              <p className="feature-description">
                MRP, Auto Scheduler, APS - Sistem perencanaan sumber daya terintegrasi 
                untuk manufaktur dengan scheduling otomatis dan advanced planning system.
              </p>
              <div className="feature-tags">
                <span className="tag">MRP</span>
                <span className="tag">Scheduler</span>
                <span className="tag">APS</span>
              </div>
            </div>
            <div className="feature-visual">
              <div className="visual-box"></div>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-number">02</div>
            <div className="feature-content">
              <h3 className="feature-name">Host to Host Ceisa 4.0</h3>
              <p className="feature-description">
                Interface secara Real-Time sesuai ketentuan Bea dan Cukai untuk PIB, PEB, TPB. 
                Integrasi langsung dengan sistem kepabeanan Indonesia.
              </p>
              <div className="feature-tags">
                <span className="tag">PIB</span>
                <span className="tag">PEB</span>
                <span className="tag">TPB</span>
                <span className="tag">Real-Time</span>
              </div>
            </div>
            <div className="feature-visual">
              <div className="visual-box"></div>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-number">03</div>
            <div className="feature-content">
              <h3 className="feature-name">Subcon Management System</h3>
              <p className="feature-description">
                Manajemen Jasa Maklon sesuai ketentuan beacukai, perhitungan bea masuk import, 
                HS Code, dan tracking subkontraktor lengkap.
              </p>
              <div className="feature-tags">
                <span className="tag">Subcon</span>
                <span className="tag">HS Code</span>
                <span className="tag">Customs</span>
              </div>
            </div>
            <div className="feature-visual">
              <div className="visual-box"></div>
            </div>
          </div>
        </div>

        <div className="features-cta">
          <a href="https://api.whatsapp.com/send?phone=628111170405" className="features-button">
            Cari Solusi?
          </a>
        </div>
      </div>
    </section>
  );
};
