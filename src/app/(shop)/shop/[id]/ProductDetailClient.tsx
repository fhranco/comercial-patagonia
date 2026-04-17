"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

export default function ProductDetailClient({ initialProduct }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const [product, setProduct] = React.useState<Product>(initialProduct);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // ⚡️ NITRO LOAD: Intentamos sacar el producto de la memoria inmediata para 0ms de delay
    const cachedProduct = sessionStorage.getItem('current_product');
    const pathId = window.location.pathname.split('/').pop();

    if (cachedProduct) {
      try {
        const parsed = JSON.parse(cachedProduct);
        if (String(parsed.id) === pathId) {
          setProduct(parsed);
          // Ya no necesitamos skeleton si tenemos el caché
        }
      } catch (e) {
        console.error("Cache error");
      }
    }

    const fetchRealProduct = async () => {
      // Solo mostramos loading si no tenemos nada en el estado todavía
      if (!product.id || String(product.id) !== pathId) {
        setLoading(true);
      }
      
      try {
        const res = await fetch(`/api/product?id=${pathId}`);
        const data = await res.json();
        if (data && data.id) {
          setProduct(data);
        }
      } catch (err) {
        console.warn("No se pudo cargar el producto real, manteniendo respaldo.");
      } finally {
        setLoading(false);
      }
    };

    fetchRealProduct();
  }, [initialProduct.id]);

  return (
    <div style={{ backgroundColor: '#FFF', color: '#000', minHeight: '100vh' }}>
      
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

      <main style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', minHeight: 'calc(100vh - 100px)' }}>
          
          {/* 🖼️ SECCIÓN VISUAL */}
          <div style={{ position: 'relative', backgroundColor: '#F8F8F8' }}>
             <div style={{ position: 'sticky', top: '100px', width: '100%', height: 'calc(100vh - 100px)', padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                   <div style={{ width: '80%', height: '80%', backgroundColor: '#EEE', borderRadius: '8px' }} className="animate-pulse gold-shimmer" />
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ position: 'relative', width: '100%', height: '100%' }}
                  >
                      <Image 
                        src={product.images[0]?.src || ""} 
                        alt={product.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                      />
                  </motion.div>
                )}
                {product.on_sale && !loading && (
                    <div style={{ position: 'absolute', top: '80px', left: '80px', background: 'var(--primary-gold)', color: '#000', padding: '10px 25px', borderRadius: '100px', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', zIndex: 10 }}>
                        Oportunidad de Suministro
                    </div>
                )}
             </div>
          </div>

          {/* 📝 SECCIÓN INFO */}
          <div style={{ padding: '100px 10%', display: 'flex', flexDirection: 'column' }}>
             {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                   <div style={{ width: '150px', height: '10px', backgroundColor: '#EEE' }} className="animate-pulse" />
                   <div style={{ width: '100%', height: '60px', backgroundColor: '#EEE' }} className="animate-pulse" />
                   <div style={{ width: '200px', height: '80px', backgroundColor: '#EEE' }} className="animate-pulse" />
                   <div style={{ width: '100%', height: '200px', backgroundColor: '#EEE' }} className="animate-pulse" />
                </div>
             ) : (
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

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '60px' }}>
                      <span style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                          ${Math.round(Number(product.price)).toLocaleString('es-CL')}
                      </span>
                      <span style={{ fontSize: '12px', opacity: 0.4, fontWeight: 900, textTransform: 'uppercase' }}>+ IVA</span>
                  </div>

                  <div style={{ marginBottom: '60px' }}>
                      <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px' }}>Descripción Técnica</h3>
                      <div 
                        style={{ opacity: 0.6, fontSize: '1.2rem', lineHeight: 1.8, fontWeight: 300 }}
                        dangerouslySetInnerHTML={{ __html: product.description || product.short_description || "Información técnica en proceso de actualización..." }}
                      />
                  </div>

                  {/* 🔘 ACCIONES MAESTRAS */}
                  <div style={{ display: 'grid', gap: '20px' }}>
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
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
