import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Advanced scroll-up animation utilities
 */

/**
 * Create unblur effect for titles when scrolling up
 */
export const createUnblurEffect = (
  selector: string,
  trigger: string,
  startBlur: number = 8
) => {
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      onEnter: () => {
        gsap.to(selector, {
          filter: 'blur(0px)',
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
        });
      },
      onEnterBack: () => {
        gsap.fromTo(
          selector,
          { filter: `blur(${startBlur}px)`, scale: 0.95 },
          {
            filter: 'blur(0px)',
            scale: 1.02,
            duration: 0.8,
            ease: 'back.out(1.7)',
          }
        );
      },
    },
  });
};

/**
 * Create 3D flip-back effect for cards when scrolling up
 */
export const createFlipBackEffect = (
  selector: string,
  trigger: string,
  glowColor: string = '96, 165, 250'
) => {
  const cards = document.querySelectorAll(selector);

  cards.forEach((card, index) => {
    const element = card as HTMLElement;
    
    gsap.timeline({
      scrollTrigger: {
        trigger,
        start: 'top 80%',
        end: 'top 20%',
        onEnter: () => {
          gsap.fromTo(
            element,
            { opacity: 0, y: 30, rotateY: 0 },
            {
              opacity: 1,
              y: 0,
              rotateY: 0,
              duration: 0.6,
              delay: index * 0.1,
              ease: 'power2.out',
            }
          );
        },
        onEnterBack: () => {
          gsap.fromTo(
            element,
            { rotateY: -15, transformPerspective: 1000 },
            {
              rotateY: 0,
              transformPerspective: 1000,
              duration: 0.7,
              delay: index * 0.08,
              ease: 'back.out(1.7)',
              onUpdate: function () {
                const progress = this.progress();
                const glow = 40 * (1 - Math.abs(progress - 0.5) * 2);
                element.style.boxShadow = `0 ${glow / 2}px ${glow}px rgba(${glowColor}, ${0.5 * (1 - Math.abs(progress - 0.5) * 2)})`;
              },
            }
          );
        },
      },
    });
  });
};

/**
 * Create background color shift on scroll direction
 */
export const createBackgroundShift = (
  selector: string,
  trigger: string,
  downColor: string,
  upColor: string
) => {
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => {
        gsap.to(selector, {
          backgroundColor: downColor,
          duration: 0.8,
          ease: 'power2.inOut',
        });
      },
      onEnterBack: () => {
        gsap.to(selector, {
          backgroundColor: upColor,
          duration: 0.8,
          ease: 'power2.inOut',
        });
      },
    },
  });
};

/**
 * Create rewind progress effect
 */
export const createRewindProgress = (
  selector: string,
  trigger: string,
  direction: 'horizontal' | 'vertical' = 'horizontal'
) => {
  const property = direction === 'horizontal' ? 'scaleX' : 'scaleY';
  
  return gsap.to(selector, {
    [property]: 1,
    transformOrigin: direction === 'horizontal' ? 'left' : 'top',
    ease: 'none',
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          // Add visual feedback for scroll direction
          const direction = self.direction;
          if (direction === -1) {
            // Scrolling up
            element.style.backgroundColor = '#3b82f6';
          } else {
            // Scrolling down
            element.style.backgroundColor = '#60a5fa';
          }
        }
      },
    },
  });
};

/**
 * Enhanced parallax with direction awareness
 */
export const createSmartParallax = (
  selector: string,
  trigger: string,
  downSpeed: number = -20,
  upSpeed: number = -30
) => {
  let lastDirection = 1;

  return gsap.to(selector, {
    yPercent: downSpeed,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || selector,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const currentDirection = self.direction;
        if (currentDirection !== lastDirection) {
          // Direction changed
          const speed = currentDirection === -1 ? upSpeed : downSpeed;
          gsap.to(selector, {
            yPercent: speed * self.progress,
            duration: 0.3,
            ease: 'power2.out',
          });
          lastDirection = currentDirection;
        }
      },
    },
  });
};

/**
 * Create staggered reveal with scroll-up enhancement
 */
export const createStaggeredReveal = (
  selector: string,
  trigger: string,
  staggerAmount: number = 0.1
) => {
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 80%',
      end: 'top 20%',
      onEnter: () => {
        gsap.fromTo(
          selector,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: {
              amount: staggerAmount,
              from: 'start',
              ease: 'power2.out',
            },
            ease: 'back.out(1.7)',
          }
        );
      },
      onEnterBack: () => {
        gsap.fromTo(
          selector,
          { opacity: 0.5, scale: 0.95, rotateX: 10 },
          {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 0.6,
            stagger: {
              amount: staggerAmount * 0.8,
              from: 'end', // Reverse stagger on scroll up
              ease: 'power2.out',
            },
            ease: 'back.out(2)',
          }
        );
      },
    },
  });
};

/**
 * Create velocity-based scale effect
 */
export const createVelocityScale = (
  element: HTMLElement,
  velocity: number,
  threshold: number = 1
) => {
  if (velocity > threshold) {
    const scale = 1 + Math.min(velocity / 10, 0.05);
    gsap.to(element, {
      scale,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
        });
      },
    });
  }
};

/**
 * Create wave reveal effect on scroll up
 */
export const createWaveReveal = (
  selector: string,
  trigger: string
) => {
  const elements = document.querySelectorAll(selector);

  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 80%',
      onEnterBack: () => {
        elements.forEach((element, index) => {
          const delay = Math.sin(index * 0.5) * 0.2;
          gsap.fromTo(
            element,
            { y: -20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: Math.abs(delay),
              ease: 'power3.out',
            }
          );
        });
      },
    },
  });
};
