"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, Download, Send, Ship, MapPin, Calculator, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface QuotePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  projectRef: string;
}

export default function QuotePreview({ isOpen, onClose, projectRef }: QuotePreviewProps) {
  const { cart } = useCart();
  const date = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
  const total = cart.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(14, 31, 51, 0.8)', backdropFilter: 'blur(20px)' }}
        />

        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            style={{
                width: '100%', maxWidth: '850px', maxHeight: '90vh',
                backgroundColor: '#FFF', borderRadius: '12px', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', position: 'relative',
                boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
                fontFamily: 'var(--font-body)'
            }}
        >
            {/* 🛠️ TOP BAR (TOOLS) */}
            <div className="no-print" style={{ backgroundColor: '#F8FAFC', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EEE' }}>
                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.4)' }}>
                    Visualizador de Cotización B2B v1.1
                </span>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                      onClick={() => window.print()}
                      style={{ border: '1px solid #DDD', background: '#FFF', padding: '8px 15px', borderRadius: '6px', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                        <Printer size={14} /> GENERAR PDF / IMPRIMIR
                    </button>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* 📄 DOCUMENT AREA */}
            <div id="quote-document" className="print-area" style={{ flex: 1, overflowY: 'auto', padding: '60px', backgroundColor: '#FFF' }}>
                
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0E1F33', margin: 0, letterSpacing: '0.1em' }}>COMERCIAL DE LA PATAGONIA</h1>
                        <p style={{ fontSize: '10px', opacity: 0.5, fontWeight: 700, textTransform: 'uppercase', marginTop: '5px' }}>
                            Magallanes, Chile • B2B Procurement Division
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#D4AF37', margin: 0, lineHeight: 1 }}>COTIZACIÓN</h2>
                        <p style={{ fontSize: '11px', fontWeight: 700, opacity: 0.4 }}>{date}</p>
                    </div>
                </div>

                {/* PROJECT INFO */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', padding: '30px', backgroundColor: '#F9F9F9', borderRadius: '4px', marginBottom: '50px' }}>
                    <div>
                        <h4 style={{ fontSize: '9px', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase', marginBottom: '5px' }}>Identificador de Proyecto</h4>
                        <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0E1F33' }}>{projectRef || "S/N (General)"}</p>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '9px', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase', marginBottom: '5px' }}>Estado Logístico</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '6px', height: '6px', backgroundColor: '#22C55E', borderRadius: '50%' }} />
                            <span style={{ fontSize: '10px', fontWeight: 900 }}>RUTA OPERATIVA</span>
                        </div>
                    </div>
                </div>

                {/* ITEMS TABLE */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '60px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #0E1F33' }}>
                            <th style={{ textAlign: 'left', padding: '15px 0', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', width: '60%' }}>Material / Especificación</th>
                            <th style={{ textAlign: 'center', padding: '15px 0', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>Cantidad</th>
                            <th style={{ textAlign: 'right', padding: '15px 0', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>Total Item</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #EEE' }}>
                                <td style={{ padding: '25px 0' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0E1F33' }}>{item.name}</div>
                                    <div style={{ fontSize: '9px', opacity: 0.4, fontWeight: 900, marginTop: '4px', textTransform: 'uppercase' }}>SKU: {item.sku || 'N/A'}</div>
                                </td>
                                <td style={{ textAlign: 'center', fontSize: '14px', fontWeight: 700 }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right', fontSize: '14px', fontWeight: 900 }}>${(Number(item.price) * (item.quantity || 1)).toLocaleString('es-CL')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* TOTALS */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '60px' }}>
                    <div style={{ width: '250px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', opacity: 0.4 }}>
                            <span style={{ fontSize: '11px', fontWeight: 900 }}>SUBTOTAL NETO</span>
                            <span style={{ fontSize: '11px', fontWeight: 900 }}>${Math.round(total * 0.81).toLocaleString('es-CL')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', opacity: 0.4 }}>
                            <span style={{ fontSize: '11px', fontWeight: 900 }}>IVA (19%)</span>
                            <span style={{ fontSize: '11px', fontWeight: 900 }}>${Math.round(total * 0.19).toLocaleString('es-CL')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #0E1F33', paddingTop: '15px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 900 }}>VALOR TOTAL</span>
                            <span style={{ fontSize: '18px', fontWeight: 900, color: '#0E1F33' }}>${total.toLocaleString('es-CL')}</span>
                        </div>
                    </div>
                </div>

                {/* FOOTER GUARANTEES */}
                <div style={{ gridTemplateColumns: 'repeat(3, 1fr)', display: 'grid', gap: '20px', borderTop: '1px solid #EEE', paddingTop: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Ship size={14} style={{ color: '#D4AF37' }} />
                        <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4 }}>Logística Patagónica</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ShieldCheck size={14} style={{ color: '#D4AF37' }} />
                        <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4 }}>Stock Sincronizado</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calculator size={14} style={{ color: '#D4AF37' }} />
                        <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4 }}>Cálculo Magallanes</span>
                    </div>
                </div>
            </div>

            {/* 🛠️ ACTION BAR */}
            <div className="no-print" style={{ padding: '30px', backgroundColor: '#0E1F33', display: 'flex', gap: '20px' }}>
                <button 
                  onClick={onClose}
                  style={{ flex: 1, backgroundColor: 'transparent', color: '#FFF', border: '1px solid rgba(255,255,255,0.2)', padding: '18px', borderRadius: '4px', fontSize: '11px', fontWeight: 900, cursor: 'pointer' }}
                >
                    SEGUIR AGREGANDO
                </button>
                <button 
                  style={{ flex: 1, backgroundColor: '#D4AF37', color: '#0E1F33', border: 'none', padding: '18px', borderRadius: '4px', fontSize: '11px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}
                  className="hover:scale-[1.02] transition-all"
                >
                    <Send size={16} /> CONFIRMAR Y ENVIAR A WHATSAPP
                </button>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
