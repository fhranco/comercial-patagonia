"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Grid, ShieldCheck, Sparkles, ArrowRight, Droplets, Snowflake } from "lucide-react";
import Link from "next/link";

export default function CeramicsFeatured() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Shimmering ambient particle system (Logo Blue #2161a8 and Light Blue dust)
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

    class SparkleParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      decay: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedY = -(Math.random() * 0.25 + 0.05);
        this.x += this.speedX = Math.random() * 0.2 - 0.1;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.decay = Math.random() * 0.002 + 0.0005;
        // 70% Logo Blue particles, 30% Ice Blue particles
        this.color = Math.random() > 0.3 
          ? "33, 97, 168"   // exact Logo Blue #2161a8 in decimal RGB
          : "138, 180, 248"; // Light Ice Blue (#8AB4F8)
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.alpha -= this.decay;
        if (this.y < -10 || this.alpha <= 0) {
          this.y = height + 10;
          this.x = Math.random() * width;
          this.alpha = Math.random() * 0.5 + 0.2;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    const particles: SparkleParticle[] = Array.from({ length: 40 }, () => new SparkleParticle());

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
    <section 
      style={{ 
        padding: "160px 5% 150px", 
        background: "linear-gradient(135deg, #070E17 0%, #0E1F33 50%, #04080F 100%)", 
        color: "#FFFFFF", 
        position: "relative", 
        overflow: "hidden",
        borderTop: "1px solid rgba(255, 255, 255, 0.03)",
        borderBottom: "4px solid var(--brand-blue)" // Blue Logo border
      }}
    >
      {/* CSS local variables and styles for glassmorphism hover */}
      <style jsx global>{`
        @keyframes blue-subtle-pulse {
          0% { box-shadow: 0 0 15px rgba(33, 97, 168, 0.2); }
          50% { box-shadow: 0 0 30px rgba(33, 97, 168, 0.5); }
          100% { box-shadow: 0 0 15px rgba(33, 97, 168, 0.2); }
        }
        .ceramics-blue-pulse-btn {
          background: linear-gradient(90deg, var(--brand-blue) 0%, #2b7bd6 100%) !important;
          color: #FFFFFF !important;
          font-weight: 950 !important;
          animation: blue-subtle-pulse 3s infinite;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .ceramics-blue-pulse-btn:hover {
          transform: scale(1.03) translateY(-2px) !important;
          box-shadow: 0 12px 35px rgba(33, 97, 168, 0.5) !important;
          background: linear-gradient(90deg, #2b7bd6 0%, var(--brand-blue) 100%) !important;
        }
        .ceramics-glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-left: 3px solid rgba(255, 255, 255, 0.15);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ceramics-glass-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.05);
          border-left: 3px solid var(--brand-blue); // Logo Blue border on hover
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
        }
        .ceramics-image-hover {
          transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1), filter 1.5s ease;
        }
        .ceramics-image-hover-wrapper:hover .ceramics-image-hover {
          transform: scale(1.04);
          filter: brightness(1.05) contrast(1.02);
        }
      `}</style>

      {/* Background Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      {/* Soft Logo Blue Ambient Glow */}
      <div 
        style={{
          position: "absolute",
          top: "40%",
          left: "20%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "80%",
          background: "radial-gradient(circle, rgba(33, 97, 168, 0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 2
        }} 
      />

      <div 
        style={{ 
          maxWidth: "1400px", 
          margin: "0 auto", 
          position: "relative",
          zIndex: 5,
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(45%, 1fr))", 
          gap: "80px", 
          alignItems: "center" 
        }}
      >
        
        {/* 🏔️ PRODUCT VISUAL (IMAGE LEFT) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, x: -50 }} 
          whileInView={{ opacity: 1, scale: 1, x: 0 }} 
          transition={{ duration: 1.2, type: "spring", stiffness: 40 }} 
          viewport={{ once: true }} 
          style={{ position: "relative" }}
        >
          {/* Accent Blue Offset Frame */}
          <div 
            style={{ 
              position: "absolute", 
              inset: "-15px", 
              border: "2px solid var(--brand-blue)", // Logo Blue Offset Frame
              zIndex: 0, 
              transform: "translate(-15px, 15px)", 
              borderRadius: "28px",
              boxShadow: "0 0 30px rgba(33, 97, 168, 0.2)"
            }} 
          />

          {/* Main Image Container */}
          <div 
            style={{
              position: "relative",
              zIndex: 1,
              overflow: "hidden",
              borderRadius: "24px",
              boxShadow: "0 40px 90px rgba(0, 0, 0, 0.65)"
            }}
            className="ceramics-image-hover-wrapper"
          >
            <img 
              src="/images/especial-ceramicos.webp" 
              style={{ 
                width: "100%", 
                height: "auto",
                display: "block",
                objectFit: "cover"
              }} 
              className="ceramics-image-hover"
              alt="Especial de Cerámicos para Revestimiento y Piso" 
            />

            {/* Premium Badge Overlaid on the Image */}
            <div 
              style={{
                position: "absolute",
                top: "25px",
                right: "25px",
                backgroundColor: "rgba(14, 31, 51, 0.85)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(33, 97, 168, 0.3)",
                color: "var(--brand-blue)",
                padding: "8px 18px",
                borderRadius: "100px",
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
              }}
            >
              NUEVOS MODELOS
            </div>
          </div>
        </motion.div>

        {/* 📝 INFO & TECH SPECS (TEXT RIGHT) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1.2 }} 
          viewport={{ once: true }} 
        >
          {/* Campaign Sparkle Tag */}
          <div 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "8px", 
              padding: "8px 18px", 
              backgroundColor: "rgba(33, 97, 168, 0.08)", 
              border: "1px solid rgba(33, 97, 168, 0.2)", 
              borderRadius: "100px", 
              marginBottom: "35px" 
            }}
          >
            <Sparkles size={13} style={{ color: "var(--brand-blue)" }} />
            <span 
              style={{ 
                fontSize: "9px", 
                fontWeight: 900, 
                textTransform: "uppercase", 
                letterSpacing: "0.25em", 
                color: "var(--brand-blue)" 
              }}
            >
              Especial de Cerámicas
            </span>
          </div>

          <h2 
            style={{ 
              fontSize: "clamp(2.5rem, 5vw, 4.2rem)", 
              fontWeight: 950, 
              textTransform: "uppercase", 
              lineHeight: 0.95, 
              marginBottom: "30px", 
              color: "#FFFFFF", 
              letterSpacing: "-0.03em" 
            }}
          >
            REVESTIMIENTOS Y PISOS
            <br/>
            <span 
              style={{ 
                color: "#e5b000",
                display: "inline-block",
                marginTop: "5px"
              }}
            >
              CALIDAD PREMIUM
            </span>
          </h2>
          
          <p 
            style={{ 
              fontSize: "15px", 
              opacity: 0.85, 
              fontWeight: 400, 
              lineHeight: 1.65, 
              marginBottom: "45px",
              color: "#E2E8F0",
              maxWidth: "550px"
            }}
          >
            Arribaron nuevos modelos de cerámicas diseñados específicamente para responder a las exigencias de construcción del sur chileno. Diseños de vanguardia técnica y estética, con texturas de alto relieve, ideales para terminaciones residenciales y comerciales de alta duración.
          </p>
          
          {/* Tech specs 2x2 grid of Glassmorphic Cards */}
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
              gap: "20px", 
              marginBottom: "55px" 
            }}
          >
            <div 
              className="ceramics-glass-card"
              style={{ padding: "20px 22px", borderRadius: "12px" }}
            >
              <Grid size={22} style={{ color: "var(--brand-blue)", marginBottom: "12px" }} />
              <h5 style={{ fontSize: "11px", fontWeight: 950, textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.08em" }}>Tránsito Pesado (PEI 4+)</h5>
              <p style={{ fontSize: "13px", opacity: 0.7, fontWeight: 400, lineHeight: 1.45, color: "#CBD5E1" }}>Esmaltes con alta dureza para soportar flujo diario intenso.</p>
            </div>
            
            <div 
              className="ceramics-glass-card"
              style={{ padding: "20px 22px", borderRadius: "12px" }}
            >
              <ShieldCheck size={22} style={{ color: "var(--brand-blue)", marginBottom: "12px" }} />
              <h5 style={{ fontSize: "11px", fontWeight: 950, textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.08em" }}>Impermeabilidad Absoluta</h5>
              <p style={{ fontSize: "13px", opacity: 0.7, fontWeight: 400, lineHeight: 1.45, color: "#CBD5E1" }}>Superficies selladas que impiden la acumulación de suciedad.</p>
            </div>

            <div 
              className="ceramics-glass-card"
              style={{ padding: "20px 22px", borderRadius: "12px" }}
            >
              <Droplets size={22} style={{ color: "var(--brand-blue)", marginBottom: "12px" }} />
              <h5 style={{ fontSize: "11px", fontWeight: 950, textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.08em" }}>Adherencia Húmeda</h5>
              <p style={{ fontSize: "13px", opacity: 0.7, fontWeight: 400, lineHeight: 1.45, color: "#CBD5E1" }}>Máxima seguridad antideslizante para cocinas, baños y logias.</p>
            </div>

            <div 
              className="ceramics-glass-card"
              style={{ padding: "20px 22px", borderRadius: "12px" }}
            >
              <Snowflake size={22} style={{ color: "var(--brand-blue)", marginBottom: "12px" }} />
              <h5 style={{ fontSize: "11px", fontWeight: 950, textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.08em" }}>Resistencia al Frío</h5>
              <p style={{ fontSize: "13px", opacity: 0.7, fontWeight: 400, lineHeight: 1.45, color: "#CBD5E1" }}>Fórmula cerámica capaz de soportar bajas temperaturas australes.</p>
            </div>
          </div>

          {/* Pulsing Blue CTA Button */}
          <Link 
            href="/tienda?category=Cerámicas"
            style={{ 
              padding: "22px 55px", 
              borderRadius: "4px",
              fontSize: "11px", 
              fontWeight: 950, 
              textTransform: "uppercase", 
              letterSpacing: "0.25em", 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "14px",
              cursor: "pointer", 
              textDecoration: "none"
            }} 
            className="ceramics-blue-pulse-btn"
          >
            <span>Explorar Nuevos Modelos</span> 
            <ArrowRight size={14} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
