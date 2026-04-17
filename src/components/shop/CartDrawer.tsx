"use client";
// Deployment Fix: Finalizing B2B History System Integration

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, MessageSquare, ChevronRight, Inbox } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import QuotePreview from "./QuotePreview";

export default function CartDrawer() {
  const { 
    cart, isCartOpen, setIsCartOpen, removeFromCart, updateQty, cartTotal, 
    projectName, setProjectName, saveQuoteToHistory 
  } = useCart();
  const [isQuotePreviewOpen, setIsQuotePreviewOpen] = React.useState(false);

  const handleWhatsAppQuote = () => {
    saveQuoteToHistory(); // 💾 Archivar en historial antes de enviar
    const phone = "56985806127"; 
    const itemsList = cart.map(item => `- ${item.name} (x${item.quantity}) - Ref: ${item.sku || 'N/A'}`).join('%0A');
    const projectHeader = projectName ? `PROYECTO: *${projectName}*%0A` : '';
    const message = `🏔️ *SOLICITUD DE COTIZACIÓN B2B*%0AComercial de la Patagonia%0A%0A${projectHeader}--------------------------%0A${itemsList}%0A--------------------------%0A*TOTAL ESTIMADO:* $${Math.round(cartTotal).toLocaleString('es-CL')}%0A%0A_Favor confirmar disponibilidad para despacho en Magallanes._`;
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <>
      <AnimatePresence>
      {isCartOpen && (
        <>
          {/* 🌑 OVERLAY LUXURY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            style={{ 
              position: 'fixed', inset: 0, 
              backgroundColor: 'rgba(14, 31, 51, 0.4)', 
              backdropFilter: 'blur(8px)', 
              zIndex: 9000 
            }}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            style={{ 
              position: 'fixed', top: 0, right: 0, bottom: 0, 
              width: '100%', maxWidth: '480px', 
              backgroundColor: 'rgba(255, 255, 255, 0.98)', 
              backdropFilter: 'blur(25px)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.15)', 
              zIndex: 9001,
              display: 'flex', flexDirection: 'column',
              color: '#0E1F33'
            }}
            className="cart-drawer-responsive"
          >
            <style jsx>{`
              .cart-drawer-responsive {
                padding: 0;
              }
              .qty-control {
                --qty-padding: 3px 8px;
              }
              @media (max-width: 480px) {
                .cart-drawer-responsive {
                  width: 100%;
                }
                .qty-control {
                  --qty-padding: 8px 12px;
                }
              }
            `}</style>
            {/* 💎 HEADER REFINADO */}
            <div style={{ 
              padding: '40px 30px', 
              borderBottom: '1px solid rgba(0,0,0,0.05)', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <ShoppingBag className="w-5 h-5 text-[var(--primary-gold)]" />
                  <h2 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em' }}>Mi Cotización</h2>
                </div>
                <p style={{ fontSize: '11px', opacity: 0.4, fontWeight: 700, textTransform: 'uppercase' }}>
                  {cart.length} Artículos Seleccionados
                </p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                style={{ background: 'rgba(0,0,0,0.03)', border: 'none', cursor: 'pointer', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                className="hover:bg-black hover:text-white transition-all duration-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 🏗️ B2B CONTEXT (Project Identifier) */}
            <div style={{ padding: '20px 30px', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <label style={{ fontSize: '9px', fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Nombre del Proyecto / Obra</label>
                      {!projectName && (
                        <motion.div 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-gold)' }}
                        />
                      )}
                    </div>
                    <input 
                      type="text" 
                      placeholder="Ej. Casa Mirador Lote 4"
                      value={projectName || ''}
                      onChange={(e) => setProjectName?.(e.target.value)}
                      style={{ 
                        width: '100%', background: 'white', border: !projectName ? '1px solid var(--primary-gold)' : '1px solid rgba(0,0,0,0.1)', 
                        padding: '12px 15px', borderRadius: '4px',
                        fontSize: '14px', fontWeight: 700, outline: 'none', color: 'var(--brand-navy)',
                        boxShadow: !projectName ? '0 0 15px rgba(212, 175, 55, 0.1)' : 'none',
                        transition: 'all 0.3s'
                      }}
                    />
                    {!projectName && (
                      <p style={{ fontSize: '8px', fontWeight: 900, color: 'var(--primary-gold)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                         ✨ Identifica tu cotización para una mejor gestión
                      </p>
                    )}
                  </div>
               </div>
            </div>

            {/* 📋 LISTA DE PRODUCTOS */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }} className="no-scrollbar">
              {cart.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.15 }}>
                  <Inbox className="w-16 h-16 mb-4 stroke-1" />
                  <p style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em' }}>Lista de materiales vacía</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  {cart.map((item) => (
                    <motion.div 
                      key={item.id} 
                      layout 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{ display: 'flex', gap: '18px', alignItems: 'center' }}
                    >
                      <div style={{ position: 'relative', width: '70px', height: '70px', backgroundColor: '#F4F7FA', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.03)' }}>
                        <Image src={item.images[0]?.src || ""} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px', color: '#0E1F33', lineHeight: 1.3 }}>{item.name}</h3>
                        <p style={{ fontSize: '9px', fontWeight: 700, opacity: 0.3, marginBottom: '12px', textTransform: 'uppercase' }}>SKU: {item.sku || 'N/A'}</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ 
                            display: 'flex', alignItems: 'center', backgroundColor: '#F4F7FA', 
                            borderRadius: '8px', padding: 'var(--qty-padding, 3px 8px)', gap: '15px' 
                          }} className="qty-control">
                            <button onClick={() => updateQty(item.id, -1)} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', opacity: 0.5, width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover:opacity-100"><Minus size={14} /></button>
                            <span style={{ fontSize: '13px', fontWeight: 900, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, 1)} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', opacity: 0.5, width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover:opacity-100"><Plus size={14} /></button>
                          </div>
                          <span style={{ fontWeight: 900, fontSize: '14px', color: 'var(--brand-navy)' }}>${Math.round(Number(item.price) * item.quantity).toLocaleString('es-CL')}</span>
                        </div>
                      </div>

                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.15 }} className="hover:opacity-100 hover:text-red-600 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* 💰 FOOTER DE ACCIÓN B2B */}
            {cart.length > 0 && (
              <div style={{ padding: '40px 30px', borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '35px' }}>
                  <span style={{ fontSize: '11px', opacity: 0.4, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Neto Estimado</span>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--brand-navy)', lineHeight: 1 }}>
                      ${Math.round(cartTotal).toLocaleString('es-CL')}
                    </p>
                    <span style={{ fontSize: '9px', opacity: 0.4, fontWeight: 900, textTransform: 'uppercase' }}>IVA Incluido*</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  <button 
                    onClick={() => setIsQuotePreviewOpen(true)}
                    style={{ 
                      width: '100%', backgroundColor: 'transparent', color: '#000', border: '1px solid #0E1F33', padding: '15px', borderRadius: '4px',
                      fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer'
                    }}
                  >
                    Ver Pre-Cotización Profesional
                  </button>

                  <button 
                    onClick={handleWhatsAppQuote}
                    style={{ 
                      width: '100%', border: 'none', backgroundColor: '#0E1F33', color: '#FFF', padding: '22px', borderRadius: '4px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px',
                      fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer',
                      boxShadow: '0 15px 35px rgba(14, 31, 51, 0.2)'
                    }}
                    className="hover:scale-[1.02] transition-transform duration-300"
                  >
                    <MessageSquare size={16} className="text-[var(--primary-gold)]" />
                    Enviar a WhatsApp B2B
                  </button>
                  <Link 
                    href="/cotizacion"
                    onClick={() => setIsCartOpen(false)}
                    style={{ 
                      width: '100%', border: '1px solid rgba(14, 31, 51, 0.2)', background: 'transparent', color: '#0E1F33', padding: '18px', borderRadius: '4px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Ver Cotización Detallada</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>

      <QuotePreview 
        isOpen={isQuotePreviewOpen}
        onClose={() => setIsQuotePreviewOpen(false)}
        projectRef={projectName || ''}
      />
    </>
  );
}
