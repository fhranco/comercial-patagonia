"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { ChevronLeft, Inbox, Clock, Download, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function HistorialPage() {
  const { quoteHistory, addToCart } = useCart();

  return (
    <div style={{ backgroundColor: 'var(--brand-sky)', minHeight: '100vh', color: 'var(--brand-navy)' }}>
      <Navigation transparent={false} />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '150px 5% 100px' }}>
        <div style={{ marginBottom: '60px' }}>
            <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', textDecoration: 'none', opacity: 0.5, fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px' }} className="hover:opacity-100 transition">
                <ChevronLeft size={16} /> Volver a Tienda
            </Link>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>Historial de <br/><span style={{ color: 'var(--brand-blue)' }}>Cotizaciones B2B</span></h1>
            <p style={{ marginTop: '20px', opacity: 0.5, maxWidth: '600px' }}>
                Registro local de tus cotizaciones generadas. Estos datos se almacenan solo en este navegador para tu privacidad y gestión rápida.
            </p>
        </div>

        {quoteHistory.length === 0 ? (
            <div style={{ padding: '100px 0', textAlign: 'center', backgroundColor: '#FFF', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <Inbox size={60} style={{ opacity: 0.1, marginBottom: '20px' }} />
                <h2 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4 }}>No hay cotizaciones guardadas</h2>
                <Link href="/shop" style={{ display: 'inline-block', marginTop: '30px', color: 'var(--brand-blue)', fontWeight: 900, textTransform: 'uppercase', fontSize: '12px', textDecoration: 'none' }}>Empezar a Cotizar Ahora</Link>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {quoteHistory.map((quote, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={quote.id} 
                        style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', alignItems: 'center' }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <Clock size={12} style={{ opacity: 0.4 }} />
                                <span style={{ fontSize: '10px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase' }}>{new Date(quote.date).toLocaleDateString('es-CL')}</span>
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--brand-navy)' }}>{quote.projectName}</h3>
                            <span style={{ fontSize: '10px', fontWeight: 700, opacity: 0.3, textTransform: 'uppercase' }}>Ref: {quote.id}</span>
                        </div>

                        <div>
                            <span style={{ display: 'block', fontSize: '10px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '5px' }}>Materiales</span>
                            <p style={{ fontSize: '13px', fontWeight: 700 }}>{quote.items.length} productos cubicados</p>
                        </div>

                        <div>
                            <span style={{ display: 'block', fontSize: '10px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '5px' }}>Inversión Estimada</span>
                            <p style={{ fontSize: '20px', fontWeight: 900 }}>${Math.round(quote.total).toLocaleString('es-CL')}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => {
                                    quote.items.forEach(item => addToCart(item as any, item.quantity));
                                }}
                                style={{ background: 'var(--brand-navy)', color: '#FFF', border: 'none', padding: '12px 20px', borderRadius: '4px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                            >
                                <ExternalLink size={14} /> Restaurar Carrito
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
