# EOS Teknologi Landing Page - Three.js Implementation

A stunning landing page recreation combining EOS Teknologi's content with Mater Agency's premium animation style, featuring extensive Three.js 3D effects and smooth GSAP animations.

## 🎨 Features

### Visual Effects
- **Three.js 3D Particle Field**: Animated particle system with custom shaders
- **Floating Geometric Shapes**: Interactive 3D objects (torus, sphere, box) with distortion effects
- **Custom Cursor**: Blend-mode cursor that follows mouse movement
- **Smooth Scroll**: Lenis smooth scroll implementation
- **GSAP Animations**: Advanced scroll-triggered animations with letter-by-letter reveals

### Sections
1. **Hero Section**
   - 3D particle background with WebGL shaders
   - Animated floating geometries
   - Letter-by-letter text animations
   - Benefit cards with hover effects
   - Scroll indicator

2. **About Section**
   - Japanese/Indonesian bilingual content
   - Animated text reveals
   - Statistics cards
   - Rotating gradient background

3. **Solutions Section**
   - 6 solution cards with 3D transforms
   - Framer Motion hover effects
   - IoT, RFID, Ceisa 4.0, Coretax integration highlights
   - Featured card styling

4. **Features Section**
   - ERP, Ceisa 4.0, Subcon Management
   - Animated feature items
   - Tag system
   - Floating visual boxes

5. **Testimonials Section**
   - Client testimonials with animated cards
   - Rotating gradient effects
   - Client logo showcase
   - Card glow effects

6. **Footer Section**
   - Animated CTA section
   - Feature badges
   - Contact information
   - Social links
   - Floating particles

## 🛠️ Tech Stack

### Core
- **React 19** - Latest React with TypeScript
- **TypeScript** - Type-safe development
- **Vite 7** (Rolldown) - Lightning-fast bundler

### 3D & Animation
- **Three.js** (^0.170.0) - WebGL 3D library
- **@react-three/fiber** (^8.17.10) - React renderer for Three.js
- **@react-three/drei** (^9.118.3) - Useful helpers for R3F
- **GSAP** (^3.12.5) - Professional-grade animation
- **Framer Motion** (^12.4.2) - React animation library
- **Lenis** (^1.1.17) - Smooth scroll

### Development
- **vite-plugin-glsl** - GLSL shader support
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript linting

## 📁 Project Structure

```
src/
├── components/           # Main page components
│   ├── Hero.tsx         # Hero section with 3D scene
│   ├── About.tsx        # About section
│   ├── Solutions.tsx    # Solutions grid
│   ├── Features.tsx     # Features list
│   ├── Testimonials.tsx # Client testimonials
│   └── Footer.tsx       # Footer CTA
├── three/               # Three.js components
│   ├── ParticleField.tsx      # Particle system
│   ├── FloatingGeometry.tsx   # 3D shapes
│   └── shaders/              # GLSL shaders
│       ├── vertexShader.glsl
│       └── fragmentShader.glsl
├── hooks/               # Custom React hooks
│   ├── useSmoothScroll.ts    # Lenis integration
│   ├── useMousePosition.ts   # Mouse tracking
│   └── useScrollAnimation.ts # GSAP ScrollTrigger
├── utils/               # Utility functions
│   ├── textSplit.ts    # Text splitting utilities
│   └── animations.ts   # Animation helpers
├── App.tsx             # Main app component
├── App.css            # App styles
└── index.css          # Global styles
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:5173

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## 🎯 Animation Patterns

### Text Animations
- **Letter-by-letter reveals**: Characters animate in with stagger
- **Word animations**: Smooth fade and slide for paragraphs
- **3D perspective**: RotateX transforms for depth

### Card Animations
- **Scale + Translate**: Hover effects with 3D transforms
- **Magnetic hover**: Cards respond to mouse position
- **Glow effects**: Radial gradients on hover

### Scroll Animations
- **ScrollTrigger**: GSAP-powered scroll-based animations
- **Parallax**: Different scroll speeds for depth
- **Fade & Slide**: Opacity + transform combinations

## 🎨 Design Principles

### Color Palette
- **Primary**: #60a5fa (Sky blue)
- **Secondary**: #3b82f6 (Blue)
- **Background**: #0a0e27 (Dark navy)
- **Accent**: Gradients with transparency

### Typography
- **Primary Font**: Inter (300-900 weights)
- **Japanese Font**: Noto Sans JP
- **Letter Spacing**: Wide spacing for titles (0.15em)

### Spacing
- Generous whitespace (8rem sections)
- Consistent grid gaps (2rem default)
- Responsive padding adjustments

## 📱 Responsive Design

- Desktop-first approach
- Breakpoints:
  - 968px: Tablet layout adjustments
  - 768px: Mobile optimizations
- Touch-optimized interactions
- Custom cursor hidden on mobile

## ⚡ Performance Optimizations

1. **Three.js**
   - Efficient geometry instancing
   - Shader-based animations (GPU)
   - Proper disposal of resources

2. **React**
   - Memoization for expensive calculations
   - Lazy loading for heavy components
   - Debounced scroll handlers

3. **Animation**
   - RequestAnimationFrame for smooth 60fps
   - CSS transforms over position changes
   - Will-change hints for optimization

## 🔧 Configuration

### Vite Config
- GLSL shader support via vite-plugin-glsl
- React plugin with Fast Refresh
- Asset handling for .glsl files

### TypeScript
- Strict mode enabled
- Path aliases configured
- Type-safe component props

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- WebGL 2.0 required for shaders

## 📄 Content

All content reflects EOS Teknologi's actual services:
- ERP solutions for manufacturing
- IoT sensor integration
- RFID technology
- Ceisa 4.0 host-to-host integration
- Coretax XML accounting
- Subcon management systems

## 🎓 Learning Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [GSAP Documentation](https://greensock.com/docs/)
- [Framer Motion](https://www.framer.com/motion/)

## 📝 License

Private project for EOS Teknologi

## 🙏 Credits

- Design inspiration: Mater Agency
- Content: EOS Teknologi
- Implementation: Three.js + React ecosystem

---

Built with ❤️ using Three.js, React, and modern web technologies
