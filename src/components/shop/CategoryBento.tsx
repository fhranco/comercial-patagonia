"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "Construcción",
    num: "01",
    title: "Construcción",
    desc: "Suministro estratégico para obras civiles y edificación en Magallanes.",
    image: "/images/home-construccion.png",
  },
  {
    id: "Aislación",
    num: "02",
    title: "Aislantes",
    desc: "Eficiencia térmica de alto rendimiento para el clima patagónico.",
    image: "/images/home-aislante.png",
  },
  {
    id: "Binelli",
    num: "03",
    title: "Binelli",
    desc: "Calefacción de vanguardia y equipamiento premium para quinchos.",
    image: "/images/home-quincho.png",
  },
  {
    id: "Cerámicas",
    num: "04",
    title: "Cerámicas",
    desc: "Revestimientos técnicos y estéticos de estándar industrial.",
    image: "/images/home-ceramicas.png",
  },
  {
    id: "Cocina",
    num: "05",
    title: "Muebles de Cocina",
    desc: "Soluciones modulares y diseño funcional para espacios modernos.",
    image: "/images/home-cocina.png",
  },
  {
    id: "Cómodas",
    num: "06",
    title: "Muebles de Dormitorio",
    desc: "Sistemas de almacenamiento inteligente para proyectos residenciales.",
    image: "/images/home-closet.png",
  },
];

export default function CategoryGrid() {
  return (
    <section style={{ padding: '120px 5%', backgroundColor: '#FFF' }}>
      <style jsx>{`
        .category-card-responsive {
          --card-height: 600px;
        }
        .card-content {
          --card-padding: 50px;
          --num-size: 4.5rem;
        }
        @media (max-width: 768px) {
          .category-card-responsive {
            --card-height: 380px;
          }
          .card-content {
            --card-padding: 25px;
            --num-size: 3.2rem;
          }
        }
      `}</style>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* HEADER DE SECCIÓN */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px' }}>
          <div>
            <h2 style={{ 
              fontSize: '11px', 
              fontWeight: 900, 
              textTransform: 'uppercase', 
              letterSpacing: '0.4em', 
              color: 'var(--primary-gold)',
              marginBottom: '20px'
            }}>
              Portafolio de Soluciones
            </h2>
            <h3 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
              fontWeight: 900, 
              textTransform: 'uppercase',
              lineHeight: 0.9,
              color: '#000',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.04em'
            }}>
              SUMINISTRO <br/><span style={{ opacity: 0.2 }}>ESTRATEGICO</span>
            </h3>
          </div>
          <Link href="/shop" style={{ 
            color: '#000', 
            textDecoration: 'none', 
            fontSize: '11px', 
            fontWeight: 900, 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em',
            borderBottom: '2px solid var(--primary-gold)',
            paddingBottom: '10px'
          }} className="hover:opacity-60 transition">
            Ver Catálogo Completo
          </Link>
        </div>

        {/* 📐 GRID BENTO ELITE (3X2) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 1 }}
              style={{ 
                position: 'relative', 
                height: 'var(--card-height, 600px)', 
                overflow: 'hidden' 
              }}
              className="group category-card-responsive"
            >
              <Link href={`/shop?category=${cat.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {/* 🖼️ IMAGEN INDUSTRIAL DE ALTA GAMA */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }} className="group-hover:scale-105 transition-transform duration-[2000ms]">
                  <Image 
                    src={cat.image} 
                    alt={cat.title} 
                    fill 
                    style={{ objectFit: 'cover' }}
                  />
                  {/* Overlay Gradiente Editorial */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)' }} />
                </div>

                {/* 🏷️ CONTENIDO ESTRATÉGICO */}
                <div style={{ 
                  position: 'absolute', 
                  inset: 'var(--card-padding, 50px)', 
                  display: 'flex', flexDirection: 'column', 
                  justifyContent: 'space-between', zIndex: 10 
                }} className="card-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ 
                        fontSize: 'var(--num-size, 4.5rem)', 
                        fontWeight: 900, 
                        color: 'var(--primary-gold)', 
                        lineHeight: 0.8,
                        letterSpacing: '-0.05em'
                    }}>{cat.num}</span>
                    <div style={{ 
                      width: '50px', height: '50px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' 
                    }} className="group-hover:bg-[var(--primary-gold)] group-hover:border-[var(--primary-gold)] transition-all duration-500">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h4 style={{ 
                        color: '#FFF', 
                        fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', 
                        fontWeight: 900, 
                        textTransform: 'uppercase', 
                        lineHeight: 0.9, 
                        margin: '0 0 20px 0',
                        fontFamily: 'var(--font-heading)',
                        letterSpacing: '-0.04em'
                    }}>{cat.title}</h4>
                    <p style={{ 
                        color: 'rgba(255,255,255,0.5)', 
                        fontSize: '15px', 
                        maxWidth: '320px', 
                        lineHeight: 1.6,
                        fontWeight: 500 
                    }}>{cat.desc}</p>
                    <div style={{ marginTop: '30px', height: '3px', width: '40px', background: 'var(--primary-gold)', transition: 'width 0.8s ease-in-out' }} className="group-hover:w-full" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
