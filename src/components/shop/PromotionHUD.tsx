"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/woocommerce";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { CAMPAIGN_CONFIG } from "@/lib/constants";

interface PromotionHUDProps {
  products?: any[];
  onQuickView?: (product: Product) => void;
}

export default function PromotionHUD({ products, onQuickView }: PromotionHUDProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();
  
  // 🔍 BUSCAMOS PRODUCTOS QUE REALMENTE ESTÉN EN OFERTA
  const dataSource = products || [];
  const saleProducts = dataSource.filter(p => p.on_sale);
  
  // Selección aleatoria para evitar sensación de "plantilla"
  const [promoProduct, setPromoProduct] = useState<any>(null);

  useEffect(() => {
    // 🏆 PRIORIDAD CAMPAÑA: Buscamos productos de la categoría Cyber o de Zanzini en junio
    let campaignProducts = [];
    
    if (CAMPAIGN_CONFIG.isCyberActive) {
      campaignProducts = saleProducts.filter(p =>
        p.categories && Array.isArray(p.categories) && 
        p.categories.some((cat: any) => cat.slug && (cat.slug.toLowerCase() === "cybermonday" || cat.slug.toLowerCase() === "cyberday"))
      );
    } else if (CAMPAIGN_CONFIG.activeCampaign === "zanzini_june") {
      campaignProducts = dataSource.filter(p =>
        p.categories && Array.isArray(p.categories) && 
        p.categories.some((cat: any) => cat.slug && (cat.slug.toLowerCase() === "zanzini-marca" || cat.slug.toLowerCase() === "zanzini"))
      );
    }

    if (campaignProducts.length > 0) {
      const randomProduct = campaignProducts[Math.floor(Math.random() * campaignProducts.length)];
      setPromoProduct(randomProduct);
    } else if (saleProducts.length > 0) {
      const randomProduct = saleProducts[Math.floor(Math.random() * saleProducts.length)];
      setPromoProduct(randomProduct);
    } else {
      setPromoProduct(dataSource[0]);
    }

    const timer = setTimeout(() => setIsVisible(true), 1000); 
    return () => clearTimeout(timer);
  }, [products?.length]);

  if (!isVisible || !promoProduct) return null;

  const handleNavigate = () => {
    if (onQuickView) {
      onQuickView(promoProduct);
    } else {
      router.push(`/tienda/${promoProduct.slug}`);
    }
  };

  // Cálculo de descuento real dinámico
  const discount = promoProduct.regular_price ? Math.round((1 - (Number(promoProduct.price) / Number(promoProduct.regular_price))) * 100) : 0;
  const isCyberProduct = CAMPAIGN_CONFIG.isCyberActive && promoProduct.categories && promoProduct.categories.some((cat: any) => cat.slug && (cat.slug.toLowerCase() === "cybermonday" || cat.slug.toLowerCase() === "cyberday"));
  const isZanziniProduct = CAMPAIGN_CONFIG.activeCampaign === "zanzini_june" && promoProduct.categories && promoProduct.categories.some((cat: any) => cat.slug && (cat.slug.toLowerCase() === "zanzini-marca" || cat.slug.toLowerCase() === "zanzini"));

  const isSpecialCampaign = isCyberProduct || isZanziniProduct;

  return (
    <div style={{ position: 'fixed', bottom: '100px', left: '30px', zIndex: 9999 }}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            onClick={handleNavigate}
            style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                padding: '12px',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                boxShadow: isSpecialCampaign 
                  ? '0 20px 50px rgba(212, 175, 55, 0.3)' 
                  : '0 20px 50px rgba(0,0,0,0.15)',
                border: isSpecialCampaign 
                  ? '2px solid var(--primary-gold)' 
                  : '1px solid var(--border-color)',
                maxWidth: '320px',
                position: 'relative',
                cursor: 'pointer'
            }}
            className="hover:scale-[1.02] transition-transform"
          >
            <button 
                onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
                style={{ position: 'absolute', top: '-10px', right: '-10px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#000', color: '#FFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
            >
                <X size={12} />
            </button>

            {/* UPPER ROW: PRODUCT DETAILS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%' }}>
              <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#F4F7FA' }}>
                  <Image 
                    src={promoProduct.images[0]?.src || ""} 
                    alt={promoProduct.name} 
                    fill 
                    sizes="60px"
                    style={{ objectFit: 'cover' }} 
                  />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                    <Sparkles size={10} style={{ color: isCyberProduct ? '#FF4B4B' : 'var(--primary-gold)' }} />
                    <span style={{ 
                      fontSize: '9px', 
                      fontWeight: 900, 
                      textTransform: 'uppercase', 
                      color: isCyberProduct ? '#FF4B4B' : 'var(--primary-gold)', 
                      letterSpacing: '0.1em' 
                    }}>
                        {isCyberProduct 
                            ? "OFERTA CYBERDAY" 
                            : (isZanziniProduct ? "Recién Llegado" : "Oferta de la Semana")}
                    </span>
                    {discount > 0 && (
                        <span style={{ backgroundColor: '#ff4b4b', color: '#FFF', fontSize: '8px', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', marginLeft: '5px' }}>
                            -{discount}%
                        </span>
                    )}
                </div>
                  <h4 style={{ fontSize: '11px', fontWeight: 900, color: '#000', margin: 0, lineHeight: 1.2 }}>{promoProduct.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 950, color: '#000' }}>
                              ${Math.round(Number(promoProduct.price)).toLocaleString('es-CL')}
                          </span>
                          {promoProduct.regular_price && Number(promoProduct.regular_price) !== Number(promoProduct.price) && (
                              <>
                                  <span style={{ fontSize: '10px', opacity: 0.4, textDecoration: 'line-through', color: '#000', fontWeight: 600 }}>
                                      ${Math.round(Number(promoProduct.regular_price)).toLocaleString('es-CL')}
                                  </span>
                                  {discount > 0 && (
                                      <span style={{ 
                                          fontSize: '9px', 
                                          fontWeight: 900, 
                                          color: '#FF4B4B', 
                                          backgroundColor: 'rgba(255, 75, 75, 0.1)', 
                                          padding: '1px 4px', 
                                          borderRadius: '3px' 
                                      }}>
                                          -{discount}%
                                      </span>
                                  )}
                              </>
                          )}
                      </div>
                      <button 
                          onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
                          style={{ border: 'none', background: 'none', color: 'var(--brand-blue)', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}
                          className="hover:translate-x-1 transition-transform"
                      >
                          Lo quiero <ChevronRight size={10} />
                      </button>
                  </div>
              </div>
            </div>

            {/* LOWER ROW: GO TO ALL OFFERS BUTTON */}
            <div 
              onClick={(e) => { 
                e.stopPropagation(); 
                router.push(isCyberProduct 
                  ? '/tienda?category=cyberday' 
                  : (isZanziniProduct ? '/tienda?category=Zanzini' : '/tienda?category=Ofertas')); 
              }}
              style={{
                width: '100%',
                borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                paddingTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '9px',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: isCyberProduct ? '#FF4B4B' : 'var(--brand-blue)',
                letterSpacing: '0.08em',
                transition: 'opacity 0.2s ease'
              }}
              className="hover:opacity-85"
            >
              <span>{isCyberProduct 
                ? "Ver todas las ofertas Cyber" 
                : (isZanziniProduct ? "Ver colección Zanzini" : "Ver todas las ofertas")}</span>
              <ChevronRight size={10} style={{ color: isCyberProduct ? '#FF4B4B' : 'var(--brand-blue)' }} />
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
