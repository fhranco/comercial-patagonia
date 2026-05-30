"use client";

import React, { useState, useEffect, useRef } from "react";
import { Flame, Clock, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function CyberdayCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [campaignState, setCampaignState] = useState<"upcoming" | "active" | "ended">("upcoming");
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Ticker items for Negocios hot deals
  const tickerItems = [
    "🔥 CYBERDAY PATAGONIA: HASTA 40% EN OBRAS COMPLETA",
    "🚛 ENVÍOS PREFERENCIALES DESDE PUNTA ARENAS A NATALES, PORVENIR Y TODA LA REGIÓN",
    "💰 PRECIOS NETOS DIRECTOS EN FACTURA DE NEGOCIOS DE AHORRO INMEDIATO",
    "🧱 CEMENTO COMODORO PCR-50 CON DESCUENTO MAYORISTA EXCLUSIVO",
    "🍳 LÍNEA DE COCINAS BINELLI Y MUEBLES PREMIUM HASTA 35% OFF",
    "❄️ MATERIALES DE AISLACIÓN TÉRMICA PRO CERTIFICADOS PARA CLIMA EXTREMO"
  ];

  useEffect(() => {
    setMounted(true);
    
    // Campaign dates (Time zone: Chile/Punta Arenas GMT-3)
    const startDate = new Date("2026-06-01T00:00:00-03:00").getTime();
    const endDate = new Date("2026-06-03T23:59:59-03:00").getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      
      let targetDate = startDate;
      if (now >= startDate && now <= endDate) {
        setCampaignState("active");
        targetDate = endDate;
      } else if (now > endDate) {
        setCampaignState("ended");
        clearInterval(timer);
        return;
      } else {
        setCampaignState("upcoming");
        targetDate = startDate;
      }

      const difference = targetDate - now;

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. High-Performance HTML Canvas Fire Storm Particle Engine
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle class
    class FireParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      color: string;
      alpha: number;
      decay: number;
      wobbleSpeed: number;
      wobble: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 20;
        this.size = Math.random() * 5 + 1.5;
        this.speedY = -(Math.random() * 1.5 + 0.5);
        this.speedX = Math.random() * 0.6 - 0.3;
        this.alpha = Math.random() * 0.8 + 0.2;
        this.decay = Math.random() * 0.008 + 0.003;
        this.wobbleSpeed = Math.random() * 0.05;
        this.wobble = Math.random() * Math.PI * 2;

        const isRed = Math.random() > 0.4;
        const stateActive = campaignState === "active";
        
        if (stateActive) {
          this.color = "255, 75, 75"; // Intense Red
        } else {
          this.color = "255, 215, 0"; // Metallic Gold
        }
      }

      update() {
        this.y += this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.3;
        this.alpha -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        const grad = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        grad.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
        grad.addColorStop(1, `rgba(${this.color}, 0)`);
        c.fillStyle = grad;
        c.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    const particles: FireParticle[] = [];
    const maxParticles = 60;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn particles
      if (particles.length < maxParticles && Math.random() < 0.4) {
        particles.push(new FireParticle());
      }

      // Update and draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.alpha <= 0 || p.y < -20) {
          particles.splice(i, 1);
        } else {
          p.draw(ctx);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [mounted, campaignState]);

  const handleScrollToBanner = (e: React.MouseEvent) => {
    e.preventDefault();
    const banner = document.getElementById("cyber-banner");
    if (banner) {
      banner.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!mounted || campaignState === "ended") return null;

  const isActive = campaignState === "active";

  return (
    <div 
      id="cyber-banner"
      style={{
        width: '100%',
        position: 'relative',
        zIndex: 9005,
        overflow: 'hidden',
        boxShadow: '0 25px 60px -15px rgba(14, 31, 51, 0.5)',
        fontFamily: 'var(--font-heading)',
        background: 'linear-gradient(135deg, #040A12 0%, #071220 50%, #0E1F33 100%)',
        padding: '65px 5% 0px',
        borderTop: '2px solid rgba(255, 255, 255, 0.03)',
        borderBottom: '3px solid rgba(212, 175, 55, 0.5)'
      }} 
      className="cyber-root-container"
    >
      
      {/* 🚀 CSS GLOBAL PARA EFECTOS CINEMATOGRÁFICOS */}
      <style jsx global>{`
        @keyframes cyber-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes laser-sweep {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.2; }
          50% { transform: scale(1.05); opacity: 0.6; }
          100% { transform: scale(0.95); opacity: 0.2; }
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float-fab {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-fab-gold {
          0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.4); }
          50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.4); }
          100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.4); }
        }
        @keyframes pulse-fab-red {
          0% { box-shadow: 0 0 10px rgba(255, 46, 46, 0.4); }
          50% { box-shadow: 0 0 25px rgba(255, 46, 46, 0.8), 0 0 35px rgba(255, 46, 46, 0.4); }
          100% { box-shadow: 0 0 10px rgba(255, 46, 46, 0.4); }
        }
        .cyber-root-container {
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.8), inset 0 0 50px rgba(14, 31, 51, 0.5);
        }
        .cyber-laser-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, ${isActive ? '#FF4B4B' : '#FFD700'}, transparent);
          box-shadow: 0 0 10px ${isActive ? '#FF4B4B' : '#FFD700'};
          opacity: 0.2;
          pointer-events: none;
          zIndex: 4;
          animation: laser-sweep 6s linear infinite;
        }
        .cyber-neon-card {
          background: rgba(14, 31, 51, 0.8);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 30px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.05);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          transform: perspective(800px) rotateX(10deg);
        }
        .cyber-neon-card:hover {
          transform: perspective(800px) rotateX(0deg) translateY(-6px);
          border-color: ${isActive ? '#FF4B4B' : '#FFD700'};
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px ${isActive ? 'rgba(255, 75, 75, 0.4)' : 'rgba(255, 215, 0, 0.4)'};
        }
        .cyber-glow-badge {
          animation: pulse-ring 2s infinite ease-in-out;
        }
        .cyber-gold-shimmer {
          background: linear-gradient(90deg, #FFD700 0%, #FFE600 25%, #FFFF00 50%, #FFE600 75%, #FFD700 100%) !important;
          background-size: 200% auto !important;
          color: #000000 !important;
          font-weight: 950 !important;
          animation: cyber-shimmer 3s linear infinite !important;
          box-shadow: 0 0 20px rgba(255, 230, 0, 0.5) !important;
        }
        .cyber-red-shimmer {
          background: linear-gradient(90deg, #FF2E2E 0%, #FF5C5C 25%, #FF8E8E 50%, #FF5C5C 75%, #FF2E2E 100%) !important;
          background-size: 200% auto !important;
          color: #FFFFFF !important;
          font-weight: 950 !important;
          animation: cyber-shimmer 3s linear infinite !important;
          box-shadow: 0 0 20px rgba(255, 46, 46, 0.5) !important;
        }
        .marquee-wrapper {
          display: flex;
          overflow: hidden;
          white-space: nowrap;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 14px 0;
          background: rgba(0, 0, 0, 0.3);
          margin-top: 45px;
        }
        .marquee-content {
          display: inline-flex;
          animation: marquee-scroll 25s linear infinite;
          gap: 50px;
        }
        .cyber-fab {
          position: fixed;
          top: 50%;
          right: 0px;
          transform: translateY(-50%);
          z-index: 8999;
          background: rgba(7, 18, 32, 0.95);
          backdrop-filter: blur(15px);
          border-left: 3px solid ${isActive ? '#FF2E2E' : '#FFD700'};
          border-top: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          border-right: none;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
          padding: 20px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          box-shadow: -10px 10px 30px rgba(0,0,0,0.5);
          animation: pulse-fab-${isActive ? 'red' : 'gold'} 2s infinite ease-in-out;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          color: #FFFFFF !important;
          text-decoration: none !important;
          width: 58px;
        }
        .cyber-fab:hover {
          transform: scale(1.08) translateY(-50%) translateX(-4px);
          background: ${isActive ? '#FF2E2E' : '#FFD700'} !important;
          color: #000000 !important;
        }
        .cyber-fab:hover .cyber-fab-icon {
          color: #000000 !important;
        }
        .cyber-fab:hover .cyber-fab-title {
          color: #000000 !important;
        }
        .cyber-fab:hover .cyber-fab-subtitle {
          color: #000000 !important;
        }
      `}</style>

      {/* 🎆 HIGH PERFORMANCE CANVAS PARTICLES */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 3
        }}
      />

      {/* 🚨 LASER SWEEP LINE */}
      <div className="cyber-laser-line" />

      {/* 🌋 AMBIENT BACKGLOWS */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        height: '120%',
        background: isActive 
          ? 'radial-gradient(circle, rgba(255, 50, 50, 0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* 🧊 CONTENT HUD GRID */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '30px',
          paddingBottom: '10px'
        }}>
          
          {/* 🏷️ CAMPAIGN TITLE HUD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              
              {isActive ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FF2E2E',
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '9px',
                  fontWeight: 950,
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  boxShadow: '0 0 20px rgba(255, 46, 46, 0.6)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Flame size={12} className="animate-bounce" />
                  EVENTO EN VIVO
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#0A1220',
                  color: '#D4AF37',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '9px',
                  fontWeight: 950,
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  border: '1px solid rgba(212,175,55,0.5)',
                  boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)'
                }}>
                  <Zap size={11} className="cyber-glow-badge" style={{ color: '#D4AF37' }} />
                  CYBER APERTURA
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.95)', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                <ShieldCheck size={12} style={{ color: isActive ? '#FF4B4B' : '#D4AF37' }} />
                DISTRIBUIDOR AUTORIZADO
              </div>
            </div>

            <h2 style={{
              fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
              fontWeight: 1000,
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              margin: 0,
              background: isActive 
                ? 'linear-gradient(135deg, #FFF 0%, #FFA8A8 50%, #FF4B4B 100%)'
                : 'linear-gradient(135deg, #FFF 0%, #FFF3B0 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: isActive ? '0 0 30px rgba(255,75,75,0.25)' : '0 0 30px rgba(212,175,55,0.2)'
            }}>
              {isActive ? "CYBER APERTURA MAYORISTA:" : "DESCUENTOS CYBER PATAGONIA"}
              <br/>
              <span style={{ fontSize: '70%', color: isActive ? '#FF5C5C' : '#FFD700', WebkitTextFillColor: 'initial', textShadow: 'none', fontWeight: 900 }}>
                {isActive ? "🔥 ¡COMPRA AHORA HASTA 40% DCTO!" : "⏱️ 01, 02 y 03 de Junio de 2026"}
              </span>
            </h2>

            <p style={{
              fontSize: '13px',
              color: '#F1F5F9',
              fontWeight: 400,
              margin: 0,
              maxWidth: '550px',
              lineHeight: 1.5
            }}>
              {isActive 
                ? "Precios rebajados en Cemento Comodoro, cocinas premium, revestimientos y aislación durante este 01, 02 y 03 de Junio de 2026. Despacho coordinado en obra."
                : "Tarifas especiales preferenciales para constructoras, contratistas y clientes de Negocios vigentes este 01, 02 y 03 de Junio de 2026. Apertura Lunes a las 00:00:00."}
            </p>
          </div>

          {/* ⏰ STEREOSCOPIC 3D TIMING HUD */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
                <Clock size={12} style={{ color: isActive ? '#FF5C5C' : '#FFD700' }} />
                <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em' }}>
                  {isActive ? "TIEMPO LÍMITE DE OFERTAS" : "CUENTA REGRESIVA CYBER"}
                </span>
              </div>

              {/* TIMING CARDS */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {timeLeft.days > 0 && (
                  <>
                    <div style={{ padding: '12px 16px', borderRadius: '4px', minWidth: '55px', textAlign: 'center' }} className="cyber-neon-card">
                      <span style={{ fontSize: '22px', fontWeight: 1000, display: 'block', color: '#FFF', letterSpacing: '-0.02em', lineHeight: 1 }}>{timeLeft.days}</span>
                      <span style={{ fontSize: '7px', fontWeight: 950, color: 'var(--primary-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px', display: 'block' }}>Días</span>
                    </div>
                    <span style={{ opacity: 0.8, fontWeight: 1000, fontSize: '22px', color: isActive ? '#FF5C5C' : '#FFD700' }}>:</span>
                  </>
                )}

                <div style={{ padding: '12px 16px', borderRadius: '4px', minWidth: '55px', textAlign: 'center' }} className="cyber-neon-card">
                  <span style={{ fontSize: '22px', fontWeight: 1000, display: 'block', color: '#FFF', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '7px', fontWeight: 950, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px', display: 'block' }}>Horas</span>
                </div>

                <span style={{ opacity: 0.8, fontWeight: 1000, fontSize: '22px', color: isActive ? '#FF5C5C' : '#FFD700' }}>:</span>

                <div style={{ padding: '12px 16px', borderRadius: '4px', minWidth: '55px', textAlign: 'center' }} className="cyber-neon-card">
                  <span style={{ fontSize: '22px', fontWeight: 1000, display: 'block', color: '#FFF', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '7px', fontWeight: 950, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px', display: 'block' }}>Mins</span>
                </div>

                <span style={{ opacity: 0.8, fontWeight: 1000, fontSize: '22px', color: isActive ? '#FF5C5C' : '#FFD700' }}>:</span>

                <div style={{ padding: '12px 16px', borderRadius: '4px', minWidth: '55px', textAlign: 'center' }} className="cyber-neon-card">
                  <span style={{ fontSize: '22px', fontWeight: 1000, display: 'block', color: isActive ? '#FF2E2E' : 'var(--primary-gold)', textShadow: isActive ? '0 0 10px rgba(255,46,46,0.5)' : '0 0 10px rgba(212,175,55,0.5)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '7px', fontWeight: 950, color: isActive ? '#FF5C5C' : 'var(--primary-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px', display: 'block' }}>Segs</span>
                </div>
              </div>
            </div>

            {/* 🔘 ACTIVE SHIMMER ACTION BUTTON */}
            <Link href="/shop?category=cyberday" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '20px 42px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 950,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#000000',
              boxShadow: isActive ? '0 20px 40px rgba(255, 46, 46, 0.4)' : '0 20px 40px rgba(212, 175, 55, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)'
            }} className={isActive ? "cyber-red-shimmer hover:scale-[1.03] active:scale-95 transition-all" : "cyber-gold-shimmer hover:scale-[1.03] active:scale-95 transition-all"}>
              <span>{isActive ? "ADQUIRIR DESCUENTOS" : "ACCEDER PRE-VENTA"}</span>
              <ArrowRight size={14} />
            </Link>

          </div>

        </div>

      </div>

      {/* 🚀 HIGH-INTENSITY LIVE TICKER MARQUEE */}
      <div className="marquee-wrapper">
        <div className="marquee-content">
          {/* Double content for infinite loop */}
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '10px',
                fontWeight: 900,
                color: idx % 2 === 0 ? (isActive ? '#FF4B4B' : 'var(--primary-gold)') : '#FFF',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Zap size={10} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 🚨 SPECTACULAR FLOATING ACTION BUTTON (FAB) */}
      <a 
        href="#cyber-banner" 
        onClick={handleScrollToBanner}
        className="cyber-fab"
      >
        <Flame size={20} className="cyber-fab-icon animate-bounce" style={{ color: isActive ? '#FF2E2E' : '#FFD700' }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '9px', fontWeight: 1000, color: isActive ? '#FF2E2E' : '#FFD700', letterSpacing: '0.05em' }} className="cyber-fab-title">CYBER</span>
          <span style={{ fontSize: '9px', fontWeight: 1000, color: '#FFFFFF', letterSpacing: '0.05em' }} className="cyber-fab-subtitle">DAY</span>
        </div>
      </a>

    </div>
  );
}
