"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X, ShoppingBag, Clock, Home } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { BRAND_CONFIG } from "@/lib/constants";

interface NavigationProps {
  transparent?: boolean;
  hideUntilScroll?: boolean;
}

export default function Navigation({ transparent = true, hideUntilScroll = false }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHidden = hideUntilScroll && !isScrolled && !isMobileMenuOpen;

  return (
    <nav style={{ 
      position: 'fixed', top: 0, width: '100%', zIndex: 9000, 
      padding: isScrolled ? '15px 5%' : '30px 5%',
      background: (!transparent || isMobileMenuOpen || isScrolled) 
        ? 'rgba(255, 255, 255, 0.95)' 
        : 'transparent',
      backdropFilter: (!transparent || isMobileMenuOpen || isScrolled) ? 'blur(20px)' : 'none',
      transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
      opacity: isHidden ? 0 : 1,
      pointerEvents: isHidden ? 'none' : 'auto',
      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, background 0.6s cubic-bezier(0.16, 1, 0.3, 1), padding 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      borderBottom: (!transparent || isScrolled || isMobileMenuOpen) ? '1px solid rgba(14, 31, 51, 0.1)' : 'none',
      color: (transparent && !isScrolled && !isMobileMenuOpen) ? '#FFFFFF' : 'var(--brand-navy)'
    }} className="nav-container">
      <style jsx>{`
        .nav-container {
          font-family: var(--font-heading);
        }
        .nav-logo-box {
          position: relative;
          width: 280px;
          height: 80px;
        }
        @media (max-width: 1024px) {
          .nav-container {
            padding: 12px 5% !important;
          }
        }
        @media (max-width: 768px) {
          .nav-logo-box {
            width: 195px !important;
            height: 52px !important;
          }
        }
        @media (max-width: 380px) {
          .nav-logo-box {
            width: 160px !important;
            height: 45px !important;
          }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          
          {/* 🏔️ LOGO HUD */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsMobileMenuOpen(false)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div className="nav-logo-box">
                    <Image 
                      src="/branding/logo-comercial.webp" 
                      alt={BRAND_CONFIG.name} 
                      fill 
                      priority
                      sizes="(max-width: 768px) 195px, 280px"
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
              padding: '30px 5%', borderBottom: '1px solid var(--border-color)',
              display: 'flex', flexDirection: 'column', gap: '12px',
              maxHeight: 'calc(100vh - 80px)',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
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
