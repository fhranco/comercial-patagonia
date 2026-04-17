"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, MapPin, Globe, Activity, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";

interface MagallanesLogisticsProps {
  isLive?: boolean;
}

export default function MagallanesLogistics({ isLive = true }: MagallanesLogisticsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseColor, setPulseColor] = useState("#22C55E"); // Verde

  // Simular latencia de conexión
  useEffect(() => {
    const interval = setInterval(() => {
        setPulseColor(Math.random() > 0.9 ? "#EAB308" : "#22C55E"); // Amarillo ocasional para realismo
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: '30px', left: '30px', zIndex: 1000 }}>
        <motion.div
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                padding: isExpanded ? '20px' : '10px 15px',
                borderRadius: '12px',
                border: '1px solid rgba(14, 31, 51, 0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: isExpanded ? '280px' : 'fit-content',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                overflow: 'hidden'
            }}
        >
            {/* 🛰️ HEADER PULSER */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
                <div style={{ position: 'relative' }}>
                    <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ position: 'absolute', inset: -4, backgroundColor: pulseColor, borderRadius: '50%' }}
                    />
                    <div style={{ width: '8px', height: '8px', backgroundColor: pulseColor, borderRadius: '50%', position: 'relative' }} />
                </div>
                
                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#0E1F33' }}>
                    {isExpanded ? 'B2B Logistics Hub' : 'Live Status'}
                </span>

                {isExpanded && (
                    <span style={{ fontSize: '8px', fontWeight: 700, padding: '2px 6px', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '4px', textTransform: 'uppercase', marginLeft: 'auto' }}>
                        Connected
                    </span>
                )}
            </div>

            {/* 📊 EXPANDED DATA */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                    >
                        <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MapPin size={12} className="text-[#0E1F33]" />
                                    <span style={{ fontSize: '11px', fontWeight: 700 }}>Punta Arenas</span>
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: 500, color: '#15803D' }}>Operativo</span>
                            </div>
                            <div style={{ height: '4px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                                <motion.div 
                                    animate={{ width: '85%' }}
                                    style={{ height: '100%', backgroundColor: '#22C55E' }} 
                                />
                            </div>
                            <p style={{ fontSize: '9px', opacity: 0.5, marginTop: '6px' }}>Entrega estimanda: 24 - 48 hrs</p>
                        </div>

                        <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Globe size={12} className="text-[#0E1F33]" />
                                    <span style={{ fontSize: '11px', fontWeight: 700 }}>Cruce Primera Angostura</span>
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: 500, color: '#15803D' }}>Normal</span>
                            </div>
                            <p style={{ fontSize: '9px', opacity: 0.5 }}>Frecuencia de cruce: Cada 45 min</p>
                        </div>

                        <div style={{ borderTop: '1px solid #EEE', paddingTop: '10px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <Activity size={12} className="text-[#D4AF37]" />
                             <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: '#D4AF37' }}>Sync WooCommerce Live</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isExpanded && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <Truck size={10} className="opacity-30" />
                    <span style={{ fontSize: '9px', fontWeight: 700, opacity: 0.4 }}>Punta Arenas: 24h</span>
                </div>
            )}
        </motion.div>
    </div>
  );
}
 
