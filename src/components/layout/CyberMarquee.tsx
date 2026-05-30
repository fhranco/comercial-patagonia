"use client";

import React, { useState, useEffect } from "react";
import { Zap, Flame, X } from "lucide-react";

interface CyberMarqueeProps {
  onClose?: () => void;
}

export default function CyberMarquee({ onClose }: CyberMarqueeProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const newsItems = [
    "🔥 CYBERDAY PATAGONIA AHORA ACTIVO",
    "⚡ HASTA 35% DE DESCUENTO EN PRODUCTOS SELECCIONADOS",
    "🏔️ PRECIOS EXCLUSIVOS CYBERDAY EN MAGALLANES",
    "⚡ APROVECHA LAS OFERTAS CYBERDAY DE JUNIO 2026",
    "🔥 DESCUENTOS CYBERDAY EXCLUSIVOS POR TIEMPO LIMITADO"
  ];

  // Repeat items to fill marquee and ensure seamless looping
  const repeatedItems = [...newsItems, ...newsItems, ...newsItems];

  return (
    <div 
      style={{ 
        position: 'relative',
        width: '100%', 
        backgroundColor: '#FF4B4B', 
        color: '#FFFFFF', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(255, 75, 75, 0.25)',
        borderBottom: '2px solid var(--primary-gold)',
        zIndex: 10000,
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        fontWeight: 900,
        letterSpacing: '0.1em'
      }}
    >
      <style jsx global>{`
        @keyframes cyber-marquee-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .cyber-marquee-container {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: cyber-marquee-scroll 35s linear infinite;
          padding-right: 50px;
        }
        .cyber-marquee-container:hover {
          animation-play-state: paused;
        }
        .cyber-marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-right: 40px;
          text-transform: uppercase;
        }
        .cyber-marquee-badge {
          background-color: #FFFFFF;
          color: #FF4B4B;
          font-size: 9px;
          font-weight: 1000;
          padding: 2px 8px;
          border-radius: 100px;
          border: 1px solid var(--primary-gold);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Infinite scrolling marquee track */}
      <div className="cyber-marquee-container">
        {repeatedItems.map((item, index) => {
          const isDiscountText = item.includes("35%");
          return (
            <span key={index} className="cyber-marquee-item">
              {index % 2 === 0 ? <Flame size={12} style={{ color: 'var(--primary-gold)' }} className="animate-pulse" /> : <Zap size={12} style={{ color: '#FFFFFF' }} />}
              <span>{item}</span>
              {isDiscountText && (
                <span className="cyber-marquee-badge">
                  35% DCTO
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Elegant close button */}
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        style={{
          position: 'absolute',
          right: '15px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.25)',
          border: 'none',
          color: '#FFFFFF',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10001,
          transition: 'all 0.2s ease'
        }}
        className="hover:bg-black hover:scale-110 active:scale-95"
      >
        <X size={10} />
      </button>
    </div>
  );
}
