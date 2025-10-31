import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Custom hook for creating and managing GSAP timelines
 */
export const useGSAPTimeline = (config?: gsap.TimelineVars) => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    timelineRef.current = gsap.timeline({
      defaults: { ease: 'power3.out' },
      ...config,
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return timelineRef.current;
};
