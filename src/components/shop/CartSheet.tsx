"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, FileText } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { BRAND_CONFIG } from "@/lib/constants";

export default function CartSheet() {
  const { 
    cart, isCartOpen, setIsCartOpen, updateQty, removeFromCart, cartTotal,
    projectName, setProjectName,
    clientName, setClientName,
    clientEmail, setClientEmail,
    clientPhone, setClientPhone,
    saveQuoteToHistory, clearCart
  } = useCart();
  const { theme } = useTheme();

  const sendWhatsAppRequest = () => {
    if (!clientName || !clientEmail || !clientPhone) {
      alert("Por favor completa tus datos de contacto (Nombre, Correo y Teléfono) en el formulario para registrar tu cotización.");
      return;
    }

    saveQuoteToHistory(); // 💾 Archivar en historial local

    const itemsList = cart.map(item => `%0A- ${item.quantity}x ${item.name}`).join('');
    const projectHeader = projectName ? `Proyecto: *${projectName}*%0A` : '';
    
    // 🚀 Abrir WhatsApp inmediatamente para evitar bloqueador de popups
    const message = `🏔️ *SOLICITUD DE COTIZACIÓN*%0AComercial de la Patagonia%0A%0A${projectHeader}--------------------------${itemsList}%0A--------------------------%0A*TOTAL ESTIMADO:* $${Math.round(cartTotal).toLocaleString('es-CL')}%0A%0A*DATOS DEL CLIENTE:*%0ANombre: ${clientName}%0AEmail: ${clientEmail}%0ATeléfono: ${clientPhone}%0A%0A_Favor confirmar disponibilidad para despacho en Magallanes._`;
    window.open(`https://wa.me/${BRAND_CONFIG.whatsapp.replace('+', '').replace(/\s/g, '')}?text=${message}`, '_blank');

    // 🔄 Registrar en WooCommerce de forma segura en segundo plano llamando al endpoint interno de Next.js
    fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        projectName: projectName || "",
        cart: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity
        }))
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("Cotización registrada en WooCommerce de forma segura. ID:", data.orderId);
        } else {
          console.error("Error al registrar cotización:", data.error || data);
        }
      })
      .catch(err => {
        console.error("Error de red al registrar cotización:", err);
      });

    // Limpiar carrito y cerrar
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsCartOpen(false)} 
            style={{ 
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3000, 
              background: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)', 
              backdropFilter: 'blur(10px)' 
            }} 
          />
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 30, stiffness: 300 }} 
            style={{ 
              position: 'fixed', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: '420px', 
              backgroundColor: 'var(--card-bg)', zIndex: 3001, padding: '30px', 
              display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-color)' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase' }}>Mi Cotización</h3>
              <button 
                onClick={() => setIsCartOpen(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              >
                <X className="w-5 h-5 opacity-30" />
              </button>
            </div>

            {/* Contact Fields */}
            <div style={{ marginBottom: '25px', padding: '15px', background: 'rgba(212, 175, 55, 0.05)', border: '1px dashed rgba(212, 175, 55, 0.3)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, color: 'var(--primary-gold)' }}>
                Identificación y Obra de Cotización
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Nombre completo *" 
                  value={clientName || ''}
                  onChange={(e) => setClientName(e.target.value)}
                  style={{ 
                    width: '100%', background: 'transparent', border: 'none', 
                    borderBottom: !clientName ? '1px solid var(--primary-gold)' : '1px solid var(--border-color)', padding: '5px 0',
                    fontSize: '11px', fontWeight: 600, color: 'inherit', outline: 'none'
                  }}
                />
                <input 
                  type="email" 
                  placeholder="Correo electrónico *" 
                  value={clientEmail || ''}
                  onChange={(e) => setClientEmail(e.target.value)}
                  style={{ 
                    width: '100%', background: 'transparent', border: 'none', 
                    borderBottom: !clientEmail ? '1px solid var(--primary-gold)' : '1px solid var(--border-color)', padding: '5px 0',
                    fontSize: '11px', fontWeight: 600, color: 'inherit', outline: 'none'
                  }}
                />
                <input 
                  type="tel" 
                  placeholder="Teléfono de contacto *" 
                  value={clientPhone || ''}
                  onChange={(e) => setClientPhone(e.target.value)}
                  style={{ 
                    width: '100%', background: 'transparent', border: 'none', 
                    borderBottom: !clientPhone ? '1px solid var(--primary-gold)' : '1px solid var(--border-color)', padding: '5px 0',
                    fontSize: '11px', fontWeight: 600, color: 'inherit', outline: 'none'
                  }}
                />
                <input 
                  type="text" 
                  placeholder="Nombre del Proyecto / Obra" 
                  value={projectName || ''}
                  onChange={(e) => setProjectName(e.target.value)}
                  style={{ 
                    width: '100%', background: 'transparent', border: 'none', 
                    borderBottom: '1px solid var(--border-color)', padding: '5px 0',
                    fontSize: '11px', fontWeight: 600, color: 'inherit', outline: 'none'
                  }}
                />
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }} className="no-scrollbar">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', opacity: 0.3, marginTop: '50px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>Tu carrito está vacío</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '15px', padding: '15px', backgroundColor: 'var(--bg-color)', borderRadius: '4px', marginBottom: '10px' }}>
                    <div style={{ width: '60px', height: '60px', position: 'relative', overflow: 'hidden', borderRadius: '2px' }}>
                      {item.images[0] && (
                        <Image 
                          src={item.images[0].src} 
                          alt={item.name} 
                          fill
                          sizes="60px"
                          style={{ objectFit: 'cover' }} 
                        />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>{item.name}</h4>
                        <p style={{ fontSize: '12px', fontWeight: 900, marginTop: '4px', opacity: 0.6 }}>${Math.round(Number(item.price)).toLocaleString('es-CL')}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px 8px' }}>
                              <button onClick={() => updateQty(item.id, -1)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Minus className="w-3 h-3" /></button>
                              <span style={{ fontSize: '10px', fontWeight: 900 }}>{item.quantity}</span>
                              <button onClick={() => updateQty(item.id, 1)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus className="w-3 h-3" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'red', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer', opacity: 0.5 }}>Eliminar</button>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ paddingTop: '30px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4 }}>Total Estimado</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>${Math.round(cartTotal).toLocaleString('es-CL')}</span>
                </div>
                <button 
                  onClick={sendWhatsAppRequest}
                  style={{ 
                    width: '100%', backgroundColor: '#D4AF37', color: '#000', padding: '20px', 
                    fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', border: 'none', 
                    cursor: 'pointer', borderRadius: '4px', boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)',
                    marginBottom: '10px'
                  }}
                >
                  Solicitar Cotización Pro
                </button>

                <Link 
                  href="/cotizacion"
                  onClick={() => setIsCartOpen(false)}
                  style={{ 
                    width: '100%', border: '1px solid var(--border-color)', color: 'inherit', padding: '15px', 
                    fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', 
                    cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '10px', textDecoration: 'none'
                  }}
                >
                  <FileText className="w-4 h-4 opacity-50" />
                  Descargar Cotización (PDF)
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
