"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Bed, Utensils } from "lucide-react";
import Link from 'next/link';

export default function FurnitureShowcase() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);
  
  const y1 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, -150]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} style={{ backgroundColor: '#FFF', color: 'var(--brand-navy)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))' }}>
        
        {/* 🛌 DORMITORIO / ORGANIZACIÓN */}
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }} className="group">
          <motion.img 
            src="/images/showcase-dormitorio.png" 
            style={{ 
              width: '100%', height: '120%', objectFit: 'cover',
              y: y1, top: '-10%'
            }} 
            alt="Muebles de Organización" 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(255,255,255,0.4) 0%, transparent 60%)' }} />
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 'clamp(50px, 10vw, 120px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <Bed className="w-5 h-5 text-[var(--brand-navy)]" />
                <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--brand-navy)' }}>Calidez Interior</h3>
            </div>
            <h4 style={{ 
                fontSize: 'clamp(1.8rem, 4.5vw, 5.5rem)', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                lineHeight: 0.85, 
                margin: '0 0 40px 0', 
                color: 'var(--brand-navy)',
                letterSpacing: '-0.04em',
                fontFamily: 'var(--font-heading)'
            }}>MUEBLES DE <br/><span style={{ opacity: 0.9 }}>ORGANIZACIÓN</span></h4>
            <p style={{ maxWidth: '420px', fontSize: '1.1rem', opacity: 0.7, fontWeight: 500, marginBottom: '60px', lineHeight: 1.5, color: 'var(--brand-navy)' }}>
              Detalles que marcan la diferencia. Cajoneras, clósets y mobiliario de alta terminación para vestir tus espacios íntimos.
            </p>
            <div>
                <Link href="/shop?category=Cómodas" style={{ 
                color: 'var(--brand-navy)', textDecoration: 'none', border: '1px solid rgba(14,31,51,0.3)', padding: '24px 60px', borderRadius: '2px',
                fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em'
                }} className="hover:bg-[var(--brand-navy)] hover:text-white transition-all duration-700">
                Ver Cómodas
                </Link>
            </div>
          </motion.div>
        </div>

        {/* 🍷 COCINA / SISTEMAS */}
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }} className="group">
          <motion.img 
            src="/images/showcase-cocina.png" 
            style={{ 
              width: '100%', height: '120%', objectFit: 'cover',
              y: y2, top: '-10%'
            }} 
            alt="Muebles de Cocina" 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ position: 'absolute', inset: 'clamp(50px, 10vw, 120px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <Utensils className="w-5 h-5 text-[var(--primary-gold)]" />
                <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--primary-gold)' }}>Experiencias Compartidas</h3>
            </div>
            <h4 style={{ 
                fontSize: 'clamp(1.8rem, 4.5vw, 5.5rem)', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                lineHeight: 0.85, 
                margin: '0 0 40px 0', 
                color: '#FFF',
                letterSpacing: '-0.04em',
                fontFamily: 'var(--font-heading)'
            }}>SISTEMAS DE <br/>COCINA</h4>
            <p style={{ maxWidth: '420px', fontSize: '1.1rem', opacity: 0.6, fontWeight: 300, marginBottom: '60px', lineHeight: 1.5, color: '#FFF' }}>
              Vinotecas integradas y estanterías de alto tráfico con texturas de madera oscura. Excelencia funcional para el hogar.
            </p>
            <div>
                <Link href="/shop?category=Cocina" style={{ 
                color: '#FFF', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', padding: '24px 60px', borderRadius: '2px',
                fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em'
                }} className="hover:bg-white hover:text-[var(--brand-navy)] transition-all duration-700">
                Ver Catálogo
                </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
