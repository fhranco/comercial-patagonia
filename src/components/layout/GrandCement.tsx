"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Snowflake, Weight, ArrowUpRight } from "lucide-react";
import Link from 'next/link';

export default function GrandCement() {
  return (
    <section style={{ padding: '150px 5%', backgroundColor: '#FFF', color: 'var(--brand-navy)', position: 'relative', overflow: 'hidden' }}>
      
      {/* 🏔️ FONDO AMBIENTE (REPRESENTACIÓN OFICIAL) */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '100%', opacity: 0.05 }}>
          <img src="/images/comodoro-2000.png" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) brightness(1.5)' }} alt="Ambiente Industrial" />
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '80px', alignItems: 'center' }}>
        
        {/* 📝 INFO & TECH SPECS */}
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <div style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: 'var(--brand-yellow)', color: 'var(--brand-navy)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '40px' }}>Representante Oficial Magallanes</div>
          <h2 style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.85, marginBottom: '50px', color: 'var(--brand-blue)' }}>CEMENTO <br/>COMODORO</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '80px' }}>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
              <ShieldCheck className="w-8 h-8 text-[var(--brand-navy)] mb-4" />
              <h5 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '5px' }}>Resistencia Ultra</h5>
              <p style={{ fontSize: '14px', opacity: 0.8, fontWeight: 400, lineHeight: 1.5 }}>Normas IRAM certificadas para estructuras críticas.</p>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
              <Snowflake className="w-8 h-8 text-[var(--brand-navy)] mb-4" />
              <h5 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '5px' }}>Clima Extremo</h5>
              <p style={{ fontSize: '14px', opacity: 0.8, fontWeight: 400, lineHeight: 1.5 }}>Fraguado optimizado para bajas temperaturas regionales.</p>
            </div>
          </div>

          <Link href="/shop/cemento-comodoro" style={{ 
            color: 'var(--brand-navy)', textDecoration: 'none', border: '2px solid var(--brand-navy)', padding: '24px 60px', borderRadius: '100px',
            fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', display: 'inline-flex', alignItems: 'center', gap: '20px'
          }} className="hover:bg-[var(--brand-navy)] hover:text-white transition-all">
            Ficha Técnica <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* 🏔️ PRODUCT VISUAL (FOTOGRAFÍA ESCÉNICA) */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, type: 'spring' }} viewport={{ once: true }} style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute', inset: '-20px', 
            background: 'radial-gradient(circle, var(--brand-blue) 0%, transparent 70%)',
            opacity: 0.05, filter: 'blur(40px)', zIndex: 0
          }} />
          <img 
            src="/images/comodoro-nuevo.png" 
            style={{ 
              width: '100%', 
              position: 'relative', 
              zIndex: 1, 
              borderRadius: '8px',
              boxShadow: '0 25px 50px -12px rgba(14, 31, 51, 0.25)' 
            }} 
            alt="Presentación Cemento Comodoro en Patagonia" 
          />
        </motion.div>

      </div>
    </section>
  );
}
