"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Truck, ShieldCheck, X, Phone, Headset, Construction } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function B2BConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const phone = "56985806127";

  const conciergeOptions = [
    {
      id: "logistics",
      title: "Despacho Magallanes",
      desc: "Consultar logística y fleteros",
      icon: <Truck className="w-5 h-5" />,
      action: () => window.open(`https://wa.me/${phone}?text=Hola Patagonia, necesito cotizar el despacho de mi pedido a mi obra.`, '_blank'),
      color: "#D4AF37"
    },
    {
      id: "technical",
      title: "Asesoría Técnica",
      desc: "Especificaciones y cubicación",
      icon: <Construction className="w-5 h-5" />,
      action: () => window.open(`https://wa.me/${phone}?text=Hola, busco asesoría técnica sobre los materiales de construcción.`, '_blank'),
      color: "#0E1F33"
    },
    {
        id: "support",
        title: "Atención Especial B2B",
        desc: "Arquitectos y Constructoras",
        icon: <Headset className="w-5 h-5" />,
        action: () => window.open(`https://wa.me/${phone}?text=Hola, represento a una constructora/arquitecto y busco atención profesional.`, '_blank'),
        color: "#0E1F33"
      }
  ];

  return (
    <div className="concierge-wrapper" style={{ position: 'fixed', zIndex: 8000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ 
              position: 'absolute', bottom: '80px', right: 0, 
              width: '320px', backgroundColor: 'rgba(255, 255, 255, 0.85)', 
              backdropFilter: 'blur(20px)', borderRadius: '12px',
              padding: '25px', boxShadow: '0 20px 50px rgba(14, 31, 51, 0.25)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              overflow: 'hidden'
            }}
          >
            <div style={{ marginBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '15px' }}>
                <h3 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#0E1F33', opacity: 0.6, marginBottom: '5px' }}>Concierge Patagonia</h3>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#0E1F33' }}>¿Cómo podemos ayudar con su proyecto hoy?</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {conciergeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={opt.action}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '15px', padding: '15px',
                    backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '8px',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s'
                  }}
                  className="hover:shadow-md hover:border-[var(--primary-gold)] transition-all group"
                >
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(14,31,51,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: opt.color
                  }} className="group-hover:bg-[#0E1F33] group-hover:text-white transition-all">
                    {opt.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: '#0E1F33' }}>{opt.title}</h4>
                    <p style={{ fontSize: '10px', opacity: 0.5 }}>{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '9px', fontWeight: 900, opacity: 0.3, textTransform: 'uppercase' }}>Tradición y Calidad en Magallanes</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          height: '65px', borderRadius: '100px', 
          backgroundColor: '#D4AF37', 
          border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          gap: '12px', padding: '0 25px',
          cursor: 'pointer', 
          boxShadow: '0 15px 35px rgba(212, 175, 55, 0.4)',
          position: 'relative'
        }}
      >
        <MessageSquare className="w-6 h-6 text-[#0E1F33]" />
        <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#0E1F33' }}>
            Concierge B2B
        </span>
        
        {/* Active Session Indicator */}
        {!isOpen && (
            <div style={{ 
                position: 'absolute', top: '-5px', right: '10px', 
                width: '12px', height: '12px', borderRadius: '50%', 
                backgroundColor: '#22c55e', border: '2px solid #FFF',
                zIndex: 1
            }} className="animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
