"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/woocommerce";

interface CyberFeaturedGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export default function CyberFeaturedGrid({ products, onQuickView }: CyberFeaturedGridProps) {
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      // Shuffle array and pick 4 unique random products
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 4));
    }
  }, [products]);

  if (randomProducts.length === 0) return null;

  return (
    <section style={{ padding: '80px 5%', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* HEADER SECTION */}
        <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF4B4B' }}>
            <Flame className="w-4 h-4 animate-pulse" />
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em' }}>
              EQUIPAMIENTO EN LIQUIDACIÓN
            </span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 3rem)', 
            fontWeight: 1000, 
            textTransform: 'uppercase',
            lineHeight: 1.1,
            color: '#000',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            SELECCIÓN DESTACADA <span style={{ color: '#FF4B4B' }}>CYBER.</span>
          </h2>
          <p style={{ fontSize: '13px', opacity: 0.5, margin: '5px 0 0', maxWidth: '500px' }}>
            Descuento del 25% y despacho directo coordinado en obra. Stock crítico con tarifas preferenciales.
          </p>
        </div>

        {/* 4-COLUMN RESPONSIVE GRID */}
        <div className="cyber-grid-layout" style={{ display: 'grid', gap: '30px' }}>
          <style jsx>{`
            .cyber-grid-layout {
              grid-template-columns: repeat(2, 1fr);
            }
            @media (min-width: 1024px) {
              .cyber-grid-layout {
                grid-template-columns: repeat(4, 1fr) !important;
                gap: 40px !important;
              }
            }
          `}</style>
          
          {randomProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
