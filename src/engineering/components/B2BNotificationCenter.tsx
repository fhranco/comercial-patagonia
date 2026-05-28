"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Volume2, VolumeX, Trash2, X, AlertTriangle, ShieldCheck, Zap, Radio } from 'lucide-react';
import { formatCurrency } from '@/engineering/utils/calculations';

interface B2BAlert {
  id: string;
  materialName: string;
  location: string;
  stockLeft: number;
  unit: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  severity: 'critical' | 'warning';
}

export default function B2BNotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState<B2BAlert[]>([]);
  const [showToast, setShowToast] = useState<B2BAlert | null>(null);

  // Play premium synthesized notification chime
  const triggerAudioChime = () => {
    if (typeof window === 'undefined' || !isSoundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, ctx.currentTime); // E6
      
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('Audio feedback failed:', e);
    }
  };

  // Load subscriptions and notifications on mount
  useEffect(() => {
    const savedSub = localStorage.getItem('patagonia-b2b-subscribed');
    if (savedSub !== null) {
      setIsSubscribed(savedSub === 'true');
    }
    const savedSound = localStorage.getItem('patagonia-b2b-sound');
    if (savedSound !== null) {
      setIsSoundEnabled(savedSound === 'true');
    }
    const savedNotifs = localStorage.getItem('patagonia-b2b-alerts');
    if (savedNotifs) {
      setNotifications(JSON.parse(savedNotifs));
    } else {
      // Default initial welcome alert
      const welcomeAlert: B2BAlert = {
        id: 'welcome',
        materialName: 'Canal de Ingeniería Sincronizado',
        location: 'Centro Logístico Punta Arenas',
        stockLeft: 100,
        unit: '%',
        message: 'Conexión activa. Monitoreando stock crítico en Zona Franca de forma directa.',
        timestamp: new Date().toISOString(),
        isRead: false,
        severity: 'warning'
      };
      setNotifications([welcomeAlert]);
      localStorage.setItem('patagonia-b2b-alerts', JSON.stringify([welcomeAlert]));
    }
  }, []);

  // Save alerts helper
  const saveNotifications = (updated: B2BAlert[]) => {
    setNotifications(updated);
    localStorage.setItem('patagonia-b2b-alerts', JSON.stringify(updated));
  };

  // Simulate a live stock alert
  const generateSimulatedAlert = React.useCallback(() => {
    if (!isSubscribed) return;

    const materialsPool = [
      { name: 'Cemento Secado Rápido Comodoro', unit: 'sacos', loc: 'Bodega Central Punta Arenas', range: [15, 30], sev: 'critical' as const, msg: 'Demanda crítica detectada en obra local. Retraso en cruce por Primera Angostura.' },
      { name: 'Gravilla Limpia 3/4 Planta', unit: 'm³', loc: 'Planta de Áridos Río Seco', range: [3, 8], sev: 'critical' as const, msg: 'Nivel bajo de extracción. Prioridad de despacho reservada para cotizaciones B2B activas.' },
      { name: 'Plancha Zinc-Alum 0.4mm x 3.66m', unit: 'planchas', loc: 'Bodega Principal Punta Arenas', range: [10, 25], sev: 'warning' as const, msg: 'Disminución de stock debido a compras masivas por alerta climática regional.' },
      { name: 'Cemento Secado Normal Binelli', unit: 'sacos', loc: 'Bodega Puerto Natales', range: [20, 45], sev: 'warning' as const, msg: 'Altos consumos en obras viales. Reposición programada en 72 horas.' },
      { name: 'Piso Flotante Premium 8mm', unit: 'cajas', loc: 'Bodega Central Punta Arenas', range: [8, 15], sev: 'critical' as const, msg: 'Stock crítico. Material importado sujeto a cupos de Zona Franca.' }
    ];

    const randomItem = materialsPool[Math.floor(Math.random() * materialsPool.length)];
    const stockLeft = Math.floor(Math.random() * (randomItem.range[1] - randomItem.range[0]) + randomItem.range[0]);

    const newAlert: B2BAlert = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      materialName: randomItem.name,
      location: randomItem.loc,
      stockLeft,
      unit: randomItem.unit,
      message: randomItem.msg,
      timestamp: new Date().toISOString(),
      isRead: false,
      severity: randomItem.sev
    };

    const updated = [newAlert, ...notifications].slice(0, 30); // Max 30 logs
    saveNotifications(updated);
    setShowToast(newAlert);
    triggerAudioChime();
  }, [notifications, isSubscribed]);

  // Periodic simulation
  useEffect(() => {
    if (!isSubscribed) return;

    // Run every 90 seconds
    const interval = setInterval(() => {
      generateSimulatedAlert();
    }, 90000);

    return () => clearInterval(interval);
  }, [generateSimulatedAlert, isSubscribed]);

  // UI Handlers
  const handleToggleSub = () => {
    const nextVal = !isSubscribed;
    setIsSubscribed(nextVal);
    localStorage.setItem('patagonia-b2b-subscribed', String(nextVal));
  };

  const handleToggleSound = () => {
    const nextVal = !isSoundEnabled;
    setIsSoundEnabled(nextVal);
    localStorage.setItem('patagonia-b2b-sound', String(nextVal));
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    saveNotifications(updated);
  };

  const handleClearAll = () => {
    if (confirm('¿Desea limpiar el historial de alertas B2B?')) {
      saveNotifications([]);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* 📡 FLOATING TRIGGER BELL */}
      <div 
        style={{ position: 'fixed', bottom: '30px', left: '30px', zIndex: 4000 }}
        className="floating-bell-container"
      >
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            handleMarkAllRead();
          }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-navy)',
            border: '2px solid rgba(214, 175, 55, 0.3)',
            boxShadow: '0 15px 35px rgba(14, 31, 51, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            outline: 'none',
            color: '#FFFFFF'
          }}
          className="hover:scale-105 transition-transform duration-300 active:scale-95 group"
        >
          {isSubscribed && (
            <div 
              style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '50%',
                border: '1px solid rgba(214, 175, 55, 0.4)',
                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            />
          )}
          <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'animate-bounce text-[#D4AF37]' : 'text-white opacity-80'}`} />
          {unreadCount > 0 && (
            <div 
              style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                backgroundColor: '#D4AF37',
                color: 'black',
                fontSize: '9px',
                fontWeight: 900,
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              {unreadCount}
            </div>
          )}
        </button>
      </div>

      {/* 📟 INDUSTRIAL B2B ALERT LOG DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 8500,
              display: 'flex',
              justifyContent: 'flex-start',
              backgroundColor: 'rgba(14, 31, 51, 0.4)',
              backdropFilter: 'blur(10px)'
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                width: '100%',
                maxWidth: '450px',
                height: '100%',
                backgroundColor: '#0E1F33',
                borderRight: '1px solid rgba(214, 175, 55, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '20px 0 50px rgba(0, 0, 0, 0.3)',
                color: 'white'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div style={{ padding: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(214, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Radio className="w-5 h-5 text-[#D4AF37] animate-pulse" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>
                      Monitoreo de Stock B2B
                    </h3>
                    <p style={{ fontSize: '9px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                      Canal Sincronizado Zona Franca
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Preferences / Control Hub */}
              <div style={{ padding: '20px 30px', backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={handleToggleSub}
                    style={{
                      background: isSubscribed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      border: isSubscribed ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                      color: isSubscribed ? '#4ADE80' : 'rgba(255,255,255,0.6)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isSubscribed ? <Bell size={12} /> : <BellOff size={12} />}
                    {isSubscribed ? 'EN VIVO' : 'PAUSADO'}
                  </button>
                  <button 
                    onClick={handleToggleSound}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.8)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isSoundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                    {isSoundEnabled ? 'AUDIO ON' : 'SILENCIADO'}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={generateSimulatedAlert}
                    disabled={!isSubscribed}
                    style={{
                      backgroundColor: 'rgba(214, 175, 55, 0.1)',
                      border: '1px solid rgba(214, 175, 55, 0.3)',
                      color: '#D4AF37',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: 800,
                      cursor: isSubscribed ? 'pointer' : 'not-allowed',
                      opacity: isSubscribed ? 1 : 0.4
                    }}
                  >
                    SIMULAR
                  </button>
                  <button
                    onClick={handleClearAll}
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#EF4444',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Notification Logs List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }} className="no-scrollbar">
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.3 }}>
                    <BellOff size={40} style={{ margin: '0 auto 15px' }} />
                    <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Sin Alertas de Stock
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        style={{
                          padding: '20px',
                          borderRadius: '16px',
                          backgroundColor: notif.severity === 'critical' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                          border: notif.severity === 'critical' 
                            ? '1px solid rgba(239, 68, 68, 0.2)' 
                            : '1px solid rgba(255, 255, 255, 0.05)',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <span style={{
                            fontSize: '8px',
                            fontWeight: 900,
                            padding: '4px 8px',
                            borderRadius: '100px',
                            backgroundColor: notif.severity === 'critical' ? '#EF4444' : 'rgba(255,255,255,0.1)',
                            color: notif.severity === 'critical' ? 'white' : 'white',
                            textTransform: 'uppercase'
                          }}>
                            {notif.severity === 'critical' ? 'CRÍTICO' : 'ALERTA'}
                          </span>
                          <span style={{ fontSize: '9px', opacity: 0.4 }}>
                            {new Date(notif.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '12px', fontWeight: 800, margin: '0 0 5px', color: notif.severity === 'critical' ? '#FCA5A5' : 'white' }}>
                          {notif.materialName}
                        </h4>
                        <p style={{ fontSize: '10px', opacity: 0.5, margin: '0 0 10px', fontWeight: 600 }}>
                          📍 {notif.location}
                        </p>
                        <p style={{ fontSize: '11px', opacity: 0.8, margin: '0 0 15px', lineHeight: 1.4 }}>
                          {notif.message}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                          <AlertTriangle className={`w-3.5 h-3.5 ${notif.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'}`} />
                          <span style={{ fontSize: '10px', fontWeight: 800 }}>
                            Stock Actual: <strong style={{ color: notif.severity === 'critical' ? '#F87171' : '#FBBF24', fontSize: '11px' }}>{notif.stockLeft} {notif.unit}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer Status */}
              <div style={{ padding: '20px 30px', backgroundColor: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '9px', opacity: 0.5 }}>
                <ShieldCheck size={12} className="text-green-500" />
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Servidor Hostinger B2B Sincronizado • Zona Franca Chile
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔔 PUSH TOAST ELEMENT */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 15 }}
            style={{
              position: 'fixed',
              bottom: '105px',
              left: '30px',
              zIndex: 9500,
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#0E1F33',
              border: showToast.severity === 'critical' ? '2px solid #EF4444' : '2px solid #D4AF37',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              color: 'white'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle className={`w-4 h-4 ${showToast.severity === 'critical' ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`} />
                <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: showToast.severity === 'critical' ? '#EF4444' : '#D4AF37' }}>
                  {showToast.severity === 'critical' ? 'STOCK CRÍTICO DETECTADO' : 'ALERTA DE STOCK'}
                </span>
              </div>
              <button 
                onClick={() => setShowToast(null)}
                style={{ background: 'none', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            </div>
            <h4 style={{ fontSize: '13px', fontWeight: 900, margin: '0 0 5px' }}>
              {showToast.materialName}
            </h4>
            <p style={{ fontSize: '10px', opacity: 0.5, margin: '0 0 10px', fontWeight: 700 }}>
              📍 {showToast.location}
            </p>
            <p style={{ fontSize: '11px', opacity: 0.8, margin: '0 0 15px', lineHeight: 1.4 }}>
              Quedan únicamente <strong>{showToast.stockLeft} {showToast.unit}</strong> en bodega.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setIsOpen(true);
                  setShowToast(null);
                  handleMarkAllRead();
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                ABRIR PANEL
              </button>
              <button
                onClick={() => setShowToast(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: showToast.severity === 'critical' ? '#EF4444' : '#D4AF37',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'black',
                  fontSize: '10px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                ENTENDIDO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
