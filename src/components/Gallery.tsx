import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextToLetters } from '../utils/textSplit';
import { createScrollBatch, createParallax } from '../utils/gsapAdvanced';
import { createFlipBackEffect, createUnblurEffect } from '../utils/scrollUpAnimations';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

export const Gallery = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

    // Advanced ScrollTrigger.batch for coordinated animations
    createScrollBatch('.gallery-card', {
      interval: 0.1,
      batchMax: 4,
      onEnter: (batch) => {
        gsap.fromTo(batch, 
          { 
            opacity: 0, 
            y: 100,
            scale: 0.8,
            rotationX: -15
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            stagger: {
              each: 0.15,
              from: 'start',
              ease: 'back.out(1.4)'
            },
            duration: 1.2,
            ease: 'power3.out',
            clearProps: 'all'
          }
        );
      },
      onLeave: (batch) => {
        gsap.to(batch, { opacity: 0.5, scale: 0.95, duration: 0.3 });
      },
      onEnterBack: (batch) => {
        gsap.to(batch, { opacity: 1, scale: 1, duration: 0.3 });
      }
    });

    // Parallax effect on scroll
    createParallax('.gallery-card', -15, '.gallery');

    // Flip-back effect when scrolling up
    createFlipBackEffect('.gallery-card', '.gallery', '59, 130, 246');

    // Unblur effect for title when scrolling up
    createUnblurEffect('.gallery-header h2', '.gallery', 5);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        const triggerEl = trigger.vars.trigger;
        if (triggerEl === '.gallery' || (typeof triggerEl === 'string' && triggerEl.includes('.gallery'))) {
          trigger.kill();
        }
      });
    };
  }, []);

  const title = "P o r t o f o l i o   S o l u s i";
  const titleLetters = splitTextToLetters(title);

  return (
    <section className="gallery" id="portfolio">
      <div className="gallery-container">
        <div className="gallery-header">
          <span className="gallery-label">Our Solutions / ソリューション</span>
          <h2 ref={titleRef} className="gallery-title">
            {titleLetters.map((item) => (
              <span key={item.index} className="letter">
                {item.char}
              </span>
            ))}
          </h2>
          <p className="gallery-subtitle">
            Lihat implementasi nyata sistem ERP kami di berbagai industri
          </p>
        </div>

        <div ref={gridRef} className="gallery-grid">
          <div className="gallery-card large">
            <div className="card-image">
              <img src="/asstes/mrp.jpg" alt="MRP & Scheduler System" loading="lazy" />
            </div>
            <div className="card-content">
              <h3 className="card-title">MRP & Scheduler</h3>
              <p className="card-description">
                Advanced Production Planning & Scheduling System untuk optimasi proses manufaktur
              </p>
              <div className="card-tags">
                <span className="tag">MRP</span>
                <span className="tag">APS</span>
                <span className="tag">Scheduler</span>
              </div>
            </div>
          </div>

          <div className="gallery-card large">
            <div className="card-image">
              <img src="/asstes/erp.jpg" alt="ERP Solution" loading="lazy" />
            </div>
            <div className="card-content">
              <h3 className="card-title">ERP System</h3>
              <p className="card-description">
                Integrated Business Management solution untuk mengelola seluruh aspek operasional
              </p>
              <div className="card-tags">
                <span className="tag">ERP</span>
                <span className="tag">Integration</span>
                <span className="tag">Management</span>
              </div>
            </div>
          </div>

          <div className="gallery-card">
            <div className="card-image">
              <img src="/asstes/ceisia.jpg" alt="Ceisa 4.0 Integration" loading="lazy" />
            </div>
            <div className="card-content">
              <h3 className="card-title">Ceisa 4.0</h3>
              <p className="card-description">
                Host-to-Host integration dengan sistem kepabeanan untuk PIB, PEB, TPB
              </p>
              <div className="card-tags">
                <span className="tag">Ceisa</span>
                <span className="tag">Customs</span>
              </div>
            </div>
          </div>

          <div className="gallery-card">
            <div className="card-image">
              <img src="/asstes/cukai.jpg" alt="Customs & Excise System" loading="lazy" />
            </div>
            <div className="card-content">
              <h3 className="card-title">Bea Cukai</h3>
              <p className="card-description">
                Sistem manajemen Kawasan Berikat, KITE, dan KEK compliance
              </p>
              <div className="card-tags">
                <span className="tag">Customs</span>
                <span className="tag">Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
