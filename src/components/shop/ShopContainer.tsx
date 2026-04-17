"use client";

import React, { useState, useEffect } from "react";
import styles from "../../app/page.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, ChevronLeft,
  LayoutGrid, List
} from "lucide-react";
import Link from 'next/link';
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/shop/ProductCard";
import ProductQuickView from "@/components/shop/ProductQuickView";
import BentoFilters from "@/components/shop/BentoFilters";
import SpotlightSearch from "@/components/shop/SpotlightSearch";
import { Product } from "@/types/woocommerce";

interface ShopContainerProps {
  initialProducts: Product[];
  initialCategory?: string;
  isLive?: boolean;
}

export default function ShopContainer({ initialProducts, initialCategory, isLive = true }: ShopContainerProps) {
  const { cart, setIsCartOpen } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [selectedQuickProduct, setSelectedQuickProduct] = useState<Product | null>(null);
  
  // 🧠 REAL-TIME PERSONALIZATION ENGINE
  const [userIntent, setUserIntent] = useState<{ category?: string; term?: string }>({});
  const [aiSuggestions, setAiSuggestions] = useState<Product[]>([]);

  // ⌨️ CMD+K Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  useEffect(() => {
    if (userIntent.category || userIntent.term) {
        const suggestions = initialProducts
            .filter(p => 
                (userIntent.category && p.categories.some(c => c.name === userIntent.category)) ||
                (userIntent.term && p.name.toLowerCase().includes(userIntent.term.toLowerCase()))
            )
            .slice(0, 4);
        setAiSuggestions(suggestions);
    }
  }, [userIntent, initialProducts]);

  // 🧠 SMART CATEGORY MATCHING (NAME OR SLUG)
  const getCategoryNameFromParam = (param: string) => {
    if (!param || param === "Todos") return "Todos";
    
    const normalizedParam = param.toLowerCase().trim();
    
    // Buscamos en todas las categorías disponibles en los productos
    const allUniqueCategories = Array.from(new Set(initialProducts.flatMap(p => p.categories)));
    
    const matchedCat = allUniqueCategories.find(c => 
        c.name.toLowerCase() === normalizedParam || 
        c.slug.toLowerCase() === normalizedParam
    );

    return matchedCat ? matchedCat.name : "Todos";
  };

  const [activeCategory, setActiveCategory] = useState(() => {
    return initialCategory ? getCategoryNameFromParam(initialCategory) : "Todos";
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleItems, setVisibleItems] = useState(24);

  useEffect(() => {
    if (initialCategory) {
      const targetCat = getCategoryNameFromParam(initialCategory);
      setActiveCategory(targetCat);
    } else {
      setActiveCategory("Todos");
    }
  }, [initialCategory, initialProducts]);

  const filteredProducts = initialProducts.filter(p => {
    const term = searchTerm.toLowerCase().trim();
    
    // 🧠 FUNCIÓN DE NORMALIZACIÓN PRO: Quita HTML entities, tildes y caracteres especiales
    const normalize = (str: string) => {
        if (!str) return "";
        // 1. Decodificar entidades HTML (si existen)
        const doc = new DOMParser().parseFromString(str, "text/html");
        const decoded = doc.documentElement.textContent || str;
        // 2. Quitar tildes
        return decoded.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const normalizedTerm = normalize(searchTerm);

    // 🧠 MODO BÚSQUEDA GLOBAL
    if (searchTerm.trim()) {
        return (
            normalize(p.name).includes(normalizedTerm) ||
            normalize(p.sku).includes(normalizedTerm) ||
            p.categories.some(cat => normalize(cat.name).includes(normalizedTerm))
        );
    }

    // 📁 MODO NAVEGACIÓN
    return activeCategory === "Todos" || p.categories.some(cat => 
        cat.name.toLowerCase() === activeCategory.toLowerCase()
    );
  });

  const displayProducts = filteredProducts.slice(0, visibleItems);
  const categories = ["Todos", ...new Set(initialProducts.flatMap(p => p.categories.map(cat => cat.name)).filter(Boolean))];

  return (
    <div className={`${styles.page} page-transition`} style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', width: '100%' }}>
      
      <nav className="titanium-glass" style={{ padding: '30px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 2000 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <Link href="/" style={{ color: 'inherit', opacity: 0.5, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} className="hover:opacity-100 hover:text-[#D4AF37] transition-all">
                  <ChevronLeft className="w-4 h-4" /> Inicio
              </Link>
              <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h1 style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.9 }}>Tienda Comercial de la Patagonia</h1>
              </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button onClick={() => setIsCartOpen(true)} className="gold-shimmer" style={{ border: 'none', color: '#000', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <ShoppingBag style={{ width: '18px' }} />
                  {cart.length > 0 && <span>{cart.length}</span>}
              </button>
          </div>
      </nav>

      <main style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 15px', overflowX: 'hidden' }} className="shop-main-container">
          <section style={{ padding: 'var(--shop-hero-padding, 60px 0 40px)' }}>
              <style jsx>{`
                section { --shop-hero-padding: 60px 0 40px; }
                .shop-main-container { width: 100% !important; max-width: 1400px !important; }
                @media (max-width: 768px) {
                  section { 
                    --shop-hero-padding: 20px 0;
                    text-align: center;
                  }
                  .shop-header-flex {
                    justify-content: center !important;
                    text-align: center;
                    width: 100% !important;
                  }
                  .shop-main-container { padding: 0 10px !important; }
                }
              `}</style>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary-gold)', letterSpacing: '0.2em', display: 'block' }}>Catálogo de Materiales</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} className="shop-header-flex">
                      <h2 style={{ fontSize: 'clamp(1.8rem, 10vw, 3.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, margin: 0 }}>TIENDA PATAGONIA.</h2>
                      <div onClick={() => setIsSpotlightOpen(true)} style={{ width: '100%', backgroundColor: 'rgba(128,128,128,0.05)', borderRadius: '12px', padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border-color)', cursor: 'text' }}>
                        <Search size={16} style={{ opacity: 0.5 }} />
                        <span style={{ fontSize: '13px', opacity: 0.5 }}>Buscar...</span>
                      </div>
                  </div>
                  <div style={{ marginTop: '5px' }}>
                    <BentoFilters categories={categories} activeCategory={activeCategory} onSelect={(cat) => { setActiveCategory(cat); setVisibleItems(24); setUserIntent(prev => ({ ...prev, category: cat })); }} />
                  </div>
              </div>
          </section>

          {/* 🪄 AI RECOMMENDATIONS - USANDO DIV ESTÁNDAR PARA EVITAR ERRORES DE LÍNEA 168 */}
          {aiSuggestions.length > 0 && (
            <div className="animate-fade-in" style={{ padding: '40px 5%', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderBottom: '1px solid rgba(212, 175, 55, 0.1)', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4AF37' }} className="animate-pulse" />
                    <h4 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#D4AF37' }}>Recomendaciones de IA para tu Obra</h4>
                </div>
                <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }} className="no-scrollbar">
                    {aiSuggestions.map(p => (
                        <div key={p.id} style={{ flex: '0 0 250px', backgroundColor: '#FFF', padding: '15px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <p style={{ fontSize: '10px', fontWeight: 900, marginBottom: '5px' }}>{p.name}</p>
                            <span style={{ fontSize: '9px', opacity: 0.5 }}>COD: {p.sku}</span>
                        </div>
                    ))}
                </div>
            </div>
          )}

          <div style={{ paddingBottom: '100px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, opacity: 0.5 }}>Mostrando {displayProducts.length} resultados</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setViewMode("grid")} style={{ opacity: viewMode === "grid" ? 1 : 0.3, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}><LayoutGrid className="w-5 h-5" /></button>
                  <button onClick={() => setViewMode("list")} style={{ opacity: viewMode === "list" ? 1 : 0.3, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}><List className="w-5 h-5" /></button>
                </div>
              </div>
              <div className={`page-transition ${viewMode === "grid" ? "product-grid-container" : "product-list-container"}`}>
                {displayProducts.map(p => (
                  <ProductCard key={p.id} product={p} onQuickView={(prod) => setSelectedQuickProduct(prod)} />
                ))}
              </div>
          </div>
      </main>

      <ProductQuickView product={selectedQuickProduct} isOpen={!!selectedQuickProduct} onClose={() => setSelectedQuickProduct(null)} />
      <SpotlightSearch products={initialProducts} isOpen={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} />
    </div>
  );
}
