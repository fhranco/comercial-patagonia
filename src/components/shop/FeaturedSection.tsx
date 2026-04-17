"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/woocommerce";

interface FeaturedSectionProps {
  products: Product[];
}

export default function FeaturedSection({ products }: FeaturedSectionProps) {
  // Tomamos solo los primeros 4 para mantener el impacto visual limpio
  const featured = products.slice(0, 4);

  return (
    <section style={{ padding: '120px 5%', backgroundColor: '#FAFAFA', borderTop: '1px solid var(--border-color)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary-gold)', marginBottom: '20px' }}>
              <Sparkles className="w-5 h-5" />
              <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em' }}>
                Selección Premium
              </span>
            </div>
            <h2 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
              fontWeight: 900, 
              textTransform: 'uppercase',
              lineHeight: 0.9,
              color: '#000',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.04em'
            }}>
              EQUIPAMIENTO <br/><span style={{ opacity: 0.2 }}>DESTACADO</span>
            </h2>
          </motion.div>

          <Link href="/shop" style={{ 
            color: '#000', 
            textDecoration: 'none', 
            fontSize: '11px', 
            fontWeight: 900, 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#FFF',
            padding: '18px 35px',
            borderRadius: '100px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
          }} className="hover:scale-105 transition-all duration-500">
            <span>Visitar Tienda</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* PRODUCTS GRID */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '60px 30px' 
        }}>
          {featured.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
