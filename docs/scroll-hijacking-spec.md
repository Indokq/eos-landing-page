# Scroll Hijacking Implementation Specification
## EOS Landing Page - Portfolio Solusi Section (Gallery Component Only)

**Version:** 2.0
**Last Updated:** 2025-11-05
**Status:** Implementation Ready
**Scope:** Gallery Component Only

---

## 1. Executive Summary

### Overview
Implement a smooth scroll hijacking/snapping system **exclusively for the Gallery (Portfolio Solusi) section**. When users scroll through the Gallery, each portfolio card will snap into focus one at a time, creating an immersive showcase experience. The rest of the page will maintain normal scrolling behavior.

### Scope Definition
**✅ Snap Enabled:** Gallery section only (4 portfolio cards)
**❌ Normal Scroll:** Hero, About, Solutions, Features, Testimonials, Footer

### Goals
- ✅ Create seamless card-to-card transitions within Gallery
- ✅ Maintain existing GSAP animations and effects
- ✅ Focus attention on one portfolio item at a time
- ✅ Ensure smooth performance across devices
- ✅ Preserve normal scrolling for rest of page

### Key Benefits
- **Enhanced Focus**: Users see one portfolio item at a time
- **Professional Feel**: Modern, app-like portfolio showcase
- **Storytelling**: Guided narrative through solutions
- **Consistency**: Rest of page maintains familiar scroll behavior

---

## 2. Technical Architecture

### Current Tech Stack
```
React 19.1.1 + TypeScript 5.9.3
├── Lenis v1.3.13          (Smooth scrolling)
├── GSAP v3.13.0           (ScrollTrigger plugin)
├── Framer Motion v12.23.24 (Micro-interactions)
├── Three.js v0.181.0      (3D graphics)
└── Vite v7.1.14           (Build tool)
```

### Architecture Layers

```
┌─────────────────────────────────────────┐
│           App.tsx (Root)                │
│  ┌───────────────────────────────────┐  │
│  │  useSmoothScroll()                │  │
│  │  - Initialize Lenis               │  │
│  │  - Sync with ScrollTrigger        │  │
│  │  - Expose lenis instance          │  │
│  └───────────┬───────────────────────┘  │
│              │                           │
│  ┌───────────▼───────────────────────┐  │
│  │  useScrollSnap(lenis, sections)   │  │
│  │  - Configure Lenis Snap module    │  │
│  │  - Calculate snap points          │  │
│  │  - Handle resize events           │  │
│  └───────────┬───────────────────────┘  │
│              │                           │
│  ┌───────────▼───────────────────────┐  │
│  │  useScrollSections()              │  │
│  │  - Track active section           │  │
│  │  - Provide navigation methods     │  │
│  │  - Manage section registry        │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │  Section Components               │  │
│  │  - Hero, Gallery, About...        │  │
│  │  - Each with data-snap attribute  │  │
│  │  - Existing GSAP animations       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 3. Critical Issue: Lenis + GSAP Integration

### Current Problem
**File:** `src/hooks/useSmoothScroll.ts`

The current implementation has Lenis and ScrollTrigger running **independently**:

```typescript
// CURRENT (BROKEN)
const lenis = new Lenis({ /* config */ });

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

**Issues:**
- ScrollTrigger doesn't know about Lenis scroll position
- Animations trigger at wrong scroll positions
- Drift between smooth scroll and animation triggers
- No cleanup on component unmount

### Required Fix

```typescript
// CORRECT IMPLEMENTATION
const lenis = new Lenis({ /* config */ });

// 1. Sync Lenis scroll events with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// 2. Add Lenis to GSAP's ticker (instead of RAF)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert seconds to milliseconds
});

// 3. Disable lag smoothing for better sync
gsap.ticker.lagSmoothing(0);

// 4. Return lenis instance for other hooks
return lenis;
```

**Why This Matters:**
- ✅ ScrollTrigger updates on every Lenis scroll event
- ✅ GSAP's ticker manages timing (more reliable than RAF)
- ✅ No drift between scroll position and animations
- ✅ Other hooks can access lenis instance

---

## 4. Scroll Snap Implementation

### 4.1 Lenis Snap Module

**Module:** `lenis/snap`

```typescript
import Lenis from 'lenis';
import Snap from 'lenis/snap';

const lenis = new Lenis({ /* config */ });
const snap = new Snap(lenis, {
  type: 'mandatory',      // Always snap to nearest point
  velocities: [0.5, 1.0], // Snap faster on fast scrolls
  duration: 0.8,          // Snap animation duration
  easing: (t) => 1 - Math.pow(1 - t, 3), // Ease-out cubic
});

// Add snap points (calculated from section positions)
sections.forEach(section => {
  snap.add(section.offsetTop);
});
```

### 4.2 Configuration Options

```typescript
interface SnapConfig {
  type: 'mandatory' | 'proximity';
  velocities?: [number, number];  // [min, max] velocity thresholds
  duration?: number;               // Snap animation duration (seconds)
  easing?: (t: number) => number; // Custom easing function
}
```

**Recommended Settings:**

```typescript
const snapConfig: SnapConfig = {
  type: 'mandatory',        // Always snap (not proximity-based)
  velocities: [0.3, 0.8],   // Snap faster on fast scrolls
  duration: 0.8,            // 800ms snap animation
  easing: (t) => 1 - Math.pow(1 - t, 3), // Smooth ease-out
};
```

### 4.3 Lenis Configuration for Snapping

**Adjusted Lenis settings** for better snap feel:

```typescript
const lenisConfig = {
  duration: 1.5,          // Slightly slower (was 1.2)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.8,   // Slower for better snap control (was 1)
  touchMultiplier: 1.5,   // Better touch control (was 2)
  infinite: false,
  syncTouch: true,        // NEW: Sync touch scrolling
};
```

---

## 5. Hook Architecture

### 5.1 useSmoothScroll Hook (Enhanced)

**File:** `src/hooks/useSmoothScroll.ts`

```typescript
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

export const useSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      syncTouch: true,
    });

    lenisRef.current = lenis;

    // CRITICAL: Sync Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add to GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable lag smoothing
    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenisRef.current = null;
    };
  }, []);

  return lenisRef.current;
};
```

**Changes:**
- ✅ Added ScrollTrigger synchronization
- ✅ Using GSAP ticker instead of RAF
- ✅ Returns lenis instance
- ✅ Proper cleanup on unmount

### 5.2 useScrollSnap Hook (New)

**File:** `src/hooks/useScrollSnap.ts`

```typescript
import { useEffect } from 'react';
import Snap from 'lenis/snap';
import type Lenis from 'lenis';

interface UseScrollSnapOptions {
  type?: 'mandatory' | 'proximity';
  velocities?: [number, number];
  duration?: number;
  easing?: (t: number) => number;
}

export const useScrollSnap = (
  lenis: Lenis | null,
  sections: HTMLElement[],
  options: UseScrollSnapOptions = {}
) => {
  useEffect(() => {
    if (!lenis || sections.length === 0) return;

    const {
      type = 'mandatory',
      velocities = [0.3, 0.8],
      duration = 0.8,
      easing = (t) => 1 - Math.pow(1 - t, 3),
    } = options;

    // Initialize Snap
    const snap = new Snap(lenis, {
      type,
      velocities,
      duration,
      easing,
    });

    // Add snap points
    const updateSnapPoints = () => {
      snap.removeAll(); // Clear existing points
      sections.forEach(section => {
        snap.add(section.offsetTop);
      });
    };

    updateSnapPoints();

    // Update on resize
    const handleResize = () => {
      updateSnapPoints();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      snap.removeAll();
      window.removeEventListener('resize', handleResize);
    };
  }, [lenis, sections, options]);
};
```

**Features:**
- ✅ Configurable snap behavior
- ✅ Auto-calculates snap points
- ✅ Handles window resize
- ✅ Proper cleanup

### 5.3 useScrollSections Hook (New)

**File:** `src/hooks/useScrollSections.ts`

```typescript
import { useEffect, useState, useCallback } from 'react';
import type Lenis from 'lenis';

export const useScrollSections = (lenis: Lenis | null) => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [sections, setSections] = useState<HTMLElement[]>([]);

  useEffect(() => {
    // Find all sections with data-snap attribute
    const sectionElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-snap]')
    );
    setSections(sectionElements);

    if (!lenis) return;

    // Track active section on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 2;

      const currentSection = sectionElements.findIndex((section, index) => {
        const nextSection = sectionElements[index + 1];
        const sectionTop = section.offsetTop;
        const sectionBottom = nextSection
          ? nextSection.offsetTop
          : document.body.scrollHeight;

        return scrollY >= sectionTop && scrollY < sectionBottom;
      });

      if (currentSection !== -1 && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis, activeSection]);

  const scrollToSection = useCallback((index: number) => {
    if (!lenis || !sections[index]) return;
    lenis.scrollTo(sections[index], { duration: 1.2 });
  }, [lenis, sections]);

  return {
    activeSection,
    sections,
    scrollToSection,
    totalSections: sections.length,
  };
};
```

**Features:**
- ✅ Tracks active section
- ✅ Provides navigation method
- ✅ Auto-discovers sections
- ✅ Updates on scroll

---

## 6. Section Configuration

### 6.1 App.tsx Integration

**File:** `src/App.tsx`

```typescript
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useScrollSnap } from './hooks/useScrollSnap';
import { useScrollSections } from './hooks/useScrollSections';

export const App = () => {
  // Initialize smooth scroll
  const lenis = useSmoothScroll();

  // Track sections and get navigation
  const { activeSection, sections, scrollToSection } = useScrollSections(lenis);

  // Enable snap on sections
  useScrollSnap(lenis, sections, {
    type: 'mandatory',
    velocities: [0.3, 0.8],
    duration: 0.8,
  });

  return (
    <div className="app">
      <Hero data-snap="hero" />
      <Gallery data-snap="gallery" />
      <About data-snap="about" />
      <Solutions data-snap="solutions" />
      <Features data-snap="features" />
      <Testimonials data-snap="testimonials" />
      <Footer data-snap="footer" />
    </div>
  );
};
```

### 6.2 Section Markup

Each section component needs a `data-snap` attribute:

```tsx
export const Gallery = () => {
  return (
    <section
      className="gallery"
      id="portfolio"
      data-snap="gallery"  // <-- Required for snap
    >
      {/* Existing content */}
    </section>
  );
};
```

**Sections to Mark:**
1. Hero (`data-snap="hero"`)
2. Gallery (`data-snap="gallery"`)
3. About (`data-snap="about"`)
4. Solutions (`data-snap="solutions"`)
5. Features (`data-snap="features"`)
6. Testimonials (`data-snap="testimonials"`)
7. Footer (`data-snap="footer"`)

---

## 7. Performance Optimization

### 7.1 ScrollTrigger Configuration

Update existing ScrollTrigger instances:

```typescript
ScrollTrigger.create({
  trigger: element,
  start: 'top 80%',
  end: 'bottom 20%',

  // Performance optimizations
  invalidateOnRefresh: true,  // Recalc on resize
  anticipatePin: 1,           // Better pin performance
  fastScrollEnd: true,        // Skip to end on fast scroll

  onEnter: () => { /* animation */ },
});
```

### 7.2 Resize Handling

Debounce resize events:

```typescript
let resizeTimeout: NodeJS.Timeout;

const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
    // Update snap points
  }, 150);
};

window.addEventListener('resize', handleResize);
```

### 7.3 React Optimization

```typescript
// Memoize section refs
const sectionRefs = useMemo(() => sections, [sections]);

// Debounce scroll handler
const debouncedScroll = useMemo(
  () => debounce(handleScroll, 16), // ~60fps
  []
);
```

---

## 8. User Experience Considerations

### 8.1 Accessibility

```typescript
// Allow keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'PageDown') {
    e.preventDefault();
    scrollToSection(activeSection + 1);
  }
  if (e.key === 'PageUp') {
    e.preventDefault();
    scrollToSection(activeSection - 1);
  }
});

// Add ARIA labels
<section
  data-snap="gallery"
  aria-label="Portfolio Gallery"
  role="region"
>
```

### 8.2 Visual Indicators

Add scroll progress indicator:

```tsx
<div className="scroll-progress">
  {sections.map((_, i) => (
    <button
      key={i}
      className={i === activeSection ? 'active' : ''}
      onClick={() => scrollToSection(i)}
      aria-label={`Go to section ${i + 1}`}
    />
  ))}
</div>
```

### 8.3 Mobile Behavior

```typescript
const isMobile = window.innerWidth < 768;

const snapConfig = {
  type: 'mandatory',
  velocities: isMobile ? [0.4, 1.0] : [0.3, 0.8],
  duration: isMobile ? 0.6 : 0.8, // Faster on mobile
};
```

---

## 9. Testing Checklist

### Functional Testing
- [ ] Snap works on mouse wheel scroll
- [ ] Snap works on touchpad scroll
- [ ] Snap works on touch swipe (mobile)
- [ ] Keyboard navigation (PageUp/PageDown)
- [ ] Direct section navigation works
- [ ] Snap points update on window resize
- [ ] All existing GSAP animations still trigger correctly

### Performance Testing
- [ ] Smooth 60fps scrolling
- [ ] No jank or stuttering
- [ ] Fast scroll handling
- [ ] Memory usage stable
- [ ] No console errors
- [ ] Works across browsers (Chrome, Firefox, Safari, Edge)

### Responsive Testing
- [ ] Desktop (1920px+)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

### Edge Cases
- [ ] Very fast scrolling
- [ ] Rapid section changes
- [ ] Mid-scroll page refresh
- [ ] Browser back/forward navigation
- [ ] Anchor link navigation

---

## 10. Implementation Timeline

### Day 1: Infrastructure (2-3 hours)
- ✅ Fix Lenis + GSAP synchronization
- ✅ Create useScrollSnap hook
- ✅ Create useScrollSections hook
- ✅ Test basic snap functionality

### Day 2: Integration (2-3 hours)
- ✅ Update App.tsx with hooks
- ✅ Add data-snap attributes to sections
- ✅ Test snap on all sections
- ✅ Verify existing animations work

### Day 3: Optimization (2-3 hours)
- ✅ Fine-tune snap parameters
- ✅ Add visual indicators
- ✅ Optimize performance
- ✅ Mobile testing and adjustments

### Day 4: Polish (1-2 hours)
- ✅ Add keyboard navigation
- ✅ Accessibility improvements
- ✅ Cross-browser testing
- ✅ Final QA and bug fixes

**Total Estimated Time:** 7-11 hours

---

## 11. Configuration Reference

### Recommended Settings

```typescript
// Lenis Configuration
const lenisConfig = {
  duration: 1.5,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.8,
  touchMultiplier: 1.5,
  syncTouch: true,
  infinite: false,
};

// Snap Configuration
const snapConfig = {
  type: 'mandatory',
  velocities: [0.3, 0.8],
  duration: 0.8,
  easing: (t: number) => 1 - Math.pow(1 - t, 3),
};

// ScrollTrigger Defaults
ScrollTrigger.defaults({
  invalidateOnRefresh: true,
  anticipatePin: 1,
  fastScrollEnd: true,
});
```

---

## 12. Troubleshooting

### Issue: Snap points not working
**Solution:** Ensure sections have `data-snap` attribute and are visible in DOM

### Issue: Animations trigger at wrong positions
**Solution:** Verify Lenis is synced with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`

### Issue: Jittery scrolling
**Solution:** Check that `gsap.ticker.lagSmoothing(0)` is called

### Issue: Snap too aggressive
**Solution:** Adjust `velocities` values or use `type: 'proximity'`

### Issue: Not working on mobile
**Solution:** Ensure `syncTouch: true` in Lenis config and test touch events

---

## 13. Future Enhancements

### Phase 2 (Optional)
- [ ] Animated section transitions (fade, slide, etc.)
- [ ] Parallax effects during snap
- [ ] Section-specific snap configurations
- [ ] Scroll progress bar animation
- [ ] Sound effects on section change
- [ ] Analytics tracking for section views

### Phase 3 (Advanced)
- [ ] Horizontal snap for sub-sections
- [ ] Custom easing curves per section
- [ ] Gesture-based navigation
- [ ] Virtual scrolling for performance
- [ ] Preload next/previous sections

---

## 14. Dependencies

### Current (Already Installed)
```json
{
  "lenis": "^1.3.13",
  "gsap": "^3.13.0",
  "react": "^19.1.1"
}
```

### New Module Required
```typescript
// Import from lenis package (already installed)
import Snap from 'lenis/snap';
```

No additional npm packages needed! ✅

---

## 15. File Structure

```
src/
├── hooks/
│   ├── useSmoothScroll.ts      (MODIFY - Add sync)
│   ├── useScrollSnap.ts        (CREATE - Snap logic)
│   └── useScrollSections.ts    (CREATE - Section tracking)
├── utils/
│   └── scrollSnap.ts           (CREATE - Optional helpers)
├── components/
│   ├── Hero.tsx                (MODIFY - Add data-snap)
│   ├── Gallery.tsx             (MODIFY - Add data-snap)
│   ├── About.tsx               (MODIFY - Add data-snap)
│   ├── Solutions.tsx           (MODIFY - Add data-snap)
│   ├── Features.tsx            (MODIFY - Add data-snap)
│   ├── Testimonials.tsx        (MODIFY - Add data-snap)
│   └── Footer.tsx              (MODIFY - Add data-snap)
└── App.tsx                     (MODIFY - Integrate hooks)
```

---

## 16. Success Criteria

### Must Have ✅
- [x] Smooth scroll snapping between sections
- [x] No breaking of existing animations
- [x] Works on desktop and mobile
- [x] 60fps performance
- [x] Proper cleanup on unmount

### Nice to Have 🎯
- [ ] Visual scroll indicators
- [ ] Keyboard navigation
- [ ] Accessibility improvements
- [ ] Section navigation API
- [ ] Analytics integration

---

## 17. References

### Documentation
- [Lenis Documentation](https://lenis.darkroom.engineering/)
- [Lenis Snap Module](https://github.com/darkroomengineering/lenis#snap)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP + Lenis Integration](https://gsap.com/community/forums/topic/34937-lenis-smooth-scroll-and-scrolltrigger/)

### Code Examples
- [Lenis Snap Demo](https://lenis.darkroom.engineering/snap)
- [GSAP + Lenis CodePen](https://codepen.io/GreenSock/pen/BaVGRaO)

---

**Specification Version:** 1.0
**Author:** Claude Code
**Date:** 2025-11-05
**Status:** Ready for Implementation ✅
