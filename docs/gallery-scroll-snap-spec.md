# Gallery Scroll Snapping Specification
## Portfolio Solusi Section - Card-by-Card Scroll Hijacking

**Version:** 1.0
**Last Updated:** 2025-11-05
**Component:** Gallery.tsx only
**Scope:** 4 portfolio cards scroll snapping

---

## 1. Overview

Implement scroll snapping **only within the Gallery (Portfolio Solusi) section** so that each of the 4 portfolio cards snaps into focus as users scroll through the section. The rest of the page maintains normal smooth scrolling.

### Current Gallery Structure
- **File:** `src/components/Gallery.tsx`
- **Cards:** 4 portfolio items (MRP, ERP, Ceisa, Bea Cukai)
- **Current behavior:** Batch animations, parallax, flip effects
- **Layout:** CSS Grid (2 large cards + 2 regular cards)

---

## 2. Implementation Approach

We have **two main options** for implementing scroll snapping in the Gallery section:

### Option A: CSS Scroll Snap (Recommended)
**Simplest approach** - Use native CSS scroll-snap properties

**Pros:**
- ✅ No JavaScript required
- ✅ Native browser performance
- ✅ Works with existing GSAP animations
- ✅ Minimal code changes
- ✅ Mobile-friendly

**Cons:**
- ❌ Less customization
- ❌ No programmatic control

### Option B: GSAP ScrollTrigger Snap
**More control** - Use GSAP's snap functionality with ScrollTo plugin

**Pros:**
- ✅ Full programmatic control
- ✅ Custom easing and duration
- ✅ Integrates with existing GSAP code
- ✅ Can trigger animations on snap

**Cons:**
- ❌ Requires gsap ScrollToPlugin
- ❌ More code complexity
- ❌ Need to manage scroll events

### ✅ Recommended: Hybrid Approach
Use **CSS scroll-snap** for the snapping behavior, plus **GSAP ScrollTrigger** to detect which card is active and trigger additional effects.

---

## 3. Implementation Details

### 3.1 CSS Scroll Snap Implementation

**File:** `src/components/Gallery.css`

```css
/* Make Gallery section a scroll container */
.gallery {
  scroll-snap-type: y proximity;  /* or 'mandatory' for stronger snap */
  overflow-y: auto;                /* Required for scroll-snap */
}

/* Each card is a snap point */
.gallery-card {
  scroll-snap-align: start;        /* Snap to top of card */
  scroll-snap-stop: always;        /* Force snap to each card */
}

/* Optional: Smooth scrolling within Gallery */
.gallery {
  scroll-behavior: smooth;
}
```

**Key Properties:**

| Property | Value | Purpose |
|----------|-------|---------|
| `scroll-snap-type` | `y proximity` | Snap vertically when close |
| `scroll-snap-type` | `y mandatory` | Always snap (stricter) |
| `scroll-snap-align` | `start` | Snap to top of element |
| `scroll-snap-align` | `center` | Snap to center (alternative) |
| `scroll-snap-stop` | `always` | Force snap to each card |

### 3.2 Gallery Structure Update

**Current Structure:**
```tsx
<section className="gallery" id="portfolio">
  <div className="gallery-container">
    <div className="gallery-header">...</div>
    <div className="gallery-grid">
      <div className="gallery-card large">...</div>
      <div className="gallery-card large">...</div>
      <div className="gallery-card">...</div>
      <div className="gallery-card">...</div>
    </div>
  </div>
</section>
```

**Updated Structure (if needed):**
```tsx
<section className="gallery" id="portfolio">
  <div className="gallery-container">
    <div className="gallery-header">...</div>
    <div className="gallery-scroll-container">  {/* NEW: Scroll container */}
      <div className="gallery-card" data-card="mrp">...</div>
      <div className="gallery-card" data-card="erp">...</div>
      <div className="gallery-card" data-card="ceisa">...</div>
      <div className="gallery-card" data-card="cukai">...</div>
    </div>
  </div>
</section>
```

### 3.3 CSS Layout Options

**Option 1: Vertical Stack (One card at a time)**
```css
.gallery-scroll-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;  /* Full viewport height */
}

.gallery-card {
  min-height: 100vh;      /* Each card takes full viewport */
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

**Option 2: Keep Grid, Snap by Row**
```css
.gallery-grid {
  scroll-snap-type: y proximity;
}

.gallery-card {
  scroll-snap-align: start;
}
```

**Option 3: Horizontal Snap (Alternative)**
```css
.gallery-scroll-container {
  display: flex;
  flex-direction: row;
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
  width: 100vw;
}

.gallery-card {
  min-width: 100vw;
  scroll-snap-align: start;
}
```

---

## 4. Maintaining Existing Animations

### Current GSAP Animations in Gallery.tsx
```typescript
// 1. Title letter animation (line 18-32)
gsap.fromTo(letters, { opacity: 0, y: 30 }, {...});

// 2. Batch card animations (line 36-69)
createScrollBatch('.gallery-card', {...});

// 3. Parallax effect (line 72)
createParallax('.gallery-card', -15, '.gallery');

// 4. Flip-back effect (line 75)
createFlipBackEffect('.gallery-card', '.gallery', '59, 130, 246');

// 5. Unblur title effect (line 78)
createUnblurEffect('.gallery-header h2', '.gallery', 5);
```

### Compatibility Check

| Animation | CSS Snap Compatible? | Notes |
|-----------|---------------------|-------|
| Title letters | ✅ Yes | Not affected |
| Batch animations | ✅ Yes | May need adjustment |
| Parallax | ⚠️ Maybe | Could conflict with snap |
| Flip-back | ✅ Yes | Works fine |
| Unblur | ✅ Yes | Works fine |

**Recommendation:** Disable parallax (`createParallax`) when using scroll snap, as they can conflict.

---

## 5. Enhanced Implementation with GSAP

### 5.1 Create Custom Hook

**File:** `src/hooks/useGallerySnap.ts`

```typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const useGallerySnap = () => {
  const activeCardRef = useRef<number>(0);

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.gallery-card');

    // Track which card is in view
    cards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          activeCardRef.current = index;
          // Optional: Add active class
          cards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        },
        onEnterBack: () => {
          activeCardRef.current = index;
          cards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger instanceof HTMLElement &&
            trigger.trigger.classList.contains('gallery-card')) {
          trigger.kill();
        }
      });
    };
  }, []);

  return activeCardRef.current;
};
```

### 5.2 Update Gallery.tsx

```typescript
import { useGallerySnap } from '../hooks/useGallerySnap';

export const Gallery = () => {
  const activeCard = useGallerySnap();

  // ... existing code ...

  useEffect(() => {
    // ... existing animations ...

    // REMOVE OR COMMENT OUT parallax to avoid conflict
    // createParallax('.gallery-card', -15, '.gallery');

  }, []);

  // ... rest of component ...
};
```

---

## 6. Recommended Configuration

### Final CSS (Gallery.css)

```css
/* Enable scroll snapping in Gallery */
.gallery {
  position: relative;
}

.gallery-container {
  scroll-snap-type: y proximity;
  scroll-behavior: smooth;
}

.gallery-card {
  scroll-snap-align: center;  /* Center each card in viewport */
  scroll-margin-top: 100px;   /* Offset for fixed headers if any */
  scroll-snap-stop: normal;   /* Allow skipping cards on fast scroll */
}

/* Optional: Full-height cards */
@media (min-width: 968px) {
  .gallery-card {
    min-height: 60vh;  /* Make cards taller for better snap */
  }
}

/* Active card styling */
.gallery-card.active {
  transform: scale(1.02);
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
```

### Final TypeScript Updates

**Minimal changes to Gallery.tsx:**

1. Comment out parallax effect (line 72)
```typescript
// createParallax('.gallery-card', -15, '.gallery');  // Conflicts with snap
```

2. Optionally add `useGallerySnap()` hook for active tracking

---

## 7. Testing Checklist

### Functional Testing
- [ ] Scroll snapping works with mouse wheel
- [ ] Scroll snapping works with trackpad
- [ ] Scroll snapping works on mobile touch
- [ ] Can still fast-scroll through cards
- [ ] Title animation still triggers correctly
- [ ] Card batch animations still work
- [ ] Flip-back effect still works
- [ ] Unblur effect still works

### Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers

### Responsive Testing
- [ ] Desktop (1920px+)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

---

## 8. Implementation Steps

### Phase 1: CSS-Only Snap (15 minutes)
1. Add scroll-snap CSS properties to `Gallery.css`
2. Test basic snapping behavior
3. Adjust `scroll-snap-type` between `proximity` and `mandatory`
4. Test on different devices

### Phase 2: Disable Conflicting Animations (5 minutes)
1. Comment out `createParallax` in `Gallery.tsx`
2. Test that other animations still work
3. Adjust scroll-snap-align if needed

### Phase 3: Enhanced Tracking (Optional - 30 minutes)
1. Create `useGallerySnap.ts` hook
2. Add active card tracking
3. Add visual feedback for active card
4. Test and refine

### Total Time: 20-50 minutes

---

## 9. Configuration Options

### scroll-snap-type Values

```css
/* Proximity: Snap when close to card */
scroll-snap-type: y proximity;  /* ← Recommended */

/* Mandatory: Always snap to card */
scroll-snap-type: y mandatory;  /* Stricter, may feel restrictive */

/* None: Disable snapping */
scroll-snap-type: none;
```

### scroll-snap-align Values

```css
/* Start: Snap top of card to top of viewport */
scroll-snap-align: start;

/* Center: Snap center of card to center of viewport */
scroll-snap-align: center;  /* ← Recommended */

/* End: Snap bottom of card to bottom of viewport */
scroll-snap-align: end;
```

### scroll-snap-stop Values

```css
/* Normal: Allow fast scrolling past cards */
scroll-snap-stop: normal;  /* ← Recommended */

/* Always: Force stop at each card */
scroll-snap-stop: always;  /* May feel restrictive */
```

---

## 10. Fallback for Older Browsers

```css
/* Fallback for browsers without scroll-snap support */
@supports not (scroll-snap-type: y proximity) {
  .gallery-card {
    margin-bottom: 4rem;  /* Add spacing instead */
  }
}
```

**Browser Support:**
- ✅ Chrome 69+
- ✅ Firefox 68+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ All modern mobile browsers

Coverage: **~95% of users**

---

## 11. Alternative: Full JavaScript Solution

If CSS scroll-snap doesn't provide enough control, here's a pure GSAP solution:

**File:** `src/hooks/useGallerySnap.ts`

```typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export const useGallerySnap = () => {
  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.gallery-card');

    let scrollTimeout: NodeJS.Timeout;
    let isSnapping = false;

    const snapToNearest = () => {
      if (isSnapping) return;

      const scrollY = window.scrollY;
      const viewportCenter = scrollY + window.innerHeight / 2;

      // Find closest card to viewport center
      let closest = cards[0];
      let minDistance = Math.abs(closest.offsetTop - viewportCenter);

      cards.forEach(card => {
        const distance = Math.abs(card.offsetTop - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closest = card;
        }
      });

      // Snap to closest card
      isSnapping = true;
      gsap.to(window, {
        scrollTo: {
          y: closest,
          offsetY: window.innerHeight / 2 - closest.offsetHeight / 2,
        },
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          isSnapping = false;
        },
      });
    };

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(snapToNearest, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
};
```

**Usage in Gallery.tsx:**
```typescript
import { useGallerySnap } from '../hooks/useGallerySnap';

export const Gallery = () => {
  useGallerySnap();  // Add this line
  // ... rest of component
};
```

**Note:** Requires installing ScrollToPlugin if not already available:
```typescript
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);
```

---

## 12. Recommended Approach

**For simplicity and performance, use CSS scroll-snap:**

1. ✅ Add CSS properties to `Gallery.css`
2. ✅ Test and adjust `scroll-snap-type`
3. ✅ Comment out parallax effect in `Gallery.tsx`
4. ✅ Optionally add active card tracking

**Total code changes: ~10 lines**

This approach:
- Works with existing code
- No new dependencies
- Native browser performance
- Easy to test and adjust
- Mobile-friendly

---

## 13. Files to Modify

### Required
- `src/components/Gallery.css` - Add scroll-snap properties
- `src/components/Gallery.tsx` - Comment out parallax (line 72)

### Optional
- `src/hooks/useGallerySnap.ts` - Create for active tracking

---

## Success Criteria

### Must Have ✅
- [ ] Cards snap into view when scrolling through Gallery
- [ ] Existing batch animations still work
- [ ] Flip-back effect still works
- [ ] Unblur title effect still works
- [ ] Works on desktop and mobile
- [ ] Smooth 60fps performance

### Nice to Have 🎯
- [ ] Active card visual feedback
- [ ] Programmatic card navigation
- [ ] Keyboard navigation (arrow keys)
- [ ] Scroll progress indicator

---

**Specification Version:** 1.0
**Scope:** Gallery Component Only
**Estimated Implementation Time:** 20-50 minutes
**Status:** Ready for Implementation ✅
