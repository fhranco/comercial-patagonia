"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Flame, ArrowRight } from "lucide-react";
import { Product } from "@/types/woocommerce";
import { useCyberCampaign } from "@/lib/campaigns/useCyberCampaign";

interface CyberProductsMarqueeProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export default function CyberProductsMarquee({ products, onQuickView }: CyberProductsMarqueeProps) {
  const { isVisible, isActive, categoryUrl } = useCyberCampaign();

  // Filtrar productos que pertenecen a la categoría Cyber o están marcados para Cyber
  const cyberItems = products.filter(p => 
    p.categories && Array.isArray(p.categories) && 
    p.categories.some(cat => cat.slug && (cat.slug.toLowerCase() === "cyberday" || cat.slug.toLowerCase() === "cybermonday"))
  );

  // Fallback si la lista filtrada es pequeña: usar los productos disponibles
  const displayItems = cyberItems.length >= 4 ? cyberItems : products.slice(0, 12);

  if (!isVisible || displayItems.length === 0) {
    return null;
  }

  // Duplicar elementos para un bucle continuo e imperceptible
  const marqueeItems = [...displayItems, ...displayItems];

  return (
    <section 
      id="cyber-products-marquee"
      className="cyber-marquee-section"
      aria-label="Productos de la Campaña Cyber"
    >
      <style jsx global>{`
        .cyber-marquee-section {
          width: 100%;
          max-width: 100vw;
          overflow: hidden;
          position: relative;
          padding: 35px 0 25px 0;
          background: #FFFFFF;
        }
        @keyframes cyber-products-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .cyber-products-track {
          display: flex;
          align-items: stretch;
          gap: 20px;
          animation: cyber-products-scroll 40s linear infinite;
          width: max-content;
        }
        .cyber-products-track:hover {
          animation-play-state: paused;
        }
        .cyber-product-marquee-card {
          width: 220px;
          flex-shrink: 0;
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid rgba(14, 31, 51, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }
        .cyber-product-marquee-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(217, 4, 41, 0.16);
          border-color: #FF4B4B;
        }
        @media (max-width: 768px) {
          .cyber-marquee-section {
            padding: 22px 0 14px 0;
          }
          .cyber-products-track {
            gap: 12px;
          }
          .cyber-product-marquee-card {
            width: 165px;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto 20px auto', padding: '0 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#D90429', marginBottom: '6px' }}>
            <Flame size={13} className="animate-pulse" style={{ color: '#D90429' }} />
            <span>{isActive ? "OFERTAS CYBER EN VIVO" : "PRODUCTOS PARTICIPANTES CYBER 2026"}</span>
          </div>
          <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 1000, color: 'var(--brand-navy, #0E1F33)', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
            {isActive ? "Precios Especiales en Línea" : "Catálogo Seleccionado de Campaña"}
          </h3>
        </div>

        <Link 
          href={categoryUrl}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#D90429', textDecoration: 'none' }}
          className="hover:text-[#990000] transition-colors"
        >
          <span>Ver todo Cyber</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Track horizontal con overflow hidden */}
      <div style={{ width: '100%', overflow: 'hidden', padding: '10px 0 20px 0' }}>
        <div className="cyber-products-track">
          {marqueeItems.map((product, idx) => {
            const hasSale = product.regular_price && Number(product.regular_price) > Number(product.price);
            const discountPct = hasSale
              ? Math.round(((Number(product.regular_price) - Number(product.price)) / Number(product.regular_price)) * 100)
              : 0;

            return (
              <Link 
                key={`${product.id}-${idx}`}
                href={`/tienda/${product.slug}`}
                className="cyber-product-marquee-card"
                onClick={(e) => {
                  if (onQuickView) {
                    e.preventDefault();
                    onQuickView(product);
                  }
                }}
              >
                {/* Contenedor de Imagen */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', backgroundColor: '#F8FAFC', overflow: 'hidden' }}>
                  {product.images && product.images[0] ? (
                    <Image 
                      src={product.images[0].src}
                      alt={product.name}
                      fill
                      sizes="220px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '10px' }}>
                      Sin imagen
                    </div>
                  )}

                  {/* Badge de Oferta / Cyber */}
                  {discountPct > 0 ? (
                    <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#FF4B4B', color: '#FFFFFF', fontSize: '9px', fontWeight: 950, padding: '3px 7px', borderRadius: '4px', letterSpacing: '0.05em', boxShadow: '0 2px 8px rgba(255, 75, 75, 0.4)' }}>
                      -{discountPct}%
                    </span>
                  ) : (
                    <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#D90429', color: '#FFFFFF', fontSize: '9px', fontWeight: 950, padding: '3px 7px', borderRadius: '4px', letterSpacing: '0.05em', boxShadow: '0 2px 8px rgba(217, 4, 41, 0.4)' }}>
                      CYBER
                    </span>
                  )}
                </div>

                {/* Detalles de Producto */}
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-navy, #0E1F33)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                    {product.name}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 1000, color: '#0E1F33', fontFamily: 'var(--font-heading)' }}>
                      ${Math.round(Number(product.price)).toLocaleString('es-CL')}
                    </span>
                    {hasSale && (
                      <span style={{ fontSize: '10px', color: '#94A3B8', textDecoration: 'line-through', fontWeight: 600 }}>
                        ${Math.round(Number(product.regular_price)).toLocaleString('es-CL')}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
