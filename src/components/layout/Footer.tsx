"use client";

import React from "react";
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{ 
      display: 'block',
      width: '100%',
      padding: '100px 5%', 
      backgroundColor: '#F8FAFC', 
      borderTop: `1px solid var(--border-color)`,
      color: 'var(--brand-navy)',
      position: 'relative',
      zIndex: 10
    }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '60px', textAlign: 'left' }}>
            
            {/* 🏔️ BRAND & DESCRIPTION */}
            <div>
                <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '25px', color: 'var(--primary-gold)' }}>Comercial de la Patagonia</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.7, maxWidth: '300px' }}>
                    Tradición y Calidad en Suministro Estratégico para Construcción e Industria en la Región de Magallanes.
                </p>
            </div>

            {/* 📞 CONTACTO OFICIAL */}
            <div>
                <h4 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '25px' }}>Contacto</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <a href="tel:+56612214111" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', fontSize: '14px' }} className="hover:text-[var(--primary-gold)] transition-colors">
                        <Phone size={16} opacity={0.5} /> +56 61 221 4111
                    </a>
                    <a href="tel:+56985806125" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', fontSize: '14px' }} className="hover:text-[var(--primary-gold)] transition-colors">
                        <Phone size={16} opacity={0.5} /> +56 9 8580 6125
                    </a>
                    <a href="tel:+56985806127" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', fontSize: '14px' }} className="hover:text-[var(--primary-gold)] transition-colors">
                        <Phone size={16} opacity={0.5} /> +56 9 8580 6127
                    </a>
                    <a href="mailto:ventas@comercialpatagonia.cl" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', fontSize: '14px' }} className="hover:text-[var(--primary-gold)] transition-colors">
                        <Mail size={16} opacity={0.5} /> ventas@comercialpatagonia.cl
                    </a>
                </div>
            </div>

            {/* 📍 UBICACIÓN */}
            <div>
                <h4 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '25px' }}>Casa Matriz</h4>
                <p style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', lineHeight: 1.6, opacity: 0.7 }}>
                    <MapPin size={18} style={{ marginTop: '3px', flexShrink: 0 }} />
                    Av. Principal, Zona Franca<br/>
                    Manzana 12 Sitio 71<br/>
                    Punta Arenas, Chile
                </p>
                <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                    <a href="https://www.instagram.com/comercialdelapatagonia/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }} className="hover:text-[var(--primary-gold)] transition-colors"><Instagram size={20} /></a>
                    <a href="https://www.facebook.com/comercialdelapatagonia?locale=es_LA" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }} className="hover:text-[var(--primary-gold)] transition-colors"><Facebook size={20} /></a>
                </div>
            </div>

        </div>

        <div style={{ maxWidth: '1400px', margin: '80px auto 0', paddingTop: '40px', borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                © {currentYear} COMERICAL DE LA PATAGONIA • EXCELENCIA INDUSTRIAL
            </p>
        </div>
    </footer>
  );
}
