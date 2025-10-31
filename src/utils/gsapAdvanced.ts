import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Advanced GSAP animation utilities based on Context7 best practices
 */

/**
 * Animate value with count-up effect
 */
export const animateValue = (
  element: HTMLElement,
  start: number,
  end: number,
  duration: number
) => {
  const obj = { val: start };
  
  gsap.to(obj, {
    val: end,
    duration: duration / 1000,
    ease: 'power2.out',
    onUpdate: function () {
      element.textContent = Math.round(obj.val).toString();
    },
  });
};

/**
 * Create keyframe-based animation
 */
export const createKeyframeAnimation = (
  target: string | Element,
  keyframes: gsap.TweenVars[],
  scrollTrigger?: ScrollTrigger.Vars
) => {
  return gsap.to(target, {
    keyframes,
    scrollTrigger,
  });
};

/**
 * Create batch scroll animation
 */
export const createScrollBatch = (
  selector: string,
  options: {
    onEnter?: (batch: Element[]) => void;
    onLeave?: (batch: Element[]) => void;
    onEnterBack?: (batch: Element[]) => void;
    interval?: number;
    batchMax?: number;
  }
) => {
  return ScrollTrigger.batch(selector, {
    interval: options.interval || 0.1,
    batchMax: options.batchMax,
    onEnter: options.onEnter,
    onLeave: options.onLeave,
    onEnterBack: options.onEnterBack,
  });
};

/**
 * Create parallax effect
 */
export const createParallax = (
  selector: string,
  yPercent: number = -20,
  trigger?: string
) => {
  return gsap.to(selector, {
    yPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || selector,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });
};

/**
 * Create smooth scroll to target
 */
export const smoothScrollTo = (
  target: string | Element,
  offset: number = 100,
  duration: number = 1
) => {
  return gsap.to(window, {
    duration,
    scrollTo: {
      y: target,
      offsetY: offset,
      autoKill: true,
      onAutoKill: () => console.log('Scroll interrupted'),
    },
    ease: 'power3.inOut',
  });
};

/**
 * Create floating animation
 */
export const createFloatingAnimation = (
  element: Element,
  yOffset: number = -10,
  duration: number = 2,
  delay: number = 0
) => {
  return gsap.to(element, {
    y: yOffset,
    duration,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay,
  });
};

/**
 * Create glow effect animation
 */
export const createGlowEffect = (
  element: HTMLElement,
  maxGlow: number = 60,
  color: string = '96, 165, 250'
) => {
  return {
    onUpdate: function (this: gsap.core.Tween) {
      const progress = this.progress();
      const glowAmount = maxGlow * progress;
      const opacity = 0.4 * progress;
      element.style.boxShadow = `0 ${glowAmount / 3}px ${glowAmount}px rgba(${color}, ${opacity})`;
    },
  };
};

/**
 * Stagger configuration presets
 */
export const staggerPresets = {
  center: {
    from: 'center' as const,
    ease: 'back.out(1.7)',
  },
  edges: {
    from: 'edges' as const,
    ease: 'back.out(2)',
  },
  start: {
    from: 'start' as const,
    ease: 'power2.out',
  },
  end: {
    from: 'end' as const,
    ease: 'power2.out',
  },
  random: {
    from: 'random' as const,
    ease: 'power3.out',
  },
};

/**
 * Create timeline with callbacks
 */
export const createTimelineWithCallbacks = (config?: gsap.TimelineVars) => {
  return gsap.timeline({
    defaults: { ease: 'power3.out' },
    ...config,
  });
};
