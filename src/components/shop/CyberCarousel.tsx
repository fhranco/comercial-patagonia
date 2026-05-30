"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Flame } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/woocommerce";

interface CyberCarouselProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export default function CyberCarousel({ products, onQuickView }: CyberCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      let scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      
      // Infinite-like loop behavior
      if (direction === 'right' && scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollTo = 0;
      } else if (direction === 'left' && scrollLeft <= 10) {
        scrollTo = scrollWidth;
      }

      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scroll('right');
    }, 5000);
    return () => clearInterval(interval);
  }, [products?.length]);

  if (!products || products.length === 0) return null;

  return (
    <section style={{ padding: '60px 0', backgroundColor: '#FAFAFA', overflow: 'hidden', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
      <div style={{ padding: '0 5%', maxWidth: '1400px', margin: '0 auto', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF4B4B', marginBottom: '15px' }}>
            <Flame className="w-5 h-5 animate-pulse" />
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              Catálogo Completo Cyber
            </span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', 
            fontWeight: 1000, 
            textTransform: 'uppercase',
            lineHeight: 1,
            color: '#000',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em'
          }}>
            TODA LA <span style={{ color: '#FF4B4B' }}>CATEGORÍA CYBER</span>
          </h2>
        </motion.div>

        {/* CONTROLES NAVEGACIÓN */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => scroll('left')}
            style={{ 
              width: '50px', height: '50px', borderRadius: '50%', border: '2px solid rgba(255, 75, 75, 0.15)', 
              background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FF4B4B', boxShadow: '0 4px 10px rgba(255,75,75,0.05)'
            }}
            className="hover:bg-[#FF4B4B] hover:text-white hover:border-[#FF4B4B] transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            style={{ 
              width: '50px', height: '50px', borderRadius: '50%', border: '2px solid rgba(255, 75, 75, 0.15)', 
              background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FF4B4B', boxShadow: '0 4px 10px rgba(255,75,75,0.05)'
            }}
            className="hover:bg-[#FF4B4B] hover:text-white hover:border-[#FF4B4B] transition-all duration-300"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        {/* 🎭 GRADIENT OVERLAYS */}
        <div style={{ 
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', 
          background: 'linear-gradient(to right, #FAFAFA, transparent)', 
          zIndex: 10, pointerEvents: 'none' 
        }} />
        <div style={{ 
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', 
          background: 'linear-gradient(to left, #FAFAFA, transparent)', 
          zIndex: 10, pointerEvents: 'none' 
        }} />

        <div 
          ref={scrollRef}
          style={{ 
            display: 'flex', 
            gap: '30px', 
            overflowX: 'auto', 
            padding: '20px 5%',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
          }}
          className="no-scrollbar"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              style={{ minWidth: '300px', maxWidth: '300px', scrollSnapAlign: 'start' }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                border: '1px solid rgba(255, 75, 75, 0.1)',
                borderRadius: '8px',
                padding: '12px',
                background: '#FFFFFF',
                boxShadow: '0 5px 20px rgba(0,0,0,0.02)',
                position: 'relative',
                transition: 'all 0.3s ease',
              }}
              className="hover:shadow-[0_15px_45px_rgba(255,75,75,0.08)] hover:border-[rgba(255,75,75,0.3)]"
              >
                <ProductCard product={product} onQuickView={onQuickView} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
