"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, ChevronRight, ChevronLeft } from "lucide-react";

interface BentoFiltersProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export default function BentoFilters({ categories, activeCategory, onSelect }: BentoFiltersProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // 💡 Filtrar categorías vacías o redundantes si fuera necesario
  const displayCategories = categories.filter(c => c !== "Sin categoría");

  return (
    <div style={{ position: 'relative', width: '100%', padding: '20px 0' }}>
      
      {/* 🧥 GRADIENT MASK (Indicates more content) */}
      <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '100px',
          background: 'linear-gradient(to right, transparent, var(--bg-color))',
          pointerEvents: 'none', zIndex: 2
      }} />

      <div 
        ref={scrollRef}
        style={{ 
          display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px 5px',
          scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch'
        }} 
        className="no-scrollbar"
      >
        {displayCategories.map((category) => {
          const isActive = activeCategory === category;
          
          return (
            <motion.div
              key={category}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(category)}
              style={{
                flex: '0 0 auto',
                width: '180px',
                height: '140px',
                padding: '20px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: isActive ? '#0E1F33' : '#F8FAFC',
                border: isActive ? '2px solid #D4AF37' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: isActive ? '0 20px 40px rgba(14, 31, 51, 0.3)' : '0 4px 15px rgba(0,0,0,0.02)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* ✨ DECORATIVE ICON BG */}
              <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: isActive ? 0.1 : 0.03 }}>
                <LayoutGrid size={80} style={{ color: isActive ? '#FFF' : '#0E1F33' }} />
              </div>

              <div style={{ 
                width: '32px', height: '32px', borderRadius: '8px', 
                backgroundColor: isActive ? 'rgba(212, 175, 55, 0.2)' : 'rgba(14, 31, 51, 0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <LayoutGrid size={14} style={{ color: isActive ? '#D4AF37' : '#0E1F33' }} />
              </div>

              <div>
                <h3 style={{ 
                    fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', 
                    letterSpacing: '0.1em', margin: 0,
                    color: isActive ? '#FFF' : '#0E1F33'
                }}>
                  {category}
                </h3>
                <p style={{ 
                    fontSize: '8px', fontWeight: 700, opacity: 0.5, 
                    marginTop: '4px', textTransform: 'uppercase',
                    color: isActive ? '#D4AF37' : 'inherit'
                }}>
                  {isActive ? 'Categoría Activa' : 'Explorar'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 🧥 SCROLL HUB INDICATOR CON BOTONES REALES */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        gap: '20px', marginTop: '20px', padding: '15px',
        backgroundColor: 'rgba(128,128,128,0.03)', borderRadius: '100px',
        border: '1px solid var(--border-color)'
      }}>
         <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={() => scroll('left')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
         >
            <ChevronLeft size={22} className="text-[var(--primary-gold)]" strokeWidth={3} />
         </motion.button>

         <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
            Explorar Categorías
         </span>

         <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={() => scroll('right')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
         >
            <ChevronRight size={22} className="text-[var(--primary-gold)]" strokeWidth={3} />
         </motion.button>
      </div>
    </div>
  );
}
