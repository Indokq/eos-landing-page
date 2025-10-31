import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { splitTextToLetters } from '../utils/textSplit';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

export const Testimonials = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll('.letter');
      gsap.fromTo(
        letters,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.02,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        }
      );
    }

    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.testimonial-card');
      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 70%',
          },
        }
      );
    }
  }, []);

  const title = "K l i e n   K a m i";
  const titleLetters = splitTextToLetters(title);

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-label">Testimonial / Customer Stories</div>
        
        <h2 ref={titleRef} className="testimonials-title">
          {titleLetters.map((item) => (
            <span key={item.index} className="letter">
              {item.char}
            </span>
          ))}
        </h2>

        <p className="testimonials-intro">
          Kami sangat bangga dan terhormat dapat membagikan kisah-kisah dari klien-klien luar biasa kami. 
          Setiap testimoni mencerminkan pengalaman unik dan memuaskan yang mereka alami bersama kami.
        </p>

        <div ref={cardsRef} className="testimonials-grid">
          <motion.div
            className="testimonial-card"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="testimonial-quote">"</div>
            <div className="testimonial-content">
              <p className="testimonial-text">
                Perusahaan kami telah memenuhi kebutuhan IT Inventory untuk Kawasan Berikat 
                dengan sistem EOS ini & Antarmuka ke SAP. Sistem ini sangat membantu dalam 
                meningkatkan efisiensi operasional kami.
              </p>
              <div className="testimonial-author">
                <div className="author-info">
                  <div className="author-name">Rubber Factory</div>
                  <div className="author-role">Manufacturing Industry</div>
                  <div className="author-tag">CUSTOMERS</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </motion.div>

          <motion.div
            className="testimonial-card"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="testimonial-quote">"</div>
            <div className="testimonial-content">
              <p className="testimonial-text">
                Terima kasih telah membantu mengotomatisasi sistem dan perangkat lunak Roll Tracking 
                di perusahaan kertas nasional kami. Implementasi yang sangat profesional dan hasil 
                yang memuaskan.
              </p>
              <div className="testimonial-author">
                <div className="author-info">
                  <div className="author-name">Paper Factory</div>
                  <div className="author-role">Paper Manufacturing</div>
                  <div className="author-tag">CUSTOMERS</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </motion.div>
        </div>

        <div className="clients-logo-section">
          <h3 className="clients-label">Dipercaya oleh perusahaan terkemuka</h3>
          <div className="logo-marquee">
            <div className="logo-marquee-content">
              <img src="/logos/logo-1.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-2.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-3.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-4.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-5.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-6.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-7.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-1.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-2.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-3.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-4.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-5.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-6.jpg" alt="Client Logo" className="client-logo" />
              <img src="/logos/logo-7.jpg" alt="Client Logo" className="client-logo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
