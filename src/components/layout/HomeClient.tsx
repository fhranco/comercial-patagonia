"use client";

import React from "react";
import styles from "../../app/page.module.css";
import { motion, useScroll, useSpring } from "framer-motion";
import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";
import HeroSpectacular from "../../components/layout/HeroComodoro";
import CategoryBento from "../../components/shop/CategoryBento";
import TrustBar from "../../components/layout/TrustBar";
import FeaturedCarousel from "../../components/shop/FeaturedCarousel";
import FurnitureShowcase from "../../components/layout/FurnitureShowcase";
import GrandCement from "../../components/layout/GrandCement";
import { Product } from "@/types/woocommerce";
import Link from "next/link";

interface HomeClientProps {
  products: Product[];
}

export default function HomeClient({ products }: HomeClientProps) {
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const SHOP_URL = "/shop";

  return (
    <div className={styles.page} style={{ backgroundColor: 'var(--brand-sky)', color: 'var(--brand-navy)', minHeight: '100vh', width: '100%' }}>
      
      {/* 🚀 BARRA DE PROGRESO */}
      <motion.div style={{ scaleX: scaleProgress, position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'var(--primary-gold)', zIndex: 9999, transformOrigin: '0%' }} />

      <Navigation transparent={true} />

      <main style={{ width: '100%' }}>
        <HeroSpectacular />

        {/* 🌟 CARRUSEL DINÁMICO: Mostramos productos destacados de la tienda */}
        <FeaturedCarousel products={products.length > 0 ? products : []} />

        <GrandCement />
        <FurnitureShowcase />
        <CategoryBento />
        <TrustBar />

        {/* 🏢 HISTORIA Y TRADICIÓN */}
        <section style={{ padding: '120px 5%', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#FFF' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '100px', alignItems: 'center' }}>
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
                    <span style={{ color: 'var(--primary-gold)', fontSize: '11px', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase' }}>Patrimonio Regional</span>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, textTransform: 'uppercase', margin: '20px 0', lineHeight: 0.9, color: 'var(--brand-navy)' }}>TRADICIÓN <br/>DESDE 1980.</h2>
                    <p style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.8, marginBottom: '40px', maxWidth: '350px' }}>
                        Cuatro décadas forjando el comercio austral con equipamiento que resiste el fin del mundo.
                    </p>
                    <div>
                        <Link href={SHOP_URL} className="gold-shimmer" style={{ textDecoration: 'none', color: 'var(--brand-navy)', padding: '20px 45px', borderRadius: '4px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>Ver Catálogo Técnico</Link>
                    </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} viewport={{ once: true }} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: '20px', border: '1px solid var(--primary-gold)', zIndex: 0, transform: 'translate(10px, 10px)', borderRadius: '32px' }} />
                    <img src="/images/heritage.webp" style={{ width: '100%', borderRadius: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.15)', position: 'relative', zIndex: 1 }} alt="Tradición Comercial" />
                </motion.div>
            </div>
        </section>

        {/* 🏆 FRASE DE CIERRE */}
        <section style={{ padding: '150px 5%', textAlign: 'center', backgroundColor: '#FAFAFA' }}>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                SOLIDEZ QUE <br/><span style={{ color: 'var(--primary-gold)' }}>CONSTRUYE FUTURO.</span>
            </motion.h2>
            <div style={{ width: '150px', height: '2px', background: 'var(--primary-gold)', margin: '50px auto' }} />
            <Link href={SHOP_URL} style={{ color: 'var(--brand-navy)', textDecoration: 'none', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.3em', border: '2px solid var(--brand-navy)', padding: '20px 60px', borderRadius: '100px' }} className="hover:bg-[var(--brand-navy)] hover:text-white transition-all duration-500">Tienda Online Oficial</Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
