"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/woocommerce";

interface FeaturedCarouselProps {
  products: Product[];
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ padding: '100px 0', backgroundColor: '#FAFAFA', overflow: 'hidden' }}>
      <div style={{ padding: '0 5%', maxWidth: '1400px', margin: '0 auto', marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary-gold)', marginBottom: '20px' }}>
            <Sparkles className="w-5 h-5" />
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              Radar de Equipamiento
            </span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
            fontWeight: 900, 
            textTransform: 'uppercase',
            lineHeight: 1,
            color: '#000',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em'
          }}>
            ARTÍCULOS <span style={{ opacity: 0.3 }}>DESTACADOS</span>
          </h2>
        </motion.div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => scroll('left')}
            style={{ 
              width: '50px', height: '50px', borderRadius: '50%', border: '1px solid var(--border-color)', 
              background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            className="hover:bg-[#000] hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            style={{ 
              width: '50px', height: '50px', borderRadius: '50%', border: '1px solid var(--border-color)', 
              background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            className="hover:bg-[#000] hover:text-white transition-all"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

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
            style={{ minWidth: '320px', maxWidth: '320px', scrollSnapAlign: 'start' }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
