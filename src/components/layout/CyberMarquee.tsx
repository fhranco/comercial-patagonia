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
        "⚡ HASTA 40% DE DESCUENTO EN LÍNEAS SELECCIONADAS",
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
        backgroundColor: isActive ? '#FF4B4B' : '#0E1F33', 
        color: '#FFFFFF', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        overflow: 'hidden',
        boxShadow: isActive ? '0 4px 15px rgba(255, 75, 75, 0.25)' : '0 4px 15px rgba(14, 31, 51, 0.35)',
        borderBottom: '2px solid var(--primary-gold)',
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
          const isDiscountText = item.includes("40%");
          return (
            <span key={index} className="cyber-marquee-item">
              {isActive ? (
                index % 2 === 0 ? <Flame size={12} style={{ color: 'var(--primary-gold)' }} className="animate-pulse" /> : <Zap size={12} style={{ color: '#FFFFFF' }} />
              ) : (
                index % 2 === 0 ? <Clock size={12} style={{ color: 'var(--primary-gold)' }} /> : <Zap size={12} style={{ color: 'var(--primary-gold)' }} />
              )}
              <span>{item}</span>
              {discountTextBadge(isDiscountText)}
            </span>
          );
        })}
      </div>

      {/* Elegant close button */}
      <button
        onClick={() => {
          setIsDismissed(true);
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
        aria-label="Cerrar marquesina Cyber"
      >
        <X size={10} />
      </button>
    </div>
  );
}

function discountTextBadge(isDiscountText: boolean) {
  if (!isDiscountText) return null;
  return (
    <span className="cyber-marquee-badge">
      40% DCTO
    </span>
  );
}
