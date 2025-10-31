import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { splitTextToLetters } from '../utils/textSplit';
import { createGlowEffect } from '../utils/gsapAdvanced';
import './Solutions.css';

gsap.registerPlugin(ScrollTrigger);

export const Solutions = () => {
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
      const cards = cardsRef.current.querySelectorAll('.solution-card');
      
      cards.forEach((card, index) => {
        const htmlCard = card as HTMLElement;
        
        gsap.fromTo(card,
          {
            opacity: 0,
            y: 100,
            rotateY: -15,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            scale: 1,
            duration: 1.2,
            delay: index * 0.15,
            ease: 'power3.out',
            
            // onUpdate for dynamic glow effect
            ...createGlowEffect(htmlCard, 60, '96, 165, 250'),
            
            // State callbacks
            onStart: () => {
              htmlCard.classList.add('animating');
            },
            onComplete: () => {
              htmlCard.classList.remove('animating');
              htmlCard.classList.add('animated');
            },
            
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
              onEnter: () => console.log(`Card ${index + 1} entered viewport`),
            }
          }
        );
      });
    }
  }, []);

  const title = "S o l u s i   L e n g k a p";
  const titleLetters = splitTextToLetters(title);

  return (
    <section className="solutions" id="solutions">
      <div className="solutions-container">
        <div className="solutions-label">Total Solusi / Complete Solutions</div>
        
        <h2 ref={titleRef} className="solutions-title">
          {titleLetters.map((item) => (
            <span key={item.index} className="letter">
              {item.char}
            </span>
          ))}
        </h2>

        <p className="solutions-subtitle">
          Solusi ERP Lengkap dengan Sensor Penghitung Produksi IoT, RFID, Ceisa 4.0, dan Coretax XML
        </p>

        <div ref={cardsRef} className="solutions-grid">
          <motion.div
            className="solution-card"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="card-title">IoT Sensor Integration</h3>
            <p className="card-description">
              Pemantauan kegiatan produksi secara real-time dengan sensor penghitung produksi IoT 
              yang memberikan data akurat tentang jumlah unit yang diproduksi.
            </p>
            <ul className="card-features">
              <li>Real-time production tracking</li>
              <li>Machine status monitoring</li>
              <li>Automated data collection</li>
            </ul>
          </motion.div>

          <motion.div
            className="solution-card featured"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="featured-badge">Popular</div>
            <h3 className="card-title">Andon Display System</h3>
            <p className="card-description">
              Tampilan visual status produksi secara real-time untuk meningkatkan koordinasi tim 
              dan mempercepat penyelesaian masalah operasional.
            </p>
            <ul className="card-features">
              <li>Visual feedback dashboard</li>
              <li>Alert notifications</li>
              <li>Team coordination tools</li>
            </ul>
          </motion.div>

          <motion.div
            className="solution-card"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="card-title">Ceisa 4.0 Integration</h3>
            <p className="card-description">
              Integrasi Host-to-Host Ceisa 4.0 untuk menyederhanakan proses Izin Ekspor/Impor 
              dan manajemen Kawasan Berikat dengan kepatuhan regulasi yang lancar.
            </p>
            <ul className="card-features">
              <li>PIB, PEB, TPB integration</li>
              <li>Automated customs clearance</li>
              <li>Compliance management</li>
            </ul>
          </motion.div>

          <motion.div
            className="solution-card"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="card-title">Coretax XML</h3>
            <p className="card-description">
              Integrasi akuntansi dengan Coretax untuk memudahkan unggah file XML dari transaksi 
              faktur langsung ke Portal untuk pelaporan pajak yang efisien.
            </p>
            <ul className="card-features">
              <li>Automated tax reporting</li>
              <li>XML file generation</li>
              <li>Compliance validation</li>
            </ul>
          </motion.div>

          <motion.div
            className="solution-card"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="card-title">RFID Technology</h3>
            <p className="card-description">
              Teknologi RFID untuk identifikasi barang jadi secara mulus, melacak pergerakannya 
              ke gudang, penempatan lokasi, hingga pengisian kontainer.
            </p>
            <ul className="card-features">
              <li>Seamless product identification</li>
              <li>Real-time location tracking</li>
              <li>Warehouse automation</li>
            </ul>
          </motion.div>

          <motion.div
            className="solution-card"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="card-title">Subcon Management</h3>
            <p className="card-description">
              Manajemen Jasa Maklon sesuai ketentuan beacukai, perhitungan bea masuk import, 
              HS Code, dan pengelolaan subkontraktor terintegrasi.
            </p>
            <ul className="card-features">
              <li>Customs compliance</li>
              <li>HS Code management</li>
              <li>Subcontractor tracking</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
