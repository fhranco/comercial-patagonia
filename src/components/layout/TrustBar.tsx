"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Warehouse, CheckCircle } from "lucide-react";

const trustItems = [
  {
    icon: <Warehouse className="w-8 h-8" />,
    title: "Stock Patagónico",
    text: "+50,000 SKUs listos para despacho inmediato en toda la zona sur.",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Logística Extrema",
    text: "Flota propia certificada. Entregas en obra en menos de 24hs reales.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Garantía Profesional",
    text: "Todos nuestros productos cumplen con Normas IRAM y Estándares ISO.",
  },
];

export default function TrustBar() {
  return (
    <section style={{ 
      padding: '80px 5%', 
      backgroundColor: 'var(--brand-sky)', 
      color: 'var(--brand-navy)',
      borderTop: '1px solid var(--border-color)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        {trustItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '25px', 
              padding: '40px', 
              borderRadius: '24px',
              backgroundColor: '#FFF',
              border: '1px solid var(--border-color)',
              boxShadow: '0 10px 30px rgba(58, 105, 168, 0.05)'
            }}
          >
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '12px', 
              backgroundColor: 'var(--brand-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF'
            }}>
              {item.icon}
            </div>
            <div>
              <h4 style={{ 
                fontSize: '1.2rem', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {item.title} <CheckCircle className="w-4 h-4 text-emerald-500" />
              </h4>
              <p style={{ 
                fontSize: '14px', 
                lineHeight: 1.6, 
                opacity: 0.7, 
                fontWeight: 400 
              }}>
                {item.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
