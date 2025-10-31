import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollProgressIndicator.css';

gsap.registerPlugin(ScrollTrigger);

export const ScrollProgressIndicator = () => {
  const progressRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!progressRef.current || !circleRef.current) return;

    const circle = circleRef.current;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    // Create scroll progress animation
    gsap.to(circle, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const offset = circumference * (1 - progress);
          circle.style.strokeDashoffset = `${offset}`;

          // Change color based on scroll direction
          if (self.direction === -1) {
            // Scrolling up
            circle.style.stroke = '#3b82f6';
            progressRef.current?.classList.add('scrolling-up');
          } else {
            // Scrolling down
            circle.style.stroke = '#60a5fa';
            progressRef.current?.classList.remove('scrolling-up');
          }
        },
      },
    });

    // Pulse animation on scroll velocity change
    let lastProgress = 0;
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const currentProgress = self.progress;
        const velocity = Math.abs(currentProgress - lastProgress);
        
        if (velocity > 0.005 && progressRef.current) {
          gsap.to(progressRef.current, {
            scale: 1.2,
            duration: 0.2,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(progressRef.current, {
                scale: 1,
                duration: 0.3,
                ease: 'elastic.out(1, 0.5)',
              });
            },
          });
        }
        
        lastProgress = currentProgress;
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const scrollToTop = () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: 0, autoKill: true },
      ease: 'power3.inOut',
    });
  };

  return (
    <div ref={progressRef} className="scroll-progress-indicator" onClick={scrollToTop}>
      <svg className="progress-ring" width="60" height="60">
        <circle
          className="progress-ring-bg"
          cx="30"
          cy="30"
          r="24"
          fill="none"
          stroke="rgba(96, 165, 250, 0.2)"
          strokeWidth="3"
        />
        <circle
          ref={circleRef}
          className="progress-ring-circle"
          cx="30"
          cy="30"
          r="24"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          transform="rotate(-90 30 30)"
        />
      </svg>
      <div className="scroll-icon">↑</div>
    </div>
  );
};
