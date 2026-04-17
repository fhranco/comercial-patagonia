"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Check, Info, ShieldCheck, Truck, Construction } from "lucide-react";
import { Product } from "@/types/woocommerce";
import { useCart } from "@/context/CartContext";

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [activeImgIndex, setActiveImgIndex] = React.useState(0);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          {/* 🌑 DYNAMIC OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(14, 31, 51, 0.85)', backdropFilter: 'blur(15px)' }}
          />

          {/* 🎞️ CINEMA MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ 
              position: 'relative', width: '100%', maxWidth: '1100px', 
              backgroundColor: '#FFF', borderRadius: '4px', overflow: 'hidden',
              boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
              maxHeight: '90vh',
              display: 'flex'
            }}
            className="flex-col md:flex-row shadow-2xl"
          >
            {/* 🖼️ MEDIA SIDE */}
            <div style={{ position: 'relative', flex: 1.2, backgroundColor: '#F9F9F9', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', flex: 1, width: '100%' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImgIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    style={{ position: 'absolute', inset: 0, padding: '40px' }}
                  >
                    <Image 
                      src={product.images[activeImgIndex]?.src || product.images[0]?.src || ""} 
                      alt={product.name} 
                      fill 
                      style={{ objectFit: 'contain' }} 
                    />
                  </motion.div>
                </AnimatePresence>
                
                <button 
                  onClick={onClose} 
                  className="hover:scale-110 transition-all"
                  style={{ position: 'absolute', top: '25px', left: '25px', backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10 }}
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>

              {/* 📸 THUMBNAILS GALLERY */}
              {product.images.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', padding: '0 40px 40px', justifyContent: 'center' }}>
                  {product.images.map((img, idx) => (
                    <button 
                      key={img.id || idx}
                      onClick={() => setActiveImgIndex(idx)}
                      style={{ 
                        width: '60px', height: '60px', position: 'relative', 
                        borderRadius: '4px', overflow: 'hidden', 
                        border: activeImgIndex === idx ? '2px solid var(--primary-gold)' : '2px solid transparent',
                        transition: '0.2s', cursor: 'pointer'
                      }}
                    >
                      <Image src={img.src} alt="" fill style={{ objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 📄 INFO SIDE */}
            <div style={{ flex: 1, padding: '50px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }} className="no-scrollbar">
              <div style={{ marginBottom: '30px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: '#D4AF37', letterSpacing: '0.3em', display: 'block', marginBottom: '15px' }}>
                  {product.categories[0]?.name || "Equipamiento Original"}
                </span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, color: '#0E1F33', marginBottom: '15px' }}>
                  {product.name}
                </h2>
                <p style={{ fontSize: '12px', fontWeight: 700, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  SKU: {product.sku || 'N/A'} • Magallanes B2B Approved
                </p>
              </div>

              {/* 🛠️ B2B MATERIAL CALCULATOR (ALWAYS ON FOR CONSTRUCTION/CEMENT) */}
              {(
                product.name.toLowerCase().includes('cemento') || 
                product.name.toLowerCase().includes('comodoro') ||
                product.name.toLowerCase().includes('binelli') ||
                product.name.toLowerCase().includes('saco') ||
                product.categories.some(c => 
                  c.name.toLowerCase().includes('cemento') || 
                  c.name.toLowerCase().includes('construcción') ||
                  c.name.toLowerCase().includes('construccion')
                )
              ) && (
                <MaterialCalculator 
                  onCalculate={(qty) => {
                    setQuantity(qty);
                  }} 
                />
              )}

              <div style={{ padding: '25px 0', borderTop: '1px solid #EEE', borderBottom: '1px solid #EEE', marginBottom: '35px' }}>
                 <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0E1F33', fontFamily: 'var(--font-heading)' }}>
                      ${Math.round(Number(product.price)).toLocaleString('es-CL')}
                    </span>
                    {product.regular_price !== product.price && (
                      <span style={{ fontSize: '1.2rem', opacity: 0.3, textDecoration: 'line-through' }}>
                        ${Math.round(Number(product.regular_price)).toLocaleString('es-CL')}
                      </span>
                    )}
                 </div>
                 <p style={{ fontSize: '11px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase' }}>IVA Incluido* • Disponibilidad Inmediata</p>
              </div>

              <div style={{ flex: 1, marginBottom: '40px' }}>
                <h4 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Info className="w-3 h-3" /> Especificaciones Técnicas
                </h4>
                <div 
                  style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(0,0,0,0.7)', fontWeight: 300 }}
                  dangerouslySetInnerHTML={{ __html: product.description || product.short_description || "No hay especificaciones detalladas disponibles en este momento." }}
                />
              </div>

              {/* 🛠️ B2B GUARANTEES */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '40px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', backgroundColor: '#F9F9F9', borderRadius: '4px' }}>
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase' }}>Garantía Oficial</span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', backgroundColor: '#F9F9F9', borderRadius: '4px' }}>
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase' }}>Envío Magallanes</span>
                 </div>
              </div>

               <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                 {!product.categories.some(c => c.name.toLowerCase().includes('cemento')) && (
                   <input 
                     type="number" 
                     min="1" 
                     value={quantity} 
                     onChange={(e) => setQuantity(Number(e.target.value))}
                     style={{ width: '70px', padding: '20px', border: '1px solid #EEE', borderRadius: '4px', textAlign: 'center', fontSize: '14px', fontWeight: 900 }}
                   />
                 )}
                 
                 <button 
                  onClick={handleAddToCart}
                  style={{ 
                    flex: 1, border: 'none', backgroundColor: '#D4AF37', color: '#0E1F33', padding: '22px', borderRadius: '4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px',
                    fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer',
                    boxShadow: '0 15px 35px rgba(212, 175, 55, 0.3)'
                  }}
                  className="hover:scale-[1.03] transition-all"
                 >
                   {added ? <Check className="w-4 h-4" /> : <ShoppingBag size={16} />}
                   {added ? "Agregado a Cotización" : `Sumar ${quantity > 1 ? `(${quantity})` : ""} a mi Cotización`}
                 </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function MaterialCalculator({ onCalculate }: { onCalculate: (qty: number) => void }) {
    const [sqm, setSqm] = React.useState<number>(0);
    const [thickness, setThickness] = React.useState<number>(5); // cm
    
    // Calcular sacos: (m2 * (espesor/100)) * sacos_por_m3 (14) * 1.1 (margen)
    const bags = Math.ceil((sqm * (thickness / 100)) * 14 * 1.1);

    React.useEffect(() => {
        if (bags > 0) onCalculate(bags);
        else onCalculate(1);
    }, [bags, onCalculate]);

    return (
        <div style={{ 
            backgroundColor: 'rgba(212, 175, 55, 0.1)', 
            border: '2px solid rgba(212, 175, 55, 0.5)', 
            borderRadius: '4px', padding: '25px', marginBottom: '35px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <Construction className="w-4 h-4 text-[#D4AF37]" />
                <h3 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cubicador B2B Magallanes</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                    <label style={{ fontSize: '8px', fontWeight: 900, opacity: 0.5, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Metros Cuadrados (m²)</label>
                    <input 
                        type="number" 
                        value={sqm} 
                        onChange={(e) => setSqm(Number(e.target.value))}
                        style={{ width: '100%', padding: '10px', border: '1px solid #EEE', borderRadius: '4px', fontSize: '14px', fontWeight: 700 }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '8px', fontWeight: 900, opacity: 0.5, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Espesor (cm)</label>
                    <input 
                        type="number" 
                        value={thickness} 
                        onChange={(e) => setThickness(Number(e.target.value))}
                        style={{ width: '100%', padding: '10px', border: '1px solid #EEE', borderRadius: '4px', fontSize: '14px', fontWeight: 700 }}
                    />
                </div>
            </div>

            <div style={{ borderTop: '1px dashed rgba(212, 175, 55, 0.2)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ fontSize: '9px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase' }}>Necesitas aprox.</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0E1F33' }}>{bags > 0 ? bags : 0} Sacos</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '8px', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase' }}>+10% Merma Incl.</p>
                </div>
            </div>
        </div>
    );
}
