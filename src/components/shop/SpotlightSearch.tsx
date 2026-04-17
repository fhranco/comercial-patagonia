"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingBag, ArrowRight, Construction, Hammer, Utensils, Box } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  sku: string;
  images: ProductImage[];
  categories: Category[];
}

interface SpotlightSearchProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  "Construcción": Construction,
  "Hogar": Utensils,
  "Industrial": Hammer,
};

export default function SpotlightSearch({ products, isOpen, onClose }: SpotlightSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Filtrar productos
  const results = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.sku.toLowerCase().includes(query.toLowerCase()) ||
    p.categories.some(c => c.name.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 6);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      if (e.key === "ArrowUp") setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      if (e.key === "Enter" && results[selectedIndex]) {
        // En un entorno real, navegaríamos al producto. Aquí cerramos y podríamos emitir un evento.
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 9999, 
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          paddingTop: '10vh'
        }}>
          {/* 🌑 BACKDROP */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ 
              position: 'absolute', inset: 0, 
              backgroundColor: 'rgba(14, 31, 51, 0.4)', 
              backdropFilter: 'blur(10px)' 
            }}
          />

          {/* 🔍 SEARCH PANEL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            style={{
              width: '100%', maxWidth: '750px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              boxShadow: '0 50px 100px -20px rgba(14, 31, 51, 0.3)',
              overflow: 'hidden',
              zIndex: 1,
              border: '1px solid rgba(14, 31, 51, 0.1)',
            }}
          >
            {/* ⌨️ INPUT AREA */}
            <div style={{ 
              padding: '25px', borderBottom: '1px solid #EEE',
              display: 'flex', alignItems: 'center', gap: '20px'
            }}>
              <Search className="text-[#0E1F33] opacity-40" size={24} />
              <input 
                ref={inputRef}
                type="text"
                placeholder="Busca por marca, SKU o tipo de material..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ 
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: '1.4rem', fontWeight: 700, outline: 'none',
                  color: '#0E1F33', fontFamily: 'var(--font-heading)'
                }}
              />
              <div style={{ 
                padding: '5px 10px', backgroundColor: '#F0F0F0', 
                borderRadius: '6px', fontSize: '10px', fontWeight: 900, opacity: 0.5 
              }}>ESC</div>
            </div>

            {/* 📊 RESULTS AREA */}
            <div style={{ maxHeight: '450px', overflowY: 'auto', padding: '15px' }} className="no-scrollbar">
              {query === "" ? (
                <div style={{ padding: '20px' }}>
                  <h4 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#D4AF37', marginBottom: '15px', letterSpacing: '0.1em' }}>Categorías Destacadas</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {Object.entries(CATEGORY_ICONS).map(([name, Icon]) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', backgroundColor: '#F9F9F9', borderRadius: '10px', cursor: 'pointer' }}>
                            <Icon size={18} className="text-[#0E1F33]" />
                            <span style={{ fontSize: '13px', fontWeight: 700 }}>{name}</span>
                        </div>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <h4 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, padding: '10px 15px', letterSpacing: '0.1em' }}>Resultados para "{query}"</h4>
                  {results.map((product, idx) => (
                    <motion.div 
                      key={product.id}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      style={{ 
                        padding: '12px 15px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', gap: '20px',
                        backgroundColor: selectedIndex === idx ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                        border: selectedIndex === idx ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                        cursor: 'pointer', transition: '0.2s'
                      }}
                    >
                      <div style={{ 
                        width: '50px', height: '50px', position: 'relative', 
                        borderRadius: '8px', overflow: 'hidden', backgroundColor: '#FFF' 
                      }}>
                        <Image src={product.images[0]?.src} alt={product.name} fill style={{ objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '9px', fontWeight: 900, color: '#D4AF37', textTransform: 'uppercase' }}>{product.categories[0]?.name}</span>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0E1F33' }}>{product.name}</h4>
                        <p style={{ fontSize: '12px', opacity: 0.5 }}>SKU: {product.sku}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '16px', fontWeight: 900, color: '#0E1F33' }}>${Math.round(Number(product.price)).toLocaleString('es-CL')}</p>
                        {selectedIndex === idx && <ArrowRight size={16} className="text-[#D4AF37] mt-1 ml-auto" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <Box size={40} className="mx-auto opacity-20 mb-4" />
                  <p style={{ fontWeight: 700, opacity: 0.5 }}>No encontramos materiales para "{query}"</p>
                  <p style={{ fontSize: '12px', opacity: 0.3, marginTop: '5px' }}>Intenta con términos más generales o el SKU</p>
                </div>
              )}
            </div>

            {/* ⌨️ FOOTER HELP */}
            <div style={{ 
              padding: '15px 25px', backgroundColor: '#F9F9F9', borderTop: '1px solid #EEE',
              display: 'flex', gap: '20px', fontSize: '10px', fontWeight: 800, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ padding: '2px 5px', backgroundColor: '#FFF', borderRadius: '3px', border: '1px solid #DDD' }}>↑↓</span> Navegar</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ padding: '2px 5px', backgroundColor: '#FFF', borderRadius: '3px', border: '1px solid #DDD' }}>ENTER</span> Ver Ficha</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ padding: '2px 5px', backgroundColor: '#FFF', borderRadius: '3px', border: '1px solid #DDD' }}>ESC</span> Cerrar</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
