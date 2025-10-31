import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextToLetters } from '../utils/textSplit';
import { staggerPresets, createTimelineWithCallbacks } from '../utils/gsapAdvanced';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Advanced timeline with progress tracking
    const footerTL = createTimelineWithCallbacks({
      scrollTrigger: {
        trigger: '.footer',
        start: 'top center',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          console.log('Footer progress:', self.progress.toFixed(2));
        }
      }
    });

    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll('.letter');
      footerTL.fromTo(letters, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.02,
          duration: 0.6 
        }
      )
      .call(() => {
        console.log('Footer title animated');
      });
    }

    // Features with edge-to-center stagger
    const features = document.querySelectorAll('.footer-features .footer-feature');
    if (features.length > 0) {
      footerTL.fromTo(features,
        { opacity: 0, scale: 0.5 },
        { 
          opacity: 1, 
          scale: 1,
          stagger: {
            each: 0.1,
            ...staggerPresets.edges
          },
          duration: 0.6
        },
        '-=0.3'
      );
    }

    if (ctaRef.current) {
      footerTL.to(ctaRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8
      }, '-=0.2');
    }
  }, []);

  const title = "S i a p   B e r t r a n s f o r m a s i ?";
  const titleLetters = splitTextToLetters(title);

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">
          <h2 ref={titleRef} className="footer-title">
            {titleLetters.map((item) => (
              <span key={item.index} className="letter">
                {item.char}
              </span>
            ))}
          </h2>

          <p className="footer-subtitle">
            Hubungi Kami Sekarang untuk Konsultasi Ahli mengenai Solusi Lengkap dan Regulasi Bisnis di Indonesia
          </p>

          <div ref={ctaRef} className="footer-cta">
            <a 
              href="https://api.whatsapp.com/send?phone=6281318288881&text=Halo%21+Saya+dapatkan+info+dari+website,+mengenai+penawaran+terbaik,+bisa+diskusi+lebih+lanjut+terkait+solusi+EOS+ini%3F" 
              className="footer-button"
            >
              Dapatkan Penawaran Terbaik
            </a>
            <a 
              href="https://api.whatsapp.com/send?phone=628111170405" 
              className="footer-button secondary"
            >
              Konsultasi Gratis
            </a>
          </div>

          <div className="footer-features">
            <div className="footer-feature">
              <span className="feature-text">IoT Sensors</span>
            </div>
            <div className="footer-feature">
              <span className="feature-text">RFID</span>
            </div>
            <div className="footer-feature">
              <span className="feature-text">MRP & APS</span>
            </div>
            <div className="footer-feature">
              <span className="feature-text">Andon Display</span>
            </div>
            <div className="footer-feature">
              <span className="feature-text">Ceisa 4.0</span>
            </div>
            <div className="footer-feature">
              <span className="feature-text">Coretax</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-info">
            <div className="footer-brand">
              <h3 className="brand-name">EOS Teknologi</h3>
              <p className="brand-tagline">Smart ERP Solutions for Global Business</p>
            </div>

            <div className="footer-links">
              <div className="link-group">
                <h4 className="link-title">Solutions</h4>
                <ul className="link-list">
                  <li><a href="#erp">ERP System</a></li>
                  <li><a href="#ceisa">Ceisa 4.0</a></li>
                  <li><a href="#iot">IoT Integration</a></li>
                  <li><a href="#rfid">RFID Technology</a></li>
                </ul>
              </div>

              <div className="link-group">
                <h4 className="link-title">Company</h4>
                <ul className="link-list">
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#testimonials">Testimonials</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>

              <div className="link-group">
                <h4 className="link-title">Support</h4>
                <ul className="link-list">
                  <li><a href="tel:+628111170405">+62 811-1170-405</a></li>
                  <li><a href="mailto:info@eosteknologi.com">info@eosteknologi.com</a></li>
                  <li><a href="https://api.whatsapp.com/send?phone=628111170405">WhatsApp</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-copyright">
            <p>&copy; 2025 EOS Teknologi. All rights reserved.</p>
            <div className="footer-social">
              <span>Follow us:</span>
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </footer>
  );
};
