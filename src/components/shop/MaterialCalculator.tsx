"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, BrickWall, Ruler, Droplets, ChevronRight, Package, Truck, Activity, LayoutGrid } from "lucide-react";

type CalculatorType = 'concrete' | 'ceramic' | 'roof';

export default function MaterialCalculator() {
  const [activeTab, setActiveTab] = useState<CalculatorType>('concrete');
  
  // Concrete State
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [depth, setDepth] = useState(0);

  // Ceramic State
  const [cLength, setCLength] = useState(0);
  const [cWidth, setCWidth] = useState(0);
  const [waste, setWaste] = useState(10); // 10% default waste
  
  // Concrete Logic
  const volume = length * width * depth;
  const cementBags = Math.ceil(volume * 7.5); 
  const sandCube = (volume * 0.5).toFixed(2);

  // Ceramic Logic
  const area = cLength * cWidth;
  const totalAreaWithWaste = area * (1 + (waste / 100));
  const boxes = Math.ceil(totalAreaWithWaste / 1.5); // Aprox 1.5m2 por caja

  return (
    <div style={{ padding: '60px 5%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#D4AF37', letterSpacing: '0.4em' }}>Herramientas de Ingeniería</span>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', marginTop: '15px' }}>Calculadora de Materiales Patagónicos.</h2>
            <p style={{ opacity: 0.5, maxWidth: '600px', margin: '20px auto', fontSize: '14px' }}>Optimiza tu logística en el Estrecho de Magallanes cubicando con precisión absoluta tus proyectos de obra civil.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
            {/* 🛠️ CALCULATOR INTERFACE */}
            <div className="titanium-glass" style={{ padding: '40px', borderRadius: '24px', border: '1px solid rgba(14, 31, 51, 0.1)' }}>
                
                {/* TABS */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
                    {[
                        { id: 'concrete', icon: <Droplets />, label: 'Hormigón' },
                        { id: 'ceramic', icon: <LayoutGrid />, label: 'Cerámicos' },
                        { id: 'roof', icon: <BrickWall />, label: 'Techumbre' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as CalculatorType)}
                            style={{
                                flex: 1, padding: '20px', borderRadius: '12px', cursor: 'pointer',
                                backgroundColor: activeTab === tab.id ? '#0E1F33' : 'rgba(14, 31, 51, 0.05)',
                                color: activeTab === tab.id ? '#FFF' : '#0E1F33',
                                border: activeTab === tab.id ? '2px solid #D4AF37' : '1px solid transparent',
                                transition: '0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
                            }}
                        >
                            {React.cloneElement(tab.icon as any, { size: 24 })}
                            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* DYNAMIC INPUTS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {activeTab === 'concrete' ? (
                        <>
                            <div>
                                <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', opacity: 0.5 }}>Largo del Área (m)</label>
                                <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} style={{ width: '100%', padding: '20px', borderRadius: '12px', backgroundColor: '#FFF', border: '1px solid #E2E8F0', fontSize: '18px', fontWeight: 700 }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', opacity: 0.5 }}>Ancho del Área (m)</label>
                                <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} style={{ width: '100%', padding: '20px', borderRadius: '12px', backgroundColor: '#FFF', border: '1px solid #E2E8F0', fontSize: '18px', fontWeight: 700 }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', opacity: 0.5 }}>Espesor / Profundidad (m)</label>
                                <input type="number" value={depth} onChange={(e) => setDepth(Number(e.target.value))} style={{ width: '100%', padding: '20px', borderRadius: '12px', backgroundColor: '#FFF', border: '1px solid #E2E8F0', fontSize: '18px', fontWeight: 700 }} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', opacity: 0.5 }}>Largo de Planta (m)</label>
                                <input type="number" value={cLength} onChange={(e) => setCLength(Number(e.target.value))} style={{ width: '100%', padding: '20px', borderRadius: '12px', backgroundColor: '#FFF', border: '1px solid #E2E8F0', fontSize: '18px', fontWeight: 700 }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', opacity: 0.5 }}>Ancho de Planta (m)</label>
                                <input type="number" value={cWidth} onChange={(e) => setCWidth(Number(e.target.value))} style={{ width: '100%', padding: '20px', borderRadius: '12px', backgroundColor: '#FFF', border: '1px solid #E2E8F0', fontSize: '18px', fontWeight: 700 }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', opacity: 0.5 }}>% Desperdicio (Cortes)</label>
                                <input type="number" value={waste} onChange={(e) => setWaste(Number(e.target.value))} style={{ width: '100%', padding: '20px', borderRadius: '12px', backgroundColor: '#FFF', border: '1px solid #E2E8F0', fontSize: '18px', fontWeight: 700 }} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 📊 RESULTS PANEL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ backgroundColor: '#0E1F33', color: '#FFF', padding: '40px', borderRadius: '24px', boxShadow: '0 30px 60px rgba(14, 31, 51, 0.2)' }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#D4AF37', marginBottom: '30px' }}>Resultado de Cubicación</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {activeTab === 'concrete' ? (
                            <>
                                <div>
                                    <span style={{ display: 'block', fontSize: '42px', fontWeight: 900 }}>{volume.toFixed(2)} m³</span>
                                    <span style={{ fontSize: '10px', opacity: 0.5, textTransform: 'uppercase' }}>Volumen Total Hormigón</span>
                                </div>
                                <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div><p style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>{cementBags} Sacos</p><p style={{ fontSize: '10px', opacity: 0.5, margin: 0 }}>Cemento Comodoro</p></div>
                                    <Package size={24} style={{ color: '#D4AF37' }} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <span style={{ display: 'block', fontSize: '42px', fontWeight: 900 }}>{totalAreaWithWaste.toFixed(2)} m²</span>
                                    <span style={{ fontSize: '10px', opacity: 0.5, textTransform: 'uppercase' }}>Superficie Total (Inc. {waste}%)</span>
                                </div>
                                <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div><p style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>{boxes} Cajas</p><p style={{ fontSize: '10px', opacity: 0.5, margin: 0 }}>Rendimiento Estándar (1.5m²)</p></div>
                                    <LayoutGrid size={24} style={{ color: '#D4AF37' }} />
                                </div>
                            </>
                        )}
                    </div>

                    <button className="gold-shimmer" style={{ width: '100%', marginTop: '40px', padding: '20px', borderRadius: '12px', border: 'none', color: '#000', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>
                        Enviar a Cotización
                    </button>
                </div>

                <div style={{ padding: '25px', backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: '18px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Truck size={18} style={{ color: '#D4AF37' }} />
                        <span style={{ fontSize: '10px', fontWeight: 900, color: '#D4AF37', textTransform: 'uppercase' }}>Logística Magallanes</span>
                    </div>
                    <p style={{ fontSize: '11px', lineHeight: 1.6, marginTop: '10px', opacity: 0.8 }}>
                        Este volumen requiere coordinación de despacho pesado. Entrega disponible en Punta Arenas y provincias.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}

