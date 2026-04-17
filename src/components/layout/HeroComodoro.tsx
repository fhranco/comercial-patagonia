"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  ArrowRight, ShieldCheck, MapPin, HardHat, 
  ShoppingBag, Truck, CheckCircle2, TrendingUp, Calculator
} from "lucide-react";

export default function HeroSpectacular() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  return (
    <section style={{ 
      position: 'relative', 
      height: '100vh', 
      width: '100%', 
      backgroundColor: 'var(--brand-sky)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* 🎬 BACKDROP CINEMÁTICO */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="/images/hero-nuevo.png" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          alt="Construcción en Patagonia"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(237, 243, 248, 0.95) 0%, rgba(237, 243, 248, 0.4) 100%)' }} />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ 
          position: 'relative',
          zIndex: 10,
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 5%',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '80px',
          alignItems: 'center'
        }}
      >
        {/* 🏗️ LADO IZQUIERDO: BRANDING & CTA */}
        <div>
          <motion.div variants={itemVariants} style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '12px', 
            background: 'var(--brand-yellow)', 
            border: '1px solid var(--brand-yellow)',
            padding: '10px 20px',
            borderRadius: '100px',
            marginBottom: '30px',
            color: 'var(--brand-navy)',
            backdropFilter: 'blur(10px)'
          }}>
            <TrendingUp className="w-4 h-4" />
            <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Distribuidor Oficial Patagonia
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} style={{ 
            color: 'var(--brand-navy)', 
            fontSize: 'clamp(3rem, 7vw, 5.5rem)', 
            fontWeight: 900, 
            lineHeight: 0.95,
            textTransform: 'uppercase',
            fontFamily: 'var(--font-heading)',
            marginBottom: '35px',
            letterSpacing: '-0.02em'
          }}>
            CEMENTO <br/>COMODORO <span style={{ color: 'var(--brand-blue)' }}>PCR</span>
          </motion.h1>

          <motion.p variants={itemVariants} style={{ 
            color: 'var(--brand-navy)', 
            fontSize: '1.2rem', 
            maxWidth: '550px',
            marginBottom: '50px',
            lineHeight: 1.7,
            fontWeight: 400
          }}>
            Abastecimiento estratégico de Cemento Portland para obras de alta exigencia climática. Fraguado optimizado para la Patagonia y certificación de calidad IRAM.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" className="gold-shimmer" style={{ 
              textDecoration: 'none', color: 'var(--brand-navy)', padding: '24px 50px', borderRadius: '4px',
              fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.15em',
              display: 'flex', alignItems: 'center', gap: '15px',
              boxShadow: '0 20px 40px rgba(212, 175, 55, 0.2)'
            }}>
              Ir a la Tienda <ShoppingBag className="w-4 h-4" />
            </Link>

            <Link href="/calculadora" style={{ 
              backgroundColor: '#0E1F33', color: 'white', padding: '24px 50px', borderRadius: '4px',
              fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '20px',
              boxShadow: '0 20px 40px rgba(14, 31, 51, 0.4)', textDecoration: 'none'
            }} className="hover:scale-105 transition-all group">
              <span style={{ borderBottom: '2px solid white', paddingBottom: '2px' }}>CALCULADORA DE MATERIALES</span>
              <Calculator className="w-6 h-6 text-white" />
            </Link>
          </motion.div>
        </div>

        {/* 🧩 LADO DERECHO: BENTO ECO-CARDS */}
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Card 1: Live Status */}
          <motion.div variants={itemVariants} className="titanium-glass" style={{ 
            padding: '35px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: '8px', height: '8px', background: '#25D366', borderRadius: '50%', boxShadow: '0 0 10px #25D366' }} 
                />
                <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', opacity: 0.6, letterSpacing: '0.1em' }}>Stock en Tiempo Real</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#25D366]" />
            </div>
            <h4 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px', color: '#FFF' }}>+2.5k Unidades</h4>
            <span style={{ fontSize: '13px', opacity: 0.4 }}>Cemento Comodoro PCR en bodega Central Magallanes.</span>
          </motion.div>

          {/* Card 2: Logística Pro */}
          <motion.div variants={itemVariants} className="titanium-glass" style={{ 
            padding: '35px', borderRadius: '24px', border: '1px solid rgba(212,175,55,0.15)',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0) 100%)'
          }}>
            <Truck className="w-8 h-8" style={{ marginBottom: '25px', color: '#D4AF37' }} />
            <h4 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px', color: '#FFF' }}>Logística Express</h4>
            <p style={{ fontSize: '13px', opacity: 0.5, lineHeight: 1.5 }}>Despacho directo a obra en Punta Arenas y alrededores en menos de 24hs con flota propia certificada.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <motion.div variants={itemVariants} className="titanium-glass" style={{ padding: '25px', borderRadius: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.03)' }}>
              <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: 900, color: '#FFF' }}>1980</span>
              <span style={{ fontSize: '9px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Tradición Regional</span>
            </motion.div>
            <motion.div variants={itemVariants} className="titanium-glass" style={{ padding: '25px', borderRadius: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.03)' }}>
              <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
              <span style={{ fontSize: '9px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Certificación IRAM</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 📟 INDICADOR DE SCROLL PREMIUM */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{ 
          position: 'absolute', 
          bottom: '40px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <motion.div 
          animate={{ height: [0, 60, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: '1px', background: 'var(--primary-gold)' }} 
        />
        <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary-gold)', letterSpacing: '0.5em', opacity: 0.6 }}>Explore el Catálogo</span>
      </motion.div>
    </section>
  );
}
