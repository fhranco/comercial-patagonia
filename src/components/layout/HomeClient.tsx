"use client";

import React from "react";
import styles from "../../app/page.module.css";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Navigation from "./Navigation";
import HeroSpectacular from "./HeroComodoro";
import CategoryBento from "../shop/CategoryBento";
import TrustBar from "./TrustBar";
import FeaturedCarousel from "../shop/FeaturedCarousel";
import CyberFeaturedGrid from "../shop/CyberFeaturedGrid";
import CyberCarousel from "../shop/CyberCarousel";
import CyberMarquee from "./CyberMarquee";
import JuneMarquee from "./JuneMarquee";
import JuneSpecialBanner from "./JuneSpecialBanner";
import XylazelShowcase from "./XylazelShowcase";
import FurnitureShowcase from "./FurnitureShowcase";
import GrandCement from "./GrandCement";
import CeramicsFeatured from "./CeramicsFeatured";
import { Product } from "@/types/woocommerce";
import Link from "next/link";
import PromotionHUD from "../shop/PromotionHUD";
import RetailStories from "../shop/RetailStories";
import ProductQuickView from "../shop/ProductQuickView";
import CyberdayCountdown from "./CyberdayCountdown";
import { ArrowRight, X } from "lucide-react";
import { CAMPAIGN_CONFIG } from "@/lib/constants";

interface HomeClientProps {
  products: Product[];
}

export default function HomeClient({ products }: HomeClientProps) {
  const router = useRouter();
  const [selectedQuickProduct, setSelectedQuickProduct] = React.useState<Product | null>(null);
  const [isMarqueeOpen, setIsMarqueeOpen] = React.useState(CAMPAIGN_CONFIG.isCyberActive || CAMPAIGN_CONFIG.activeCampaign === "zanzini_june");
  const [showPromoPopup, setShowPromoPopup] = React.useState(false);

  React.useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenPlanchetaPromo");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowPromoPopup(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPromoPopup(false);
    sessionStorage.setItem("hasSeenPlanchetaPromo", "true");
  };

  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const cyberProductsAll = CAMPAIGN_CONFIG.isCyberActive 
    ? products.filter(p => 
        p.categories.some(cat => cat.slug.toLowerCase() === "cybermonday" || cat.slug.toLowerCase() === "cyberday")
      )
    : (CAMPAIGN_CONFIG.activeCampaign === "zanzini_june"
      ? products.filter(p => 
          p.categories.some(cat => cat.slug.toLowerCase() === "zanzini-marca" || cat.slug.toLowerCase() === "zanzini")
        )
      : []);
  const SHOP_URL = "/tienda";

  return (
    <div className={styles.page} style={{ backgroundColor: '#FFFFFF', color: 'var(--brand-navy)', minHeight: '100vh', width: '100%' }}>
      
      {/* 🚀 BARRA DE PROGRESO */}
      <motion.div style={{ scaleX: scaleProgress, position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'var(--primary-gold)', zIndex: 9999, transformOrigin: '0%' }} />

      {isMarqueeOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10000 }}>
          {CAMPAIGN_CONFIG.isCyberActive ? (
            <CyberMarquee onClose={() => setIsMarqueeOpen(false)} />
          ) : (
            <JuneMarquee onClose={() => setIsMarqueeOpen(false)} />
          )}
        </div>
      )}

      {/* Override navigation top position if marquee is open & responsive styling */}
      <style jsx global>{`
        .nav-container {
          top: ${isMarqueeOpen ? '40px' : '0px'} !important;
          transition: top 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        @media (max-width: 1024px) {
          .heritage-section { padding: 80px 5% !important; }
          .heritage-grid { gap: 50px !important; }
        }
        @media (max-width: 768px) {
          .heritage-section { padding: 60px 5% !important; }
        }
      `}</style>

      <Navigation transparent={true} />
      <PromotionHUD products={products} onQuickView={(prod) => setSelectedQuickProduct(prod)} />
      
      <main style={{ width: '100%', paddingTop: isMarqueeOpen ? '40px' : '0px', transition: 'padding-top 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <HeroSpectacular 
          products={products} 
          onQuickView={(prod) => setSelectedQuickProduct(prod)} 
        />
        <CeramicsFeatured />

        {/* 🎨 SECCIÓN DESTACADA BARNICES Y LASURES XYLAZEL */}
        <XylazelShowcase />

        {/* 🍳 PLANCHETTA FEATURED BANNER */}
        <section style={{ 
          padding: '80px 5%', 
          maxWidth: '1400px', 
          margin: '40px auto 60px auto', 
          backgroundColor: '#F4F7FA',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.02)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(33, 97, 168, 0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '60px', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Left Column: Text & CTA */}
            <div style={{ textAlign: 'left' }}>
              <span style={{ 
                color: 'var(--primary-gold)', 
                fontSize: '11px', 
                fontWeight: 900, 
                letterSpacing: '0.4em', 
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '15px'
              }}>
                Oportunidad Destacada
              </span>
              <h2 style={{ 
                fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                lineHeight: 1.0, 
                color: 'var(--brand-navy)',
                margin: '0 0 25px 0'
              }}>
                LA PLANCHETTA <br/>2 QUEMADORES
              </h2>
              <p style={{ 
                fontSize: '1rem', 
                lineHeight: 1.6, 
                opacity: 0.8, 
                marginBottom: '35px', 
                maxWidth: '450px',
                color: 'var(--brand-navy)'
              }}>
                Chapa de hierro laminado en caliente de 2.5 mm de espesor, diseñada para cocinar carnes, hamburguesas y vegetales. Incluye dos tapas de acero inoxidable con mangos de madera.
              </p>

              {/* Price display inside banner */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '40px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--brand-navy)' }}>
                  $34.000
                </span>
                <span style={{ fontSize: '1.2rem', opacity: 0.3, textDecoration: 'line-through' }}>
                  $43.000
                </span>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 900, 
                  color: 'var(--brand-navy)', 
                  backgroundColor: 'var(--primary-gold)', 
                  padding: '4px 8px', 
                  borderRadius: '4px'
                }}>
                  -21% OFF
                </span>
              </div>

              <div>
                <Link 
                  href="/tienda/plancheta" 
                  className="gold-shimmer hover:scale-[1.02] transform transition-transform" 
                  style={{ 
                    display: 'inline-block',
                    textDecoration: 'none', 
                    color: 'var(--brand-navy)', 
                    backgroundColor: 'var(--primary-gold)',
                    padding: '20px 45px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.15em', 
                    boxShadow: '0 10px 20px rgba(0,0,0,0.05)' 
                  }}
                >
                  Ver Ficha y Comprar
                </Link>
              </div>
            </div>
            
            {/* Right Column: Image */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                width: '80%',
                height: '80%',
                backgroundColor: 'rgba(14, 31, 51, 0.02)',
                borderRadius: '50%',
                filter: 'blur(40px)',
                zIndex: 0,
                transform: 'translateY(20px)'
              }} />
              <img 
                src="/images/producto-la-planchetta.jpg" 
                style={{ 
                  width: '90%', 
                  maxHeight: '340px',
                  objectFit: 'contain',
                  borderRadius: '16px',
                  position: 'relative', 
                  zIndex: 1,
                  filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.08))'
                }} 
                alt="Planchetta Profesional" 
              />
            </div>
          </div>
        </section>

        {CAMPAIGN_CONFIG.isCyberActive && <CyberdayCountdown />}
        {CAMPAIGN_CONFIG.activeCampaign === "zanzini_june" && <JuneSpecialBanner />}

        {cyberProductsAll.length > 0 && (
          <>
            <CyberFeaturedGrid 
              products={cyberProductsAll} 
              onQuickView={(prod) => setSelectedQuickProduct(prod)}
              title={CAMPAIGN_CONFIG.activeCampaign === "zanzini_june" ? "SELECCIÓN DESTACADA ZANZINI" : undefined}
              subtitle={CAMPAIGN_CONFIG.activeCampaign === "zanzini_june" ? "RECIÉN LLEGADO JUNIO" : undefined}
              description={CAMPAIGN_CONFIG.activeCampaign === "zanzini_june" ? "Diseño sofisticado, estructuración reforzada y rieles telescópicos para tu organización." : undefined}
            />
            
            <CyberCarousel 
              products={cyberProductsAll} 
              onQuickView={(prod) => setSelectedQuickProduct(prod)}
              title={CAMPAIGN_CONFIG.activeCampaign === "zanzini_june" ? "MUEBLES ZANZINI COMPLETO" : undefined}
              subtitle={CAMPAIGN_CONFIG.activeCampaign === "zanzini_june" ? "CATÁLOGO TÉCNICO" : undefined}
            />

            {/* 🏷️ ACCESO A TODAS LAS OFERTAS CYBER / CAMPAIGN */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', marginBottom: '80px' }}>
              <Link 
                href={CAMPAIGN_CONFIG.activeCampaign === "zanzini_june" ? "/tienda?category=Zanzini" : "/tienda?category=cyberday"} 
                style={{ 
                  backgroundColor: '#0E1F33', 
                  border: '2px solid var(--primary-gold)',
                  color: '#FFFFFF',
                  padding: '20px 50px', 
                  borderRadius: '4px', 
                  fontSize: '11px', 
                  fontWeight: 950, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.2em', 
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 15px 35px rgba(14, 31, 51, 0.15)'
                }}
                className="hover:bg-[var(--primary-gold)] hover:text-black hover:border-[var(--primary-gold)] transition-all duration-300 active:scale-95"
              >
                <span>
                  {CAMPAIGN_CONFIG.activeCampaign === "zanzini_june" 
                    ? "Ver colección Zanzini" 
                    : "Ver todas las ofertas Cyber"}
                </span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}

        <div style={{ marginTop: '40px', marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
          <RetailStories 
              activeCategory="Todos" 
              onCategoryChange={(cat) => router.push(`/tienda?category=${cat}`)} 
          />
        </div>

        <FeaturedCarousel 
          products={products.length > 0 ? products : []} 
          onQuickView={(prod) => setSelectedQuickProduct(prod)}
        />
        <GrandCement onQuickView={(prod) => setSelectedQuickProduct(prod)} />
        <FurnitureShowcase />
        <CategoryBento />
        <TrustBar />

        {/* 🏢 HISTORIA Y TRADICIÓN */}
        <section style={{ padding: '120px 5%', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#FFF' }} className="heritage-section">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '100px', alignItems: 'center' }} className="heritage-grid">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
                    <span style={{ color: 'var(--primary-gold)', fontSize: '11px', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase' }}>Patrimonio Regional</span>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, textTransform: 'uppercase', margin: '20px 0', lineHeight: 0.9, color: 'var(--brand-navy)' }}>TRADICIÓN <br/>DESDE 1978.</h2>
                    <p style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.8, marginBottom: '40px', maxWidth: '350px' }}>
                        Casi cinco décadas forjando el comercio austral con equipamiento que resiste el fin del mundo.
                    </p>
                    <div>
                        <Link href={SHOP_URL} className="gold-shimmer" style={{ textDecoration: 'none', color: 'var(--brand-navy)', padding: '20px 45px', borderRadius: '4px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>Ver Catálogo Técnico</Link>
                    </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} viewport={{ once: true }} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: '20px', border: '1px solid var(--primary-gold)', zIndex: 0, transform: 'translate(10px, 10px)', borderRadius: '32px' }} />
                    <img src="/images/heritage.webp" style={{ width: '100%', borderRadius: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.15)', position: 'relative', zIndex: 1 }} alt="Tradición Comercial" />
                </motion.div>
            </div>
        </section>

        {/* 🏆 FRASE DE CIERRE */}
        <section style={{ padding: '150px 5%', textAlign: 'center', backgroundColor: '#FAFAFA' }}>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                SOLIDEZ QUE <br/><span style={{ color: 'var(--primary-gold)' }}>CONSTRUYE FUTURO.</span>
            </motion.h2>
            <div style={{ width: '150px', height: '2px', background: 'var(--primary-gold)', margin: '50px auto' }} />
            <Link href={SHOP_URL} style={{ color: 'var(--brand-navy)', textDecoration: 'none', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.3em', border: '2px solid var(--brand-navy)', padding: '20px 60px', borderRadius: '100px' }} className="hover:bg-[var(--brand-navy)] hover:text-white transition-all duration-500">Tienda Online Oficial</Link>
        </section>
      </main>

      <ProductQuickView 
        product={selectedQuickProduct} 
        isOpen={!!selectedQuickProduct} 
        onClose={() => setSelectedQuickProduct(null)} 
      />

      <AnimatePresence>
        {showPromoPopup && (
          <div 
            style={{ 
              position: 'fixed', inset: 0, zIndex: 100000, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              padding: '20px', backgroundColor: 'rgba(14, 31, 51, 0.85)', 
              backdropFilter: 'blur(15px)' 
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                position: 'relative', width: '100%', maxWidth: '550px',
                backgroundColor: '#FFFFFF', borderRadius: '8px', overflow: 'hidden',
                boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
                border: '1px solid rgba(58, 105, 168, 0.15)'
              }}
            >
              {/* Header with yellow tag */}
              <div style={{ backgroundColor: 'var(--primary-gold)', color: '#0E1F33', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                  🔥 OPORTUNIDAD IMPERDIBLE ONLINE
                </span>
                <button 
                  onClick={handleClosePopup}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                >
                  <X className="w-5 h-5 text-brand-navy" />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '40px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                {/* Image */}
                <div style={{ position: 'relative', width: '220px', height: '120px' }}>
                  <img 
                    src="/images/producto-la-planchetta.jpg" 
                    alt="Plancheta 2 Quemadores" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', color: '#0E1F33', margin: 0 }}>
                    Oportunidad 2 Quemadores
                  </h3>
                  <p style={{ fontSize: '13px', opacity: 0.6, margin: '5px 0 0 0' }}>
                    Chapa de hierro + 2 tapas de acero inoxidable
                  </p>
                </div>

                {/* Pricing info */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--brand-navy)' }}>
                    $34.000
                  </span>
                  <span style={{ fontSize: '1.2rem', opacity: 0.3, textDecoration: 'line-through' }}>
                    $43.000
                  </span>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 900, 
                    color: 'var(--brand-navy)', 
                    backgroundColor: 'var(--primary-gold)', 
                    padding: '4px 8px', 
                    borderRadius: '4px'
                  }}>
                    -21% OFF
                  </span>
                </div>

                {/* CTA */}
                <div style={{ width: '100%', marginTop: '10px' }}>
                  <Link 
                    href="/tienda/plancheta"
                    onClick={handleClosePopup}
                    style={{ 
                      display: 'block', textDecoration: 'none', textAlign: 'center',
                      backgroundColor: 'var(--primary-gold)', color: 'var(--brand-navy)', 
                      padding: '16px', borderRadius: '4px',
                      fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', 
                      letterSpacing: '0.15em', transition: '0.3s'
                    }}
                    className="gold-shimmer hover:scale-[1.02] transform"
                  >
                    Ver Oferta Especial
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
