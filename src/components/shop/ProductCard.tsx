"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Maximize2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { Product } from "@/types/woocommerce";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [viewers, setViewers] = useState<number>(15);

  useEffect(() => {
    setMounted(true);
    setViewers(Math.floor(Math.random() * 25) + 12);
  }, []);

  return (
    <div 
      style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
      className="product-card"
    >
       <Link 
         href={`/shop/${product.id}`} 
         style={{ textDecoration: 'none', color: 'inherit' }}
         onClick={(e) => {
           if (onQuickView) {
             e.preventDefault();
             onQuickView(product);
           }
         }}
       >
          {/* 🖼️ MEDIA CONTAINER */}
          <div style={{ 
               aspectRatio: '1/1', backgroundColor: '#FFFFFF', 
               overflow: 'hidden', position: 'relative', borderRadius: '4px'
             }}
          >
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', height: '100%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div style={{ textAlign: 'center', opacity: 0.2 }}>
                      <Image src="/branding/logo-minimal.png" alt="Patagonia" width={40} height={40} style={{ filter: 'grayscale(1)' }} />
                   </div>
                </div>
              </div>

              {product.images[0] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <Image 
                    src={product.images[0].src} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized={product.images[0].src.startsWith('http')}
                    className="product-card-image"
                    quality={95}
                    style={{ 
                      objectFit: 'cover'
                    }} 
                  />
                </motion.div>
              )}
              
               {/* 🔘 ACTION OVERLAY (Desktop) */}
               <div style={{ 
                  position: 'absolute', inset: 0, 
                  background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)',
                  display: 'none', alignItems: 'center', justifyContent: 'center', gap: '15px'
               }} className="lg:flex product-card-overlay">
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                      style={{ 
                          width: '60px', height: '60px', border: 'none', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                      }}
                      className="gold-shimmer product-card-btn"
                    >
                      <Plus className="w-8 h-8 text-black" />
                    </button>
                    <div 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.(product); }}
                      style={{ 
                          width: '60px', height: '60px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.5)'
                      }}
                      className="hover:scale-110 transition-all"
                    >
                      <Maximize2 className="w-6 h-6 text-white" />
                    </div>
               </div>

               {/* 🛒 MOBILE ACTIONS (Visible on Small Screens) */}
               <div style={{ 
                  position: 'absolute', bottom: '10px', right: '10px',
                  display: 'flex', gap: '8px', zIndex: 20
               }} className="lg:hidden">
                   <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.(product); }}
                      style={{ 
                        width: '40px', height: '40px', borderRadius: '12px',
                        backgroundColor: 'rgba(14, 31, 51, 0.8)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(10px)', color: 'white'
                      }}
                      className="active:scale-90 transition-transform"
                   >
                      <Maximize2 size={18} />
                   </button>
                   <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                      style={{ 
                        width: '40px', height: '40px', borderRadius: '12px',
                        backgroundColor: 'var(--brand-yellow)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }}
                      className="active:scale-90 transition-transform"
                   >
                      <Plus size={20} color="var(--brand-navy)" />
                   </button>
               </div>

              {product.on_sale && (() => {
                const isCyber = product.categories && product.categories.some(cat => cat.slug && (cat.slug.toLowerCase() === "cybermonday" || cat.slug.toLowerCase() === "cyberday"));
                return (
                  <span style={{ 
                    position: 'absolute', 
                    top: '15px', 
                    left: '15px', 
                    background: isCyber ? '#FF4B4B' : '#D4AF37', 
                    color: isCyber ? '#FFF' : '#000', 
                    fontSize: '9px', 
                    fontWeight: 900, 
                    padding: '4px 10px', 
                    borderRadius: '100px', 
                    textTransform: 'uppercase',
                    boxShadow: isCyber ? '0 4px 12px rgba(255, 75, 75, 0.3)' : 'none',
                    zIndex: 10
                  }}>
                    {isCyber ? 'Cyber' : 'Oferta'}
                  </span>
                );
              })()}
          </div>
       </Link>

       {/* 📝 INFO SECTION */}
       <div 
         style={{ paddingTop: '20px', cursor: 'pointer' }}
         onClick={() => onQuickView?.(product)}
       >
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: 'clamp(9px, 2vw, 10px)', color: 'var(--primary-gold)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                {product.categories[0]?.name || "Equipamiento"}
              </span>
              <span style={{ fontSize: 'clamp(8px, 1.5vw, 9px)', opacity: 0.3, fontWeight: 900 }}>SKU: {product.sku || 'N/A'}</span>
           </div>
           
           <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.3, marginBottom: '15px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
             {product.name}
           </h3>
           
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 900, color: 'var(--text-color)', fontFamily: 'var(--font-heading)' }}>
                ${Math.round(Number(product.price)).toLocaleString('es-CL')}
              </span>
              {product.regular_price && Number(product.regular_price) > 0 && product.regular_price !== product.price && (
                <>
                  <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', opacity: 0.3, textDecoration: 'line-through' }}>
                    ${Math.round(Number(product.regular_price)).toLocaleString('es-CL')}
                  </span>
                  <span style={{ 
                    fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)', 
                    fontWeight: 900, 
                    color: '#FF4B4B', 
                    backgroundColor: 'rgba(255, 75, 75, 0.1)', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    marginLeft: '2px'
                  }}>
                    -{Math.round(((Number(product.regular_price) - Number(product.price)) / Number(product.regular_price)) * 100)}%
                  </span>
                </>
              )}
            </div>
            
            {/* 👁️ SOCIAL PROOF (Organic & Regional) */}
            {mounted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px', padding: '10px 14px', backgroundColor: 'rgba(212, 175, 55, 0.03)', borderRadius: '100px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                 <div style={{ position: 'relative', display: 'flex' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-gold)' }} className="animate-ping absolute" />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-gold)', position: 'relative' }} />
                 </div>
                 <span 
                   suppressHydrationWarning
                   style={{ fontSize: '9px', fontWeight: 900, color: 'var(--brand-navy)', textTransform: 'uppercase', opacity: 0.7, letterSpacing: '0.05em' }}
                 >
                   {viewers > 20 ? `🔥 Tendencia: ${viewers} clientes en Magallanes revisando` : `✨ Solicitado recientemente en Punta Arenas`}
                 </span>
              </div>
            )}
       </div>
    </div>
  );
}
