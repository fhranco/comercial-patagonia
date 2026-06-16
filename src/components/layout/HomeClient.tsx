"use client";

import React from "react";
import styles from "../../app/page.module.css";
import { motion, useScroll, useSpring } from "framer-motion";
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
import FurnitureShowcase from "./FurnitureShowcase";
import GrandCement from "./GrandCement";
import CeramicsFeatured from "./CeramicsFeatured";
import { Product } from "@/types/woocommerce";
import Link from "next/link";
import PromotionHUD from "../shop/PromotionHUD";
import RetailStories from "../shop/RetailStories";
import ProductQuickView from "../shop/ProductQuickView";
import CyberdayCountdown from "./CyberdayCountdown";
import { ArrowRight } from "lucide-react";
import { CAMPAIGN_CONFIG } from "@/lib/constants";

interface HomeClientProps {
  products: Product[];
}

export default function HomeClient({ products }: HomeClientProps) {
  const router = useRouter();
  const [selectedQuickProduct, setSelectedQuickProduct] = React.useState<Product | null>(null);
  const [isMarqueeOpen, setIsMarqueeOpen] = React.useState(CAMPAIGN_CONFIG.isCyberActive || CAMPAIGN_CONFIG.activeCampaign === "zanzini_june");
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
  const SHOP_URL = "/shop";

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
                href={CAMPAIGN_CONFIG.activeCampaign === "zanzini_june" ? "/shop?category=Zanzini" : "/shop?category=cyberday"} 
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
              onCategoryChange={(cat) => router.push(`/shop?category=${cat}`)} 
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
    </div>
  );
}
