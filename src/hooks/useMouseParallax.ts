import { useState, useEffect } from 'react';

interface MouseParallaxPosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

export const useMouseParallax = (smoothing: number = 0.1) => {
  const [mousePosition, setMousePosition] = useState<MouseParallaxPosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updatePosition = () => {
      // Smooth interpolation
      currentX += (targetX - currentX) * smoothing;
      currentY += (targetY - currentY) * smoothing;

      // Normalize to -1 to 1 range
      const normalizedX = (currentX / window.innerWidth) * 2 - 1;
      const normalizedY = -(currentY / window.innerHeight) * 2 + 1;

      setMousePosition({
        x: currentX,
        y: currentY,
        normalizedX,
        normalizedY,
      });

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [smoothing]);

  return mousePosition;
};
