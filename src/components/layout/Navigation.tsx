"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X, ShoppingBag, Clock, Image as ImageIcon, Home } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { BRAND_CONFIG } from "@/lib/constants";

interface NavigationProps {
  transparent?: boolean;
}

export default function Navigation({ transparent = true }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav style={{ 
      position: 'fixed', top: 0, width: '100%', zIndex: 9000, 
      padding: isScrolled ? '15px 5%' : '30px 5%',
      background: (!transparent || isMobileMenuOpen || isScrolled) 
        ? 'rgba(255, 255, 255, 0.95)' 
        : 'transparent',
      backdropFilter: (!transparent || isMobileMenuOpen || isScrolled) ? 'blur(20px)' : 'none',
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      borderBottom: (!transparent || isScrolled || isMobileMenuOpen) ? '1px solid rgba(14, 31, 51, 0.1)' : 'none',
      color: (transparent && !isScrolled && !isMobileMenuOpen) ? '#FFFFFF' : 'var(--brand-navy)'
    }} className="nav-container">
      <style jsx>{`
        .nav-container {
          font-family: var(--font-heading);
        }
        @media (max-width: 1024px) {
          .nav-container {
            padding: 15px 5% !important;
          }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* 🏔️ LOGO HUD */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsMobileMenuOpen(false)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ position: 'relative', width: '280px', height: '80px' }}>
                    <Image 
                      src="/branding/logo-comercial.webp" 
                      alt={BRAND_CONFIG.name} 
                      fill 
                      priority
                      sizes="(max-width: 768px) 280px, 280px"
                      unoptimized={true}
                      style={{ objectFit: 'contain', filter: (transparent && !isScrolled && !isMobileMenuOpen) ? 'brightness(0) invert(1)' : 'none' }} 
                    />
                  </div>
                </div>
              </Link>
          </motion.div>
          
          {/* 📱 APP CONTROLS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ 
                  background: 'rgba(14, 31, 51, 0.05)', border: 'none', color: 'inherit', 
                  width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  cursor: 'pointer', borderRadius: '12px' 
                }}
              >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '40px', marginLeft: '40px' }}>
                  <Link href="/" style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', color: 'inherit', opacity: 0.9 }} className="hover:opacity-100 transition">
                      INICIO
                  </Link>

                  <Link href="/historial" style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', color: 'inherit', opacity: 0.9 }} className="hover:opacity-100 transition">
                      HISTORIAL
                  </Link>

                  <Link 
                    href={BRAND_CONFIG.calculatorUrl}
                    style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', color: 'inherit', opacity: 0.9 }} 
                    className="hover:opacity-100 transition"
                  >
                      CALCULADORA
                  </Link>



                  <Link href="/tienda" style={{ 
                      background: 'var(--brand-navy)', color: '#FFF',
                      padding: '14px 32px', borderRadius: '4px', 
                      fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: '15px'
                  }} className="hover:bg-[var(--brand-blue)] transition-all shadow-xl">
                      <span>VISITAR TIENDA</span>
                      <ArrowRight size={14} />
                  </Link>
              </div>
          </div>
      </div>
 
      {/* 🚀 APP-STYLE MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ 
              position: 'absolute', top: '100%', left: 0, width: '100%', 
              backgroundColor: '#FFF',
              padding: '40px 5%', borderBottom: '1px solid var(--border-color)',
              display: 'flex', flexDirection: 'column', gap: '15px'
            }}
          >
            <Link href="/tienda" onClick={() => setIsMobileMenuOpen(false)} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '24px', backgroundColor: 'var(--brand-blue)', color: '#FFF', 
              borderRadius: '12px', textDecoration: 'none' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ShoppingBag size={20} />
                <span style={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ver Catálogo</span>
              </div>
            </Link>

            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ 
              display: 'flex', alignItems: 'center', gap: '15px', 
              padding: '20px', borderRadius: '12px', textDecoration: 'none', color: 'inherit',
              border: '1px solid var(--border-color)'
            }}>
              <Home size={20} opacity={0.5} />
              <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Volver al Inicio</span>
            </Link>

            <Link href="/historial" onClick={() => setIsMobileMenuOpen(false)} style={{ 
              display: 'flex', alignItems: 'center', gap: '15px', 
              padding: '20px', borderRadius: '12px', textDecoration: 'none', color: 'inherit',
              border: '1px solid var(--border-color)'
            }}>
              <Clock size={20} opacity={0.5} />
              <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Historial de Cotizaciones</span>
            </Link>

            <Link 
              href={BRAND_CONFIG.calculatorUrl}
              onClick={() => setIsMobileMenuOpen(false)} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '15px', 
                padding: '20px', borderRadius: '12px', textDecoration: 'none', color: 'inherit',
                border: '1px solid var(--border-color)'
              }}
            >
              <ShoppingBag size={20} opacity={0.5} />
              <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Calculadora de Obra</span>
            </Link>


          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
