import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Splits text content into individual characters wrapped in spans with word boundaries
 * This prevents mid-word line breaks and selection issues
 * @param element - The HTML element containing text
 * @param className - Optional class name for character spans
 * @returns Array of character span elements
 */
export const splitTextIntoChars = (element: HTMLElement, className = 'char'): HTMLElement[] => {
  const originalHTML = element.innerHTML;
  const chars: HTMLElement[] = [];
  
  // Check if there are <br> tags in the content
  const hasBrTags = originalHTML.includes('<br');
  
  if (hasBrTags) {
    // Handle line breaks separately
    const lines = originalHTML.split(/<br\s*\/?>/i);
    element.innerHTML = '';
    
    lines.forEach((lineHTML, lineIndex) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = lineHTML;
      const lineText = tempDiv.textContent || '';
      
      // Create line wrapper
      const lineWrapper = document.createElement('div');
      lineWrapper.className = 'char-line-wrapper';
      lineWrapper.style.display = 'block';
      
      const words = lineText.trim().split(' ');
      
      words.forEach((word, wordIndex) => {
        const wordWrapper = document.createElement('span');
        wordWrapper.className = 'char-word-wrapper';
        wordWrapper.style.display = 'inline-block';
        wordWrapper.style.whiteSpace = 'nowrap';
        wordWrapper.style.textAlign = 'left';
        
        word.split('').forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = className;
          charSpan.textContent = char;
          charSpan.style.display = 'inline-block';
          wordWrapper.appendChild(charSpan);
          chars.push(charSpan);
        });
        
        lineWrapper.appendChild(wordWrapper);
        
        if (wordIndex < words.length - 1) {
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'char-space';
          spaceSpan.textContent = '\u00A0';
          spaceSpan.style.display = 'inline-block';
          lineWrapper.appendChild(spaceSpan);
          chars.push(spaceSpan);
        }
      });
      
      element.appendChild(lineWrapper);
    });
  } else {
    // Original logic for single line
    const text = element.textContent || '';
    element.innerHTML = '';
    
    const words = text.split(' ');
    
    words.forEach((word, wordIndex) => {
      const wordWrapper = document.createElement('span');
      wordWrapper.className = 'char-word-wrapper';
      wordWrapper.style.display = 'inline-block';
      wordWrapper.style.whiteSpace = 'nowrap';
      wordWrapper.style.textAlign = 'left';
      
      word.split('').forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.className = className;
        charSpan.textContent = char;
        charSpan.style.display = 'inline-block';
        wordWrapper.appendChild(charSpan);
        chars.push(charSpan);
      });
      
      element.appendChild(wordWrapper);
      
      if (wordIndex < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'char-space';
        spaceSpan.textContent = '\u00A0';
        spaceSpan.style.display = 'inline-block';
        element.appendChild(spaceSpan);
        chars.push(spaceSpan);
      }
    });
  }
  
  return chars;
};

/**
 * Advanced text splitting into lines, words, and characters
 * @param element - The HTML element containing text
 * @param options - Splitting options
 * @returns Hierarchical structure of split elements
 */
export const splitTextAdvanced = (
  element: HTMLElement,
  options: {
    types?: ('lines' | 'words' | 'chars')[];
    lineClass?: string;
    wordClass?: string;
    charClass?: string;
  } = {}
) => {
  const {
    types = ['words', 'chars'],
    lineClass = 'line',
    wordClass = 'word',
    charClass = 'char'
  } = options;

  const text = element.textContent || '';
  const result: {
    lines: HTMLElement[];
    words: HTMLElement[];
    chars: HTMLElement[];
  } = {
    lines: [],
    words: [],
    chars: []
  };

  element.innerHTML = '';

  // Split into words first
  const words = text.split(' ');
  
  words.forEach((wordText, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = wordClass;
    wordSpan.style.display = 'inline-block';
    
    if (types.includes('chars')) {
      // Split word into characters
      wordText.split('').forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.className = charClass;
        charSpan.textContent = char;
        charSpan.style.display = 'inline-block';
        wordSpan.appendChild(charSpan);
        result.chars.push(charSpan);
      });
    } else {
      wordSpan.textContent = wordText;
    }
    
    element.appendChild(wordSpan);
    result.words.push(wordSpan);
    
    // Add space after word (except last)
    if (wordIndex < words.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  });

  return result;
};

/**
 * Splits text into words wrapped in spans
 * @param element - The HTML element containing text
 * @param className - Optional class name for word spans
 * @returns Array of word span elements
 */
export const splitTextIntoWords = (element: HTMLElement, className = 'word'): HTMLElement[] => {
  const text = element.textContent || '';
  const words: HTMLElement[] = [];
  
  element.innerHTML = '';
  
  text.split(' ').forEach((word, index, array) => {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = word;
    span.style.display = 'inline-block';
    element.appendChild(span);
    words.push(span);
    
    // Add space after each word except the last
    if (index < array.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  });
  
  return words;
};

/**
 * Creates 3D text faces for flip animations
 * @param element - The HTML element containing text
 * @returns Object containing face elements
 */
export const create3DTextFaces = (element: HTMLElement) => {
  const text = element.textContent || '';
  
  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'text-3d';
  
  // Create faces
  const faces = {
    front: createFace(text, 'face face-front'),
    top: createFace(text, 'face face-top'),
    bottom: createFace(text, 'face face-bottom'),
    back: createFace(text, 'face face-back'),
  };
  
  // Append faces to wrapper
  Object.values(faces).forEach(face => wrapper.appendChild(face));
  
  // Replace element content
  element.innerHTML = '';
  element.appendChild(wrapper);
  
  return faces;
};

const createFace = (text: string, className: string): HTMLElement => {
  const face = document.createElement('div');
  face.className = className;
  face.textContent = text;
  return face;
};

/**
 * Scramble text animation utility
 * @param element - The HTML element to animate
 * @param finalText - The final text to reveal
 * @param options - Animation options
 */
export const scrambleText = (
  element: HTMLElement,
  finalText: string,
  options: {
    duration?: number;
    chars?: string;
    revealDelay?: number;
    onComplete?: () => void;
  } = {}
) => {
  const {
    duration = 1.5,
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',
    revealDelay = 0.3,
    onComplete,
  } = options;
  
  const length = finalText.length;
  let frame = 0;
  const totalFrames = Math.floor(duration * 60); // Assuming 60fps
  
  const animate = () => {
    if (frame >= totalFrames) {
      element.textContent = finalText;
      onComplete?.();
      return;
    }
    
    const progress = frame / totalFrames;
    let scrambled = '';
    
    for (let i = 0; i < length; i++) {
      const charProgress = Math.max(0, progress - (revealDelay * i / length));
      
      if (charProgress >= 1) {
        scrambled += finalText[i];
      } else if (charProgress > 0) {
        scrambled += chars[Math.floor(Math.random() * chars.length)];
      } else {
        scrambled += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    element.textContent = scrambled;
    frame++;
    requestAnimationFrame(animate);
  };
  
  requestAnimationFrame(animate);
};

/**
 * Advanced scramble text with wave pattern and speed control
 * @param element - The HTML element to animate
 * @param finalText - The final text to reveal
 * @param options - Advanced animation options
 */
export const scrambleTextAdvanced = (
  element: HTMLElement,
  finalText: string,
  options: {
    duration?: number;
    speed?: number;
    chars?: string;
    revealDelay?: number;
    wave?: boolean;
    onComplete?: () => void;
  } = {}
) => {
  const {
    duration = 1.5,
    speed = 1,
    chars = 'XO10▓█░▒ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    revealDelay = 0.05,
    wave = true,
    onComplete,
  } = options;
  
  const length = finalText.length;
  let frame = 0;
  const totalFrames = Math.floor((duration / speed) * 60);
  
  const animate = () => {
    if (frame >= totalFrames) {
      element.textContent = finalText;
      onComplete?.();
      return;
    }
    
    const progress = frame / totalFrames;
    let scrambled = '';
    
    for (let i = 0; i < length; i++) {
      let charProgress: number;
      
      if (wave) {
        // Wave-like reveal pattern
        const waveOffset = Math.sin(i * 0.3) * 0.1;
        charProgress = Math.max(0, progress - waveOffset - (revealDelay * i / length));
      } else {
        charProgress = Math.max(0, progress - (revealDelay * i / length));
      }
      
      if (charProgress >= 1) {
        scrambled += finalText[i];
      } else if (charProgress > 0) {
        // More frequent character changes during scramble
        const changeFrequency = Math.floor(charProgress * 10);
        if (frame % (changeFrequency + 1) === 0) {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      } else {
        scrambled += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    element.textContent = scrambled;
    frame++;
    requestAnimationFrame(animate);
  };
  
  requestAnimationFrame(animate);
};

/**
 * Creates a wave animation effect for text characters
 * @param elements - Array of elements to animate
 * @param scrollProgress - Scroll progress (0-1)
 */
export const createWaveEffect = (elements: HTMLElement[], scrollProgress: number) => {
  elements.forEach((el, i) => {
    const offset = Math.sin((scrollProgress * Math.PI * 2) + (i * 0.3)) * 10;
    gsap.set(el, { y: offset });
  });
};

/**
 * Utility to check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Wraps text in mask container for reveal animations
 * @param element - The HTML element to wrap
 * @param className - Optional class name for mask
 */
export const wrapInMask = (element: HTMLElement, className = 'pill-mask') => {
  const text = element.textContent || '';
  const mask = document.createElement('span');
  mask.className = className;
  
  const content = document.createElement('span');
  content.textContent = text;
  
  mask.appendChild(content);
  element.innerHTML = '';
  element.appendChild(mask);
  
  return { mask, content };
};

/**
 * Creates masked word reveal for subtitle animations
 * @param words - Array of word elements
 * @param className - Optional class name for mask
 */
export const createMaskReveal = (words: HTMLElement[], className = 'word-mask') => {
  words.forEach((word) => {
    const mask = document.createElement('div');
    mask.className = className;
    mask.style.overflow = 'hidden';
    mask.style.display = 'inline-block';
    
    const parent = word.parentNode;
    if (parent) {
      parent.insertBefore(mask, word);
      mask.appendChild(word);
    }
  });
};

/**
 * Creates scroll-triggered wave effect on text characters
 * @param elements - Array of character elements
 * @param trigger - ScrollTrigger configuration
 * @returns ScrollTrigger instance
 */
export const createWaveScrollEffect = (
  elements: HTMLElement[],
  trigger: {
    triggerElement: HTMLElement;
    start?: string;
    end?: string;
    scrub?: number | boolean;
  }
) => {
  return ScrollTrigger.create({
    trigger: trigger.triggerElement,
    start: trigger.start || 'top center',
    end: trigger.end || 'bottom top',
    scrub: trigger.scrub !== undefined ? trigger.scrub : 0.5,
    onUpdate: (self) => {
      elements.forEach((el, i) => {
        const offset = Math.sin((self.progress * Math.PI * 3) + (i * 0.2)) * 15;
        gsap.to(el, {
          y: offset,
          duration: 0.1,
          ease: 'none'
        });
      });
    }
  });
};
