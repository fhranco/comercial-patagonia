"use client";

import React, { useState } from "react";
import { Zap, Flame, X, Clock } from "lucide-react";
import { useCyberCampaign } from "@/lib/campaigns/useCyberCampaign";

interface CyberMarqueeProps {
  onClose?: () => void;
}

export default function CyberMarquee({ onClose }: CyberMarqueeProps) {
  const { isVisible: isCampaignVisible, isActive } = useCyberCampaign();
  const [isDismissed, setIsDismissed] = useState(false);

  // Si la campaña finalizó (ENDED) o el usuario la cerró, no renderizar
  if (!isCampaignVisible || isDismissed) {
    return null;
  }

  // Mensajes diferenciados según estado: Expectativa en PRE_START vs Ofertas en ACTIVE
  const newsItems = isActive
    ? [
        "🔥 CYBER PATAGONIA 2026: OFERTAS EN VIVO EN COMERCIAL DE LA PATAGONIA",
        "⚡ OFERTAS CYBER EN PRODUCTOS SELECCIONADOS",
        "🏔️ PRECIOS EXCLUSIVOS CYBER EN PUNTA ARENAS Y MAGALLANES",
        "⚡ PRECIOS ESPECIALES CYBER DEL 5 AL 7 DE OCTUBRE",
        "🔥 DESPACHO DIRECTO EN MAGALLANES • COMPRA ONLINE SEGURA"
      ]
    : [
        "🏔️ CYBER MONDAY 2026 — COMIENZA ESTE 5 DE OCTUBRE",
        "⚡ PREPÁRATE PARA NUESTRO CYBER EN COMERCIAL DE LA PATAGONIA",
        "🏔️ EQUIPAMIENTO PARA EL HOGAR Y OBRAS EN MAGALLANES",
        "⚡ DEL 05 AL 07 DE OCTUBRE EN PUNTA ARENAS"
      ];

  // Repeat items to fill marquee and ensure seamless looping
  const repeatedItems = [...newsItems, ...newsItems, ...newsItems];

  return (
    <div 
      style={{ 
        position: 'relative',
        width: '100%', 
        background: 'linear-gradient(90deg, #990000 0%, #D90429 50%, #990000 100%)', 
        color: '#FFFFFF', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(217, 4, 41, 0.45)',
        borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
        zIndex: 10000,
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        fontWeight: 950,
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
        @media (max-width: 640px) {
          .cyber-marquee-item {
            font-size: 10px;
            margin-right: 28px;
            gap: 6px;
          }
        }
      `}</style>

      {/* Infinite scrolling marquee track */}
      <div className="cyber-marquee-container">
        {repeatedItems.map((item, index) => (
          <span key={index} className="cyber-marquee-item">
            {isActive ? (
              index % 2 === 0 ? <Flame size={12} style={{ color: '#FFE600' }} className="animate-pulse" /> : <Zap size={12} style={{ color: '#FFFFFF' }} />
            ) : (
              index % 2 === 0 ? <Clock size={12} style={{ color: '#FFE600' }} /> : <Zap size={12} style={{ color: '#FFE600' }} />
            )}
            <span>{item}</span>
          </span>
        ))}
      </div>

      {/* Subtle fade mask on right edge to improve close button legibility */}
      <div 
        style={{ 
          position: 'absolute', 
          right: 0, 
          top: 0, 
          bottom: 0, 
          width: '50px', 
          background: 'linear-gradient(to right, transparent, #990000)', 
          pointerEvents: 'none', 
          zIndex: 10000 
        }} 
      />

      {/* Accessible close button */}
      <button
        onClick={() => {
          setIsDismissed(true);
          onClose?.();
        }}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#FFFFFF',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10001,
          transition: 'all 0.2s ease'
        }}
        className="hover:bg-black hover:scale-110 active:scale-95"
        aria-label="Cerrar marquesina Cyber"
      >
        <X size={12} />
      </button>
    </div>
  );
}
