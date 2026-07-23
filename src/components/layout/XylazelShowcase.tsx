"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sun, CloudRain, Sparkles, Award } from "lucide-react";

export default function XylazelShowcase() {
  return (
    <section 
      id="xylazel-showcase"
      style={{
        width: "100%",
        padding: "80px 5%",
        maxWidth: "1400px",
        margin: "40px auto 60px auto",
        position: "relative",
        borderRadius: "28px",
        overflow: "hidden",
        backgroundColor: "#16110D", // Warm dark wood base
        backgroundImage: `
          radial-gradient(ellipse at 80% 20%, rgba(212, 140, 55, 0.15) 0%, transparent 60%),
          radial-gradient(ellipse at 20% 80%, rgba(14, 31, 51, 0.85) 0%, transparent 70%),
          repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.015) 0px,
            rgba(255, 255, 255, 0.015) 2px,
            transparent 2px,
            transparent 8px
          ),
          linear-gradient(135deg, #1C1510 0%, #0E1F33 60%, #0A1422 100%)
        `,
        boxShadow: "0 30px 60px -15px rgba(14, 31, 51, 0.5), inset 0 0 80px rgba(0,0,0,0.6)",
        border: "1px solid rgba(212, 175, 55, 0.2)",
      }}
    >
      {/* Warm Golden / Amber Wood Grain Glow */}
      <div 
        style={{
          position: "absolute",
          top: "-25%",
          right: "-15%",
          width: "650px",
          height: "650px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 140, 55, 0.22) 0%, rgba(14, 31, 51, 0) 70%)",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />
      <div 
        style={{
          position: "absolute",
          bottom: "-25%",
          left: "-15%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(160, 90, 30, 0.18) 0%, rgba(14, 31, 51, 0) 70%)",
          pointerEvents: "none",
          filter: "blur(50px)",
        }}
      />

      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "50px",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left Column: Text & Value Propositions inside a Glassmorphism Card */}
        <div 
          style={{ 
            color: "#FFFFFF",
            padding: "36px 32px",
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
          }}
        >
          <div 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "8px", 
              backgroundColor: "rgba(212, 175, 55, 0.15)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              padding: "6px 14px",
              borderRadius: "20px",
              marginBottom: "20px"
            }}
          >
            <Sparkles size={14} style={{ color: "var(--primary-gold, #D4AF37)" }} />
            <span 
              style={{ 
                color: "var(--primary-gold, #D4AF37)", 
                fontSize: "11px", 
                fontWeight: 800, 
                letterSpacing: "0.2em", 
                textTransform: "uppercase" 
              }}
            >
              Nuevos Barnices y Lasures Xylazel
            </span>
          </div>

          <h2 
            style={{ 
              fontSize: "clamp(2.2rem, 4vw, 3.4rem)", 
              fontWeight: 900, 
              textTransform: "uppercase", 
              lineHeight: 1.05, 
              color: "#FFFFFF",
              marginBottom: "20px",
              letterSpacing: "-0.02em"
            }}
          >
            Protege lo que <br />
            <span style={{ color: "var(--primary-gold, #D4AF37)" }}>construyes.</span>
          </h2>

          <p 
            style={{ 
              fontSize: "1.05rem", 
              lineHeight: 1.6, 
              color: "rgba(255, 255, 255, 0.85)", 
              marginBottom: "35px",
              maxWidth: "500px" 
            }}
          >
            Máxima protección y belleza para la madera en interiores y exteriores. Fórmula de alta resistencia contra el sol, la lluvia y los cambios drásticos de temperatura.
          </p>

          {/* Features Grid */}
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(2, 1fr)", 
              gap: "20px", 
              marginBottom: "40px" 
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", padding: "10px", borderRadius: "10px" }}>
                <Sun size={20} style={{ color: "var(--primary-gold, #D4AF37)" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#FFF", margin: 0 }}>Filtros UV</h4>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: "4px 0 0 0" }}>Protección contra el sol</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", padding: "10px", borderRadius: "10px" }}>
                <CloudRain size={20} style={{ color: "var(--primary-gold, #D4AF37)" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#FFF", margin: 0 }}>Resistente Intemperie</h4>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: "4px 0 0 0" }}>Lluvia y humedad</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", padding: "10px", borderRadius: "10px" }}>
                <Award size={20} style={{ color: "var(--primary-gold, #D4AF37)" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#FFF", margin: 0 }}>Acabados Pro</h4>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: "4px 0 0 0" }}>Satinado de alta calidad</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", padding: "10px", borderRadius: "10px" }}>
                <ShieldCheck size={20} style={{ color: "var(--primary-gold, #D4AF37)" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#FFF", margin: 0 }}>Máxima Durabilidad</h4>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: "4px 0 0 0" }}>Belleza duradera</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/tienda?search=xylazel"
            className="hover:scale-[1.04] transition-all duration-300"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              color: "#0E1F33",
              backgroundColor: "#FFD700", // Amarillo vibrante/intenso
              padding: "18px 36px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              boxShadow: "0 10px 25px rgba(255, 215, 0, 0.4)",
            }}
          >
            Ven a conocerlos a la tienda
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Right Column: Promotional Image Banner with Glassmorphism */}
        <div 
          style={{ 
            position: "relative",
            borderRadius: "20px",
            padding: "12px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 30px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            overflow: "hidden",
            transition: "transform 0.4s ease, box-shadow 0.4s ease",
          }}
          className="hover:scale-[1.02]"
        >
          <img 
            src="/images/bffc1d7f-100f-4d97-9d5a-6cd9b4550854.webp" 
            alt="Nuevos Barnices Xylazel - Comercial de la Patagonia"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        </div>
      </div>
    </section>
  );
}
