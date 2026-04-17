"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { BRAND_CONFIG } from "@/lib/constants";
import Image from "next/image";

export default function CotizacionPrintPage() {
  const { cart, cartTotal, projectName } = useCart();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for hydration
    setIsReady(true);
  }, []);

  if (!isReady || cart.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-geist-sans)' }}>
        <p>Cargando cotización...</p>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="print-container" style={{ 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto', 
      backgroundColor: '#fff', 
      color: '#000',
      minHeight: '100vh',
      fontFamily: 'serif' 
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-container { padding: 0 !important; max-width: 100% !important; }
        }
        @page {
          margin: 2cm;
        }
      `}} />

      {/* HEADER CORPORATIVO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '30px', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>{BRAND_CONFIG.name}</h1>
          <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>{BRAND_CONFIG.address} | {BRAND_CONFIG.email}</p>
          <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>WhatsApp: {BRAND_CONFIG.whatsapp}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5 }}>Cotización de Equipamiento</h2>
          <p style={{ fontSize: '12px' }}>Fecha: {currentDate}</p>
          {projectName && (
            <div style={{ marginTop: '10px', backgroundColor: '#f5f5f5', padding: '5px 10px', borderRadius: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', display: 'block' }}>Proyecto</span>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>{projectName}</span>
            </div>
          )}
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '50px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <th style={{ textAlign: 'left', padding: '15px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Descripción del Producto</th>
            <th style={{ textAlign: 'center', padding: '15px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', width: '80px' }}>Cant.</th>
            <th style={{ textAlign: 'right', padding: '15px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', width: '120px' }}>Unitario</th>
            <th style={{ textAlign: 'right', padding: '15px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', width: '120px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
              <td style={{ padding: '20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                     {item.images[0] && (
                       <img src={item.images[0].src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     )}
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, display: 'block' }}>{item.name}</span>
                    <span style={{ fontSize: '10px', opacity: 0.5 }}>SKU: {item.sku || 'N/A'}</span>
                  </div>
                </div>
              </td>
              <td style={{ textAlign: 'center', fontSize: '13px' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', fontSize: '13px' }}>${Math.round(Number(item.price)).toLocaleString('es-CL')}</td>
              <td style={{ textAlign: 'right', fontSize: '13px', fontWeight: 700 }}>${Math.round(Number(item.price) * item.quantity).toLocaleString('es-CL')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <div style={{ marginLeft: 'auto', maxWidth: '300px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', opacity: 0.6 }}>Subtotal</span>
          <span style={{ fontSize: '13px' }}>${Math.round(cartTotal).toLocaleString('es-CL')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', opacity: 0.6 }}>IVA (19%)</span>
          <span style={{ fontSize: '13px' }}>Incluido</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '15px', borderTop: '2px solid #000', marginTop: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase' }}>Total Estimado</span>
          <span style={{ fontSize: '18px', fontWeight: 900 }}>${Math.round(cartTotal).toLocaleString('es-CL')}</span>
        </div>
      </div>

      {/* FOOTER / LEGAL */}
      <div style={{ marginTop: '100px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <p style={{ fontSize: '10px', opacity: 0.5, lineHeight: 1.5, maxWidth: '500px' }}>
          * Esta es una cotización referencial y no constituye una reserva de stock ni documento tributario (Boleta o Factura). Los precios pueden variar según disponibilidad técnica. Validez de la cotización: 15 días desde la fecha de emisión.
        </p>
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '4px', textTransform: 'uppercase' }}>Solidez que Construye Futuro</p>
        </div>
      </div>

      {/* CONTROLES DE IMPRESIÓN (NO PRINT) */}
      <div className="no-print" style={{ 
        position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', 
        display: 'flex', gap: '20px', backgroundColor: 'rgba(0,0,0,0.8)', padding: '15px 30px', 
        borderRadius: '100px', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        zIndex: 1000
      }}>
        <button 
          onClick={() => window.print()}
          style={{ 
            background: '#D4AF37', color: '#000', border: 'none', padding: '10px 25px', 
            borderRadius: '100px', fontSize: '12px', fontWeight: 900, cursor: 'pointer',
            textTransform: 'uppercase'
          }}
        >
          Imprimir / Guardar PDF
        </button>
        <button 
          onClick={() => window.history.back()}
          style={{ 
            background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', 
            padding: '10px 25px', borderRadius: '100px', fontSize: '12px', fontWeight: 900, 
            cursor: 'pointer', textTransform: 'uppercase'
          }}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
