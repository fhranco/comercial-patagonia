"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, X } from "lucide-react";

interface JuneMarqueeProps {
  onClose?: () => void;
}

export default function JuneMarquee({ onClose }: JuneMarqueeProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const newsItems = [
    "✨ ESPECIAL MUEBLES DE JUNIO: NUEVA IMPORTACIÓN ZANZINI",
    "🛋️ CÓMODAS, ZAPATERAS Y ORGANIZADORES DE ALTA GAMA",
    "🏔️ STOCK DISPONIBLE PARA DESPACHO INMEDIATO EN MAGALLANES",
    "✨ CALIDAD PREMIUM CON ACABADOS Y DISEÑO EXCLUSIVO",
    "🚛 DESPACHO A DOMICILIO EN PUNTA ARENAS, NATALES Y TODA LA REGIÓN"
  ];

  // Repeat items to ensure seamless loop
  const repeatedItems = [...newsItems, ...newsItems, ...newsItems];

  return (
    <div 
      style={{ 
        position: 'relative',
        width: '100%', 
        backgroundColor: '#071220', // Deep dark background
        color: '#FFFFFF', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(14, 31, 51, 0.25)',
        borderBottom: '2px solid #D4AF37', // Gold border
        zIndex: 10000,
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        fontWeight: 800,
        letterSpacing: '0.12em'
      }}
    >
      <style jsx global>{`
        @keyframes june-marquee-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .june-marquee-container {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: june-marquee-scroll 40s linear infinite;
          padding-right: 50px;
        }
        .june-marquee-container:hover {
          animation-play-state: paused;
        }
        .june-marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-right: 50px;
          text-transform: uppercase;
        }
        .june-marquee-badge {
          background-color: #D4AF37;
          color: #000000;
          font-size: 8px;
          font-weight: 1000;
          padding: 2px 8px;
          border-radius: 100px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Infinite scrolling marquee track */}
      <div className="june-marquee-container">
        {repeatedItems.map((item, index) => {
          const isZanzini = item.includes("ZANZINI");
          return (
            <span key={index} className="june-marquee-item">
              {index % 2 === 0 ? (
                <Sparkles size={12} style={{ color: '#D4AF37' }} className="animate-pulse" />
              ) : (
                <Sparkles size={10} style={{ color: '#FFFFFF' }} />
              )}
              <span>{item}</span>
              {isZanzini && (
                <span className="june-marquee-badge">
                  NUEVO
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
          background: 'rgba(255, 255, 255, 0.08)',
          border: 'none',
          color: '#FFFFFF',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10001,
          transition: 'all 0.2s ease'
        }}
        className="hover:bg-white hover:text-black hover:scale-110 active:scale-95"
      >
        <X size={10} />
      </button>
    </div>
  );
}
