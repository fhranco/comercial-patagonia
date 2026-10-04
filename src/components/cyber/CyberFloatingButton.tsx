"use client";

import React from "react";
import Link from "next/link";
import { Flame, ArrowUpRight } from "lucide-react";
import { useCyberCampaign } from "@/lib/campaigns/useCyberCampaign";

export default function CyberFloatingButton() {
  const { isVisible, isActive, categoryUrl } = useCyberCampaign();

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="cyber-floating-wrapper"
      style={{
        position: 'fixed',
        bottom: '95px',
        right: '20px',
        zIndex: 8500,
        fontFamily: 'var(--font-heading)'
      }}
    >
      <style jsx>{`
        .cyber-floating-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: 100px;
          background: linear-gradient(135deg, #FF4B4B 0%, #D90429 55%, #990000 100%);
          color: #FFFFFF;
          border: 2px solid #FFFFFF;
          box-shadow: 0 10px 30px rgba(217, 4, 41, 0.55);
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
        }

        .cyber-floating-btn:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 16px 40px rgba(255, 75, 75, 0.7);
        }

        .cyber-floating-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .cyber-floating-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFE600;
        }

        .cyber-floating-label {
          font-size: 11px;
          font-weight: 1000;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .cyber-floating-pill {
          background: #FFFFFF;
          color: #D90429;
          font-size: 8px;
          font-weight: 1000;
          padding: 2px 6px;
          border-radius: 100px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .cyber-floating-wrapper {
            bottom: calc(92px + env(safe-area-inset-bottom, 0px)) !important;
            right: 15px !important;
          }
          .cyber-floating-btn {
            padding: 9px 14px;
            gap: 7px;
          }
          .cyber-floating-label {
            font-size: 10px;
            letter-spacing: 0.12em;
          }
        }

        @media (max-width: 380px) {
          .cyber-floating-wrapper {
            right: 10px !important;
          }
          .cyber-floating-btn {
            padding: 8px 12px;
            gap: 6px;
          }
        }
      `}</style>

      <Link 
        href={categoryUrl} 
        id="cyberday-floating-button"
        className="cyber-floating-btn"
        aria-label="Ver ofertas Cyberday"
      >
        <span className="cyber-floating-icon">
          <Flame size={16} className="animate-bounce" />
        </span>
        <span className="cyber-floating-label">CYBERDAY</span>
        <span className="cyber-floating-pill">
          {isActive ? "EN VIVO" : "OCT 2026"}
        </span>
        <ArrowUpRight size={13} style={{ opacity: 0.8 }} />
      </Link>
    </div>
  );
}
