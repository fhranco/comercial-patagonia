"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function JuneSpecialBanner() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Soft shimmering background particle system
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

    class GoldParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      decay: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.8;
        this.speedY = -(Math.random() * 0.3 + 0.1);
        this.speedX = Math.random() * 0.2 - 0.1;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.decay = Math.random() * 0.003 + 0.001;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.alpha -= this.decay;
        if (this.y < -10 || this.alpha <= 0) {
          this.y = height + 10;
          this.x = Math.random() * width;
          this.alpha = Math.random() * 0.6 + 0.2;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.fillStyle = `rgba(212, 175, 55, ${this.alpha})`; // Gold particles
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    const particles: GoldParticle[] = Array.from({ length: 25 }, () => new GoldParticle());

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div 
      id="june-special-banner"
      style={{
        width: '100%',
        position: 'relative',
        zIndex: 9005,
        overflow: 'hidden',
        boxShadow: '0 25px 60px -15px rgba(14, 31, 51, 0.4)',
        fontFamily: 'var(--font-heading)',
        background: 'linear-gradient(135deg, #020813 0%, #061122 50%, #0c1c34 100%)',
        padding: '60px 5% 55px',
        borderTop: '1px solid rgba(255, 255, 255, 0.02)',
        borderBottom: '3px solid #D4AF37'
      }}
    >
      
      {/* 🚀 CSS GLOBAL PARA EFECTOS Y RESPONSIVIDAD */}
      <style jsx global>{`
        @keyframes gold-glow-pulse {
          0% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.2); }
          50% { box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
          100% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.2); }
        }
        .june-gold-btn {
          background: linear-gradient(90deg, #D4AF37 0%, #F9C300 100%) !important;
          color: #000000 !important;
          font-weight: 950 !important;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.3) !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .june-gold-btn:hover {
          transform: scale(1.03) translateY(-2px) !important;
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.5) !important;
        }
        .june-glass-card {
          background: rgba(14, 31, 51, 0.65);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          border-left: 3px solid #D4AF37;
        }
      `}</style>

      {/* Canvas for gold particle shimmer */}
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

      {/* Ambient Radial Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        height: '130%',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '40px'
      }}>
        
        {/* Left column: Text details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: '1 1 600px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              color: '#D4AF37',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '9px',
              fontWeight: 950,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              border: '1px solid rgba(212, 175, 55, 0.4)'
            }}>
              <Sparkles size={11} className="animate-spin" style={{ animationDuration: '4s' }} />
              Especial de Junio
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              <ShieldCheck size={12} style={{ color: '#D4AF37' }} />
              Línea de Muebles Importados
            </div>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            fontWeight: 1000,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            margin: 0,
            color: '#FFFFFF'
          }}>
            RENOVACIÓN Y DISEÑO ZANZINI
            <br/>
            <span style={{ 
              fontSize: '70%', 
              color: '#D4AF37', 
              fontWeight: 900,
              display: 'inline-block',
              marginTop: '10px',
              letterSpacing: '0.05em'
            }}>
              ✨ CÓMODAS, ZAPATERAS Y ARMARIOS PREMIUM RECIÉN LLEGADOS
            </span>
          </h2>

          <p style={{
            fontSize: '14px',
            color: '#E2E8F0',
            fontWeight: 400,
            margin: 0,
            maxWidth: '650px',
            lineHeight: 1.6
          }}>
            Dale un toque de elegancia y orden a tu hogar con la nueva colección de muebles Zanzini. Fabricados con estándares internacionales de durabilidad, diseño sofisticado y terminaciones finas. Todo con despacho local inmediato en Punta Arenas y la región de Magallanes.
          </p>
        </div>

        {/* Right column: Action call card */}
        <div 
          className="june-glass-card"
          style={{
            flex: '1 1 350px',
            padding: '30px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '9px', fontWeight: 900, color: '#D4AF37', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Nueva Importación
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              COLECCIÓN COMPLETA
            </h3>
          </div>
          
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>
            Explora las unidades disponibles para armados rápidos, con perchero metálico, cajones telescópicos y divisiones especiales.
          </p>

          <Link 
            href="/tienda?category=Zanzini" 
            className="june-gold-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '16px 30px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 950,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <span>Ver Catálogo Zanzini</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

    </div>
  );
}
