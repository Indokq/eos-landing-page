import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextToLetters } from '../utils/textSplit';
import { createScrollBatch } from '../utils/gsapAdvanced';
import { createFlipBackEffect, createUnblurEffect } from '../utils/scrollUpAnimations';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

export const Gallery = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const fullpageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Title letter animation
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

    // Desktop: Full-page scroll hijacking
    ScrollTrigger.matchMedia({
      "(min-width: 768px)": function() {
        const fullpageContainer = fullpageRef.current;
        if (!fullpageContainer) return;

        const cards = gsap.utils.toArray<HTMLElement>('.gallery-card-wrapper');
        if (cards.length === 0) return;

        // Create timeline for card transitions
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: fullpageContainer,
            start: 'top top',
            end: () => `+=${cards.length * 100}%`,
            pin: true,
            scrub: 1,
            snap: {
              snapTo: cards.map((_, i) => i / (cards.length - 1)),
              duration: { min: 0.2, max: 0.5 },
              delay: 0.1,
              ease: 'power1.inOut',
            },
            anticipatePin: 1,
          },
        });

        // Set initial states for all cards
        gsap.set(cards, { autoAlpha: 0 }); // All cards hidden initially
        gsap.set(cards[0], { autoAlpha: 1 }); // First card visible

        // Animate each card transition (matches example pattern)
        cards.forEach((card, index) => {
          if (index > 0) {
            const previousCard = cards[index - 1];

            // Timeline position: ensure equal spacing (1 unit per card transition)
            const position = index - 1;

            // Current card fades in
            tl.to(
              card,
              {
                autoAlpha: 1,
                duration: 0.3,
              },
              position
            );

            // Previous card fades out (simultaneously with "<")
            tl.to(
              previousCard,
              {
                autoAlpha: 0,
                duration: 0.3,
              },
              "<" // Start at same time as previous animation
            );
          }
        });
      },

      // Mobile: Normal scroll with batch animations
      "(max-width: 767px)": function() {
        const gridContainer = gridRef.current;
        if (!gridContainer) return;

        // Batch animations for mobile grid
        createScrollBatch('.gallery-card', {
          interval: 0.1,
          batchMax: 4,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              {
                opacity: 0,
                y: 100,
                scale: 0.8,
                rotationX: -15,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationX: 0,
                stagger: {
                  each: 0.15,
                  from: 'start',
                  ease: 'back.out(1.4)',
                },
                duration: 1.2,
                ease: 'power3.out',
                clearProps: 'all',
              }
            );
          },
          onLeave: (batch) => {
            gsap.to(batch, { opacity: 0.5, scale: 0.95, duration: 0.3 });
          },
          onEnterBack: (batch) => {
            gsap.to(batch, { opacity: 1, scale: 1, duration: 0.3 });
          },
        });

        // Flip-back effect when scrolling up
        createFlipBackEffect('.gallery-card', '.gallery', '59, 130, 246');

        // Unblur effect for title when scrolling up
        createUnblurEffect('.gallery-header h2', '.gallery', 5);
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === fullpageRef.current ||
            trigger.vars.trigger === '.gallery-card-wrapper' ||
            (typeof trigger.vars.trigger === 'string' && trigger.vars.trigger.includes('.gallery'))) {
          trigger.kill();
        }
      });
    };
  }, []);

  const title = "P o r t o f o l i o   S o l u s i";
  const titleLetters = splitTextToLetters(title);

  // Portfolio cards data
  const portfolioCards = [
    {
      title: 'MRP & Scheduler',
      description: 'Advanced Production Planning & Scheduling System untuk optimasi proses manufaktur',
      image: '/asstes/mrp.jpg',
      tags: ['MRP', 'APS', 'Scheduler'],
    },
    {
      title: 'ERP System',
      description: 'Integrated Business Management solution untuk mengelola seluruh aspek operasional',
      image: '/asstes/erp.jpg',
      tags: ['ERP', 'Integration', 'Management'],
    },
    {
      title: 'Ceisa 4.0',
      description: 'Host-to-Host integration dengan sistem kepabeanan untuk PIB, PEB, TPB',
      image: '/asstes/ceisia.jpg',
      tags: ['Ceisa', 'Customs'],
    },
    {
      title: 'Bea Cukai',
      description: 'Sistem manajemen Kawasan Berikat, KITE, dan KEK compliance',
      image: '/asstes/cukai.jpg',
      tags: ['Customs', 'Compliance'],
    },
  ];

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

        {/* Desktop: Full-page scroll hijacking */}
        <div ref={fullpageRef} className="gallery-cards-fullpage">
          {portfolioCards.map((card, index) => (
            <div key={index} className="gallery-card-wrapper">
              <div className="gallery-card">
                <div className="card-image">
                  <img src={card.image} alt={card.title} loading="lazy" />
                </div>
                <div className="card-content">
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-description">{card.description}</p>
                  <div className="card-tags">
                    {card.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Grid layout with normal scroll */}
        <div ref={gridRef} className="gallery-grid">
          {portfolioCards.map((card, index) => (
            <div key={index} className={`gallery-card ${index < 2 ? 'large' : ''}`}>
              <div className="card-image">
                <img src={card.image} alt={card.title} loading="lazy" />
              </div>
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <div className="card-tags">
                  {card.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
