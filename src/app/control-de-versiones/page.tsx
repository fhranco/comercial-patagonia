"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Database, History, ChevronRight } from 'lucide-react';
import { APP_VERSION, APP_RELEASE_DATE, APP_CHANGELOG } from '@/lib/version';
import Navigation from '@/components/layout/Navigation';

export default function VersionControlPage() {
  return (
    <div style={{ backgroundColor: '#0E1F33', minHeight: '100vh', color: '#FFF', fontFamily: 'var(--font-body)' }}>
      <Navigation transparent={false} />
      
      <main style={{ padding: '150px 5% 100px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* 🛸 HEADER DE CONTROL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#D4AF37', marginBottom: '20px' }}>
              <Cpu size={20} />
              <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em' }}>Sistemas de Control Patagonia</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
              REPORTE DE <br/><span style={{ opacity: 0.3 }}>VERSIONAMIENTO</span>
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', fontWeight: 900, opacity: 0.5, textTransform: 'uppercase', marginBottom: '10px' }}>Status del Núcleo</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00FF94' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00FF94' }} className="animate-pulse" />
              <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>Operacional / v1.2.2</span>
            </div>
          </div>
        </div>

        {/* 📊 GRID DE ESTADO */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '100px' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <ShieldCheck size={30} style={{ color: '#D4AF37', marginBottom: '25px' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>Build Authority</h3>
            <p style={{ fontSize: '14px', opacity: 0.6, lineHeight: 1.6 }}>Versión certificada para despliegue en entornos de alta demanda B2B.</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Database size={30} style={{ color: '#D4AF37', marginBottom: '25px' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>Integridad de Datos</h3>
            <p style={{ fontSize: '14px', opacity: 0.6, lineHeight: 1.6 }}>Sincronización WooCommerce optimizada con fallback de Mock Data v3.</p>
          </div>
        </div>

        {/* 📜 CHANGELOG HISTÓRICO */}
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '50px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-5px', top: 0, width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#D4AF37' }} />
          
          <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '60px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <History size={20} /> Historial de Cambios
          </h2>

          {APP_CHANGELOG.map((log, idx) => (
            <motion.div 
              key={log.version}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ marginBottom: '80px' }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '30px' }}>
                <span style={{ fontSize: '32px', fontWeight: 900, color: '#D4AF37' }}>{log.version}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, opacity: 0.4 }}>Release: {log.date}</span>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {log.changes.map((change, cIdx) => (
                  <li key={cIdx} style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '15px', opacity: 0.8, lineHeight: 1.6 }}>
                    <ChevronRight size={14} style={{ color: '#D4AF37', marginTop: '5px', flexShrink: 0 }} />
                    {change}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: '100px', textAlign: 'center', opacity: 0.2, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em' }}>
          Patagonia Coach Tactical Systems • End of Report
        </div>
      </main>
    </div>
  );
}
