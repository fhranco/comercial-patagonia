"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface PromotionHUDProps {
  products?: any[];
}

export default function PromotionHUD({ products }: PromotionHUDProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();
  
  // 🔍 BUSCAMOS PRODUCTOS QUE REALMENTE ESTÉN EN OFERTA
  const dataSource = (products && products.length > 0) ? products : MOCK_PRODUCTS;
  const saleProducts = dataSource.filter(p => p.on_sale);
  
  // Selección aleatoria para evitar sensación de "plantilla"
  const [promoProduct, setPromoProduct] = useState<any>(null);

  useEffect(() => {
    if (saleProducts.length > 0) {
      const randomProduct = saleProducts[Math.floor(Math.random() * saleProducts.length)];
      setPromoProduct(randomProduct);
    } else {
      setPromoProduct(dataSource[0]);
    }

    const timer = setTimeout(() => setIsVisible(true), 1000); 
    return () => clearTimeout(timer);
  }, [products]);

  if (!isVisible || !promoProduct) return null;

  const handleNavigate = () => {
    router.push(`/shop/${promoProduct.id}`);
  };

  // Cálculo de descuento real dinámico
  const discount = promoProduct.regular_price ? Math.round((1 - (Number(promoProduct.price) / Number(promoProduct.regular_price))) * 100) : 0;

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
                alignItems: 'center', 
                gap: '15px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                border: '1px solid var(--border-color)',
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

            <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#F4F7FA' }}>
                <Image src={promoProduct.images[0]?.src || ""} alt={promoProduct.name} fill style={{ objectFit: 'cover' }} />
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                    <Sparkles size={10} className="text-[var(--primary-gold)]" />
                    <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary-gold)', letterSpacing: '0.1em' }}>Oferta de la Semana</span>
                    {discount > 0 && (
                        <span style={{ backgroundColor: '#ff4b4b', color: '#FFF', fontSize: '8px', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', marginLeft: '5px' }}>
                            -{discount}%
                        </span>
                    )}
                </div>
                <h4 style={{ fontSize: '11px', fontWeight: 900, color: '#000', margin: 0, lineHeight: 1.2 }}>{promoProduct.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 900 }}>${Math.round(Number(promoProduct.price)).toLocaleString('es-CL')}</span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
                        style={{ border: 'none', background: 'none', color: 'var(--brand-blue)', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        className="hover:translate-x-1 transition-transform"
                    >
                        Lo quiero <ChevronRight size={10} />
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
