"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ShoppingBag, ShieldCheck, 
  Download, MessageCircle, Info, Truck 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/woocommerce";
import { BRAND_CONFIG } from "@/lib/constants";

interface ProductDetailClientProps {
  initialProduct: Product;
}

export default function ProductDetailClient({ initialProduct: product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#000', minHeight: '100vh', position: 'relative' }}>
      
      {/* 🚀 HUD MINIMALISTA */}
      <nav className="titanium-glass" style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 2500 }}>
          <button 
            onClick={() => router.back()} 
            style={{ background: 'none', border: 'none', color: '#000', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer' }} 
            className="hover:opacity-50 transition-all"
          >
              <ChevronLeft className="w-5 h-5" /> Catálogo
          </button>
          
          <button onClick={() => setIsCartOpen(true)} className="gold-shimmer" style={{ 
              border: 'none', color: '#000', padding: '12px 25px', borderRadius: '100px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px',
              fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em'
          }}>
              <ShoppingBag className="w-4 h-4" />
              <span>Cotización</span>
          </button>
      </nav>

      {/* 🏎️ STICKY ACTION BAR (Visible on scroll) */}
      <AnimatePresence>
        <StickyActionHUD product={product} onAddToCart={() => addToCart(product)} />
      </AnimatePresence>

      <main style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', minHeight: 'calc(100vh - 100px)' }}>
          
          {/* 🖼️ SECCIÓN VISUAL */}
          <div style={{ position: 'relative', backgroundColor: '#FFFFFF' }}>
             <div style={{ position: 'sticky', top: '100px', width: '100%', height: 'calc(100vh - 100px)', padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ position: 'relative', width: '100%', height: '100%' }}
                  >
                       <Image 
                         src={product.images[0]?.src || ""} 
                         alt={product.name}
                         fill
                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                         style={{ objectFit: 'contain' }}
                         priority
                       />
                  </motion.div>
                {product.on_sale && (
                    <div style={{ position: 'absolute', top: '80px', left: '80px', background: 'var(--primary-gold)', color: '#000', padding: '10px 25px', borderRadius: '100px', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', zIndex: 10 }}>
                        Oportunidad de Suministro
                    </div>
                )}
             </div>
          </div>

          {/* 📝 SECCIÓN INFO */}
          <div style={{ padding: '100px 10%', display: 'flex', flexDirection: 'column' }}>
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
               >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', color: 'var(--primary-gold)' }}>
                          {product.categories[0]?.name || "Equipamiento Pro"}
                      </span>
                      <div style={{ width: '1px', height: '15px', background: '#DDD' }} />
                      <span style={{ fontSize: '10px', opacity: 0.4, fontWeight: 900 }}>REF: {product.sku || 'N/A'}</span>
                  </div>

                  <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 0.95, textTransform: 'uppercase', marginBottom: '40px', letterSpacing: '-0.02em' }}>
                      {product.name}
                  </h1>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '60px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                          ${Math.round(Number(product.price)).toLocaleString('es-CL')}
                      </span>
                      {product.regular_price && Number(product.regular_price) > 0 && product.regular_price !== product.price && (
                        <>
                          <span style={{ fontSize: '1.8rem', opacity: 0.3, textDecoration: 'line-through' }}>
                            ${Math.round(Number(product.regular_price)).toLocaleString('es-CL')}
                          </span>
                          <span style={{ 
                            fontSize: '1.2rem', 
                            fontWeight: 900, 
                            color: '#FF4B4B', 
                            backgroundColor: 'rgba(255, 75, 75, 0.1)', 
                            padding: '6px 14px', 
                            borderRadius: '6px'
                          }}>
                            -{Math.round(((Number(product.regular_price) - Number(product.price)) / Number(product.regular_price)) * 100)}% DESCUENTO
                          </span>
                        </>
                      )}
                  </div>

                  <div style={{ marginBottom: '60px' }}>
                      <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '25px', color: 'rgba(0,0,0,0.5)' }}>Especificaciones del Suministro</h3>
                      
                      {product.description || product.short_description ? (
                        <div 
                          style={{ opacity: 0.6, fontSize: '1.2rem', lineHeight: 1.8, fontWeight: 300 }}
                          dangerouslySetInnerHTML={{ __html: product.description || product.short_description }}
                        />
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', background: '#FFFFFF', padding: '30px', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <Truck className="w-4 h-4" style={{ color: 'var(--primary-gold)' }} />
                              <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Logística</span>
                            </div>
                            <p style={{ fontSize: '12px', opacity: 0.5 }}>Distribución inmediata desde Zona Franca, Punta Arenas.</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <ShieldCheck className="w-4 h-4" style={{ color: 'var(--primary-gold)' }} />
                              <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Garantía</span>
                            </div>
                            <p style={{ fontSize: '12px', opacity: 0.5 }}>Certificación técnica para clima extremo (Magallanes).</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <Info className="w-4 h-4" style={{ color: 'var(--primary-gold)' }} />
                              <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Asesoría</span>
                            </div>
                            <p style={{ fontSize: '12px', opacity: 0.5 }}>Soporte en obra disponible para este material.</p>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* 🔘 ACCIONES MAESTRAS */}
                  <div id="main-cta" style={{ display: 'grid', gap: '20px' }}>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          if (product && product.id) {
                            addToCart(product);
                          }
                        }}
                        className="gold-shimmer"
                        style={{ 
                          border: 'none', color: '#000', padding: '28px 40px', borderRadius: '4px',
                          fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer',
                          boxShadow: '0 20px 40px rgba(212, 175, 55, 0.2)'
                        }}
                      >
                          Incorporar a mi Cotización
                      </button>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                          <Link href={`https://wa.me/${BRAND_CONFIG.whatsapp.replace('+', '').replace(/\s/g, '')}?text=Hola, quiero cotizar el producto ${product.name}`} target="_blank" style={{ 
                              border: '1px solid #25D366', background: 'transparent', color: '#25D366', padding: '20px', borderRadius: '4px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none',
                              fontSize: '11px', fontWeight: 900, textTransform: 'uppercase'
                          }}>
                               <MessageCircle className="w-5 h-5" /> Consultar Especialista por WhatsApp
                          </Link>
                      </div>
                  </div>
               </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 🏎️ COMPONENTE INTERNO: STICKY HUD
function StickyActionHUD({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            const cta = document.getElementById('main-cta');
            if (cta) {
                const rect = cta.getBoundingClientRect();
                setIsVisible(rect.top < 0);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            style={{ 
                position: 'fixed', bottom: 0, left: 0, right: 0, 
                backgroundColor: 'rgba(14, 31, 51, 0.98)', color: '#FFF',
                padding: '15px 5%', zIndex: 3000,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(212, 175, 55, 0.3)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative', width: '45px', height: '45px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#FFF' }}>
                    <Image src={product.images[0]?.src || ""} alt={product.name} fill sizes="45px" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                    <h4 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{product.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--primary-gold)' }}>${Math.round(Number(product.price)).toLocaleString('es-CL')}</span>
                        {product.regular_price && Number(product.regular_price) > 0 && product.regular_price !== product.price && (
                          <>
                            <span style={{ fontSize: '10px', opacity: 0.5, textDecoration: 'line-through', color: '#FFF' }}>
                              ${Math.round(Number(product.regular_price)).toLocaleString('es-CL')}
                            </span>
                            <span style={{ 
                              fontSize: '9px', 
                              fontWeight: 900, 
                              color: '#FF4B4B', 
                              backgroundColor: 'rgba(255, 75, 75, 0.2)', 
                              padding: '1px 4px', 
                              borderRadius: '3px'
                            }}>
                              -{Math.round(((Number(product.regular_price) - Number(product.price)) / Number(product.regular_price)) * 100)}%
                            </span>
                          </>
                        )}
                    </div>
                </div>
            </div>

            <button 
                onClick={onAddToCart}
                className="gold-shimmer"
                style={{ border: 'none', padding: '12px 30px', borderRadius: '4px', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
            >
                Agregar a Cotización
            </button>
        </motion.div>
    );
}
