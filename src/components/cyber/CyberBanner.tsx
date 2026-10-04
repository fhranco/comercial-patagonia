"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Flame, ShieldCheck, Zap } from "lucide-react";
import CyberCountdown from "./CyberCountdown";
import { useCyberCampaign } from "@/lib/campaigns/useCyberCampaign";

export default function CyberBanner() {
  const { isVisible, isActive, categoryUrl } = useCyberCampaign();

  if (!isVisible) {
    return null;
  }

  return (
    <section
      id="cyber-banner"
      className="cyber-banner-section"
      aria-label="Campaña Cyber Monday Comercial de la Patagonia"
    >
      <style jsx>{`
        .cyber-banner-section {
          width: 100%;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1C0306 0%, #3D050C 35%, #7A0A15 70%, #A60F1E 100%);
          border-top: 1px solid rgba(255, 75, 75, 0.25);
          border-bottom: 3px solid #FF4B4B;
          box-shadow: 0 20px 50px rgba(122, 10, 21, 0.4);
          padding: 40px 5%;
          color: #FFFFFF;
          font-family: var(--font-heading, inherit);
        }

        .cyber-ambient-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70%;
          height: 140%;
          background: radial-gradient(circle, rgba(255, 75, 75, 0.25) 0%, transparent 70%);
          filter: blur(50px);
          pointer-events: none;
          z-index: 1;
        }

        .cyber-banner-inner {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
          flex-wrap: wrap;
        }

        .cyber-info-col {
          flex: 1 1 500px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cyber-badge-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 9px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          background: #FF4B4B;
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 0 15px rgba(255, 75, 75, 0.6);
        }

        .trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.9);
        }

        .cyber-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 1000;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 0;
          color: #FFFFFF;
        }

        .cyber-highlight {
          color: #FFE600;
          text-shadow: 0 0 25px rgba(255, 75, 75, 0.8);
        }

        .cyber-description {
          font-size: 13px;
          line-height: 1.5;
          color: #FFE5E7;
          margin: 0;
          max-width: 580px;
        }

        .cyber-actions-col {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .cyber-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 36px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          text-decoration: none;
          background: #FFFFFF;
          color: #7A0A15;
          border: 2px solid #FFFFFF;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
        }

        .cyber-cta-btn:hover {
          transform: translateY(-2px);
          background: #FFE600;
          color: #59040C;
          border-color: #FFE600;
          box-shadow: 0 15px 35px rgba(255, 230, 0, 0.5);
        }

        .cyber-cta-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 900px) {
          .cyber-banner-inner {
            flex-direction: column;
            align-items: stretch;
            gap: 25px;
          }
          .cyber-info-col {
            flex: 1 1 auto;
            min-width: 0;
            width: 100%;
          }
          .cyber-actions-col {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
            width: 100%;
          }
          .cyber-cta-btn {
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .cyber-banner-section {
            padding: 26px 16px;
          }
          .status-badge {
            font-size: 8px;
            letter-spacing: 0.1em;
            padding: 5px 10px;
          }
          .trust-badge {
            font-size: 8px;
            letter-spacing: 0.08em;
          }
          .cyber-title {
            font-size: clamp(1.4rem, 5.5vw, 1.8rem);
            line-height: 1.1;
          }
          .cyber-description {
            font-size: 12px;
            line-height: 1.45;
          }
          .cyber-cta-btn {
            padding: 14px 18px;
            font-size: 10px;
            letter-spacing: 0.15em;
          }
        }
      `}</style>

      {/* Halo de luz de fondo */}
      <div className="cyber-ambient-glow" />

      <div className="cyber-banner-inner">
        {/* Columna informativa */}
        <div className="cyber-info-col">
          <div className="cyber-badge-row">
            <div className="status-badge">
              {isActive ? (
                <>
                  <Flame size={12} className="animate-bounce" />
                  <span>EVENTO EN VIVO — CYBER MONDAY</span>
                </>
              ) : (
                <>
                  <Zap size={12} />
                  <span>PRÓXIMO LANZAMIENTO — CYBER MONDAY 2026</span>
                </>
              )}
            </div>
            <div className="trust-badge">
              <ShieldCheck size={13} style={{ color: "#FFE600" }} />
              <span>Comercial de la Patagonia • Punta Arenas</span>
            </div>
          </div>

          <h2 className="cyber-title">
            {isActive ? (
              <>
                CYBER PATAGONIA: <span className="cyber-highlight">OFERTAS EN VIVO.</span>
              </>
            ) : (
              <>
                CYBER PATAGONIA <span className="cyber-highlight">2026.</span>
              </>
            )}
          </h2>

          <p className="cyber-description">
            {isActive
              ? "Descuentos exclusivos en muebles para el hogar, cocinas completas, revestimientos, herramientas y materiales de construcción con despacho en Magallanes."
              : "Prepárate para la apertura del 05 al 07 de Octubre de 2026. Precios directos de fábrica en equipamiento para tu hogar y obra en Punta Arenas."}
          </p>
        </div>

        {/* Columna de acción: Countdown + CTA */}
        <div className="cyber-actions-col">
          <CyberCountdown />

          <Link href={categoryUrl} className="cyber-cta-btn" id="cyber-banner-cta">
            <span>{isActive ? "Comprar ofertas Cyber" : "Ver productos Cyber"}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
