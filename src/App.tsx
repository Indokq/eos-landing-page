import { useEffect } from 'react';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { About } from './components/About';
import { Solutions } from './components/Solutions';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { ScrollProgressIndicator } from './components/ScrollProgressIndicator';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useMousePosition } from './hooks/useMousePosition';
import { useScrollDirection } from './hooks/useScrollDirection';
import './App.css';

function App() {
  useSmoothScroll();
  const mousePosition = useMousePosition();
  const scrollData = useScrollDirection();

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    if (cursor) {
      cursor.style.left = `${mousePosition.x}px`;
      cursor.style.top = `${mousePosition.y}px`;
    }
  }, [mousePosition]);

  // Update body data attribute for scroll position
  useEffect(() => {
    if (scrollData.scrollY > 100) {
      document.body.setAttribute('data-scroll', 'active');
    } else {
      document.body.setAttribute('data-scroll', '0');
    }
  }, [scrollData.scrollY]);

  return (
    <div className="app" data-scroll-direction={scrollData.direction || 'none'}>
      <div className="custom-cursor"></div>
      <ScrollProgressIndicator />
      <Hero />
      <Gallery />
      <About />
      <Solutions />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;
