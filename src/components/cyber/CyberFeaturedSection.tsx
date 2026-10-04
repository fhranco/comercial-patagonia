"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types/woocommerce";
import { CYBER_CAMPAIGN_CONFIG } from "@/lib/campaigns/cyber";
import { useCyberCampaign } from "@/lib/campaigns/useCyberCampaign";

interface CyberFeaturedSectionProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export default function CyberFeaturedSection({ products, onQuickView }: CyberFeaturedSectionProps) {
  const { isClient, isVisible, categoryUrl } = useCyberCampaign();

  // Si la campaña finalizó (ENDED), o no hay productos, la sección se oculta completamente sin dejar huecos
  if (!isClient || !isVisible || !products || products.length === 0) {
    return null;
  }

  // Asegurar mostrar exactamente hasta 8 productos según requerimiento
  const displayProducts = products.slice(0, CYBER_CAMPAIGN_CONFIG.featuredLimit || 8);

  return (
    <section
      id="cyber-featured"
      className="cyber-featured-section"
      aria-label="Productos destacados Cyber Monday"
    >
      <style jsx>{`
        .cyber-featured-section {
          padding: 80px 5%;
          background: #FFFFFF;
          position: relative;
          overflow: hidden;
        }

        .cyber-featured-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .cyber-featured-header {
          margin-bottom: 50px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cyber-section-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--primary-gold, #D4AF37);
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.3em;
        }

        .cyber-section-title {
          font-size: clamp(2rem, 5vw, 3.4rem);
          font-weight: 1000;
          text-transform: uppercase;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #0E1F33;
          margin: 0;
          font-family: var(--font-heading, inherit);
        }

        .cyber-title-accent {
          color: var(--primary-gold, #D4AF37);
        }

        .cyber-section-subtitle {
          font-size: 14px;
          line-height: 1.6;
          color: #64748B;
          margin: 0;
          max-width: 650px;
        }

        .cyber-products-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 25px;
        }

        @media (min-width: 640px) {
          .cyber-products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
        }

        @media (min-width: 1024px) {
          .cyber-products-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 35px;
          }
        }

        .cyber-footer-cta {
          margin-top: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          text-align: center;
        }

        .cyber-full-catalog-btn {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: #0E1F33;
          color: #FFFFFF;
          border: 2px solid var(--primary-gold, #D4AF37);
          padding: 18px 45px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 15px 35px rgba(14, 31, 51, 0.15);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cyber-full-catalog-btn:hover {
          background: var(--primary-gold, #D4AF37);
          color: #0E1F33;
          border-color: var(--primary-gold, #D4AF37);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(212, 175, 55, 0.35);
        }

        .cyber-full-catalog-btn:active {
          transform: translateY(0);
        }

        .cyber-cta-note {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94A3B8;
        }
      `}</style>

      <div className="cyber-featured-container">
        {/* Header de la sección */}
        <div className="cyber-featured-header">
          <div className="cyber-section-badge">
            <Flame size={16} className="animate-pulse" style={{ color: "var(--brand-yellow, #F9C300)" }} />
            <span>SELECCIÓN DESTACADA • CYBER MONDAY</span>
          </div>

          <h2 className="cyber-section-title">
            OFERTAS DESTACADAS <span className="cyber-title-accent">CYBER.</span>
          </h2>

          <p className="cyber-section-subtitle">
            Equipamiento para el hogar, cocinas completas, muebles reforzados, revestimientos y herramientas con tarifas preferenciales por tiempo limitado.
          </p>
        </div>

        {/* Grilla responsiva de 8 productos */}
        <div className="cyber-products-grid">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Footer CTA a la categoría completa */}
        <div className="cyber-footer-cta">
          <Link
            href={categoryUrl}
            className="cyber-full-catalog-btn"
            id="cyber-featured-cta"
          >
            <span>Ver todas las ofertas Cyber</span>
            <ArrowRight size={15} />
          </Link>
          <span className="cyber-cta-note">
            Catálogo completo con despacho directo coordinado en Punta Arenas y toda la Región de Magallanes
          </span>
        </div>
      </div>
    </section>
  );
}
