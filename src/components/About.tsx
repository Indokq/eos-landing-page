import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextToLetters } from '../utils/textSplit';
import { animateValue } from '../utils/gsapAdvanced';
import { createUnblurEffect, createBackgroundShift } from '../utils/scrollUpAnimations';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll('.letter');
      gsap.fromTo(
        letters,
        { opacity: 0, y: 30, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.02,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        }
      );
    }

    if (contentRef.current) {
      const paragraphs = contentRef.current.querySelectorAll('p');
      gsap.fromTo(
        paragraphs,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 70%',
          },
        }
      );
    }

    // Pulsing stat numbers with repeat + yoyo
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat) => {
      const htmlStat = stat as HTMLElement;
      const targetValue = parseInt(htmlStat.textContent || '0');
      
      gsap.fromTo(htmlStat,
        { scale: 1 },
        {
          scale: 1.15,
          duration: 0.6,
          repeat: 2,
          yoyo: true,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: htmlStat,
            start: 'top 75%',
            onEnter: () => {
              // Trigger count-up animation
              htmlStat.textContent = '0';
              animateValue(htmlStat, 0, targetValue, 2000);
            }
          }
        }
      );
    });

    // Unblur effect for title when scrolling up
    createUnblurEffect('.about-title', '.about', 6);

    // Background color shift on scroll direction
    createBackgroundShift('.about', '.about', '#ffffff', '#faf8ff');

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        const triggerEl = trigger.vars.trigger;
        if (
          triggerEl === '.about' || 
          (typeof triggerEl === 'string' && (triggerEl.includes('.about') || triggerEl.includes('.stat')))
        ) {
          trigger.kill();
        }
      });
    };
  }, []);

  const title = "A p a   i t u   E O S   E R P ?";
  const titleLetters = splitTextToLetters(title);

  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-label">Tentang Kami / About Us</div>
        
        <h2 ref={titleRef} className="about-title">
          {titleLetters.map((item) => (
            <span key={item.index} className="letter">
              {item.char}
            </span>
          ))}
        </h2>

        <div className="about-japanese">EOS ERPとは？</div>

        <div ref={contentRef} className="about-content">
          <p className="about-text">
            EOS ERP adalah sistem manajemen terintegrasi yang dirancang khusus untuk industri manufaktur, 
            yang bertujuan untuk menyederhanakan dan mengoptimalkan seluruh proses bisnis. Dengan EOS ERP, 
            perusahaan dapat mengelola secara terpusat berbagai aspek operasional, mulai dari produksi, 
            persediaan, penjualan, pembelian, hingga akuntansi dan operasi impor/ekspor.
          </p>

          <p className="about-text">
            Sistem ini memberikan solusi end-to-end yang memungkinkan perusahaan untuk meningkatkan efisiensi, 
            mengurangi biaya, dan meningkatkan akurasi data secara real-time. Dengan EOS ERP, setiap departemen 
            dapat bekerja dengan informasi yang konsisten dan terintegrasi, memungkinkan pengambilan keputusan 
            yang lebih cepat dan tepat.
          </p>

          <p className="about-text">
            Sistem ini juga dilengkapi dengan fitur-fitur seperti pelaporan yang mendalam, manajemen rantai 
            pasokan yang lebih baik, serta sistem otomatisasi yang meminimalisir kesalahan manusia. Dengan demikian, 
            EOS ERP tidak hanya meningkatkan produktivitas tetapi juga memungkinkan perusahaan untuk beradaptasi 
            dengan perubahan pasar yang cepat, mengelola risiko lebih baik, dan memperkuat daya saing di pasar global.
          </p>
        </div>

        <div className="about-stats">
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Tahun Pengalaman</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Klien Terpuaskan</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99%</div>
            <div className="stat-label">Tingkat Kepuasan</div>
          </div>
        </div>
      </div>
    </section>
  );
};
