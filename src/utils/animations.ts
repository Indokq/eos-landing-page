import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateLetters = (element: HTMLElement, delay = 0) => {
  const letters = element.querySelectorAll('.letter');
  
  gsap.fromTo(
    letters,
    {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.03,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};

export const animateWords = (element: HTMLElement) => {
  const words = element.querySelectorAll('.word');
  
  gsap.fromTo(
    words,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};

export const animateCard = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.9,
      y: 50,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};
