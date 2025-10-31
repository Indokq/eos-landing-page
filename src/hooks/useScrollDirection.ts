import { useState, useEffect, useRef } from 'react';

interface ScrollData {
  direction: 'up' | 'down' | null;
  velocity: number;
  scrollY: number;
}

export const useScrollDirection = () => {
  const [scrollData, setScrollData] = useState<ScrollData>({
    direction: null,
    velocity: 0,
    scrollY: 0,
  });

  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(Date.now());

  useEffect(() => {
    let ticking = false;

    const updateScrollData = () => {
      const currentScrollY = window.scrollY;
      const currentTimestamp = Date.now();
      
      const deltaY = currentScrollY - lastScrollY.current;
      const deltaTime = currentTimestamp - lastTimestamp.current;
      
      const velocity = Math.abs(deltaY / deltaTime);
      
      const direction = deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : scrollData.direction;

      setScrollData({
        direction,
        velocity,
        scrollY: currentScrollY,
      });

      lastScrollY.current = currentScrollY;
      lastTimestamp.current = currentTimestamp;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollData);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [scrollData.direction]);

  return scrollData;
};
