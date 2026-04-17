"use client";

import React from "react";
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

  return (
    <div 
      style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
      className="product-card"
    >
       <Link 
         href={`/shop/${product.id}`} 
         style={{ textDecoration: 'none', color: 'inherit' }}
         onClick={() => {
           if (typeof window !== 'undefined') {
             sessionStorage.setItem('current_product', JSON.stringify(product));
           }
         }}
       >
          {/* 🖼️ MEDIA CONTAINER */}
          <div style={{ 
               aspectRatio: '1/1', backgroundColor: 'var(--titanium-gray)', 
               overflow: 'hidden', position: 'relative', borderRadius: '4px'
             }}
          >
              {product.images[0] && (
                <Image 
                  src={product.images[0].src} 
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="product-card-image"
                  style={{ 
                    objectFit: 'cover'
                  }} 
                />
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

               {/* 🛒 MOBILE QUICK ADD (Always Visible on Small Screens) */}
               <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                  style={{ 
                    position: 'absolute', bottom: '10px', right: '10px',
                    width: '40px', height: '40px', borderRadius: '12px',
                    backgroundColor: 'var(--brand-yellow)', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    zIndex: 20
                  }}
                  className="lg:hidden active:scale-90 transition-transform"
               >
                  <Plus size={20} color="var(--brand-navy)" />
               </button>

              {product.on_sale && (
                <span style={{ position: 'absolute', top: '15px', left: '15px', background: '#D4AF37', color: '#000', fontSize: '9px', fontWeight: 900, padding: '4px 10px', borderRadius: '100px', textTransform: 'uppercase' }}>Oferta</span>
              )}
          </div>
       </Link>

       {/* 📝 INFO SECTION */}
       <div style={{ paddingTop: '20px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: 'clamp(9px, 2vw, 10px)', color: 'var(--primary-gold)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                {product.categories[0]?.name || "Equipamiento"}
              </span>
              <span style={{ fontSize: 'clamp(8px, 1.5vw, 9px)', opacity: 0.3, fontWeight: 900 }}>SKU: {product.sku || 'N/A'}</span>
           </div>
           
           <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.3, marginBottom: '15px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
             {product.name}
           </h3>
           
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 900, color: 'var(--text-color)', fontFamily: 'var(--font-heading)' }}>
                ${Math.round(Number(product.price)).toLocaleString('es-CL')}
              </span>
              {product.regular_price !== product.price && (
                <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', opacity: 0.3, textDecoration: 'line-through' }}>
                  ${Math.round(Number(product.regular_price)).toLocaleString('es-CL')}
                </span>
              )}
           </div>
       </div>
    </div>
  );
}
