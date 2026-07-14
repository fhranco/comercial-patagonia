"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Flame, Check, Play, Info, 
  Maximize, Layers, Shield, ChefHat, Tag, X, HelpCircle, ChevronDown, Compass,
  Volume2, VolumeX
} from 'lucide-react';
import { Product } from '@/types/woocommerce';
import { useCart } from '@/context/CartContext';
import Navigation from '@/components/layout/Navigation';

interface PlanchetaLandingPageProps {
  product: Product;
}

const formatCLP = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(value);

// VIDEO MODAL COMPONENT
function VideoModal({ isOpen, onClose, videoId = "et3kOSyyQBE" }: { isOpen: boolean, onClose: () => void, videoId?: string }) {
  const playerRef = useRef<any>(null);
  const containerId = "yt-player-container-landing-dynamic";
  const [showClose, setShowClose] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const initPlayer = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        playerRef.current = new (window as any).YT.Player(containerId, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            enablejsapi: 1,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
          },
          events: {
            onReady: (event: any) => {
              event.target.mute();
              event.target.playVideo();
              setIsMuted(true);
            },
            onStateChange: (event: any) => {
              if (event.data === (window as any).YT.PlayerState.ENDED) {
                onClose();
              }
            },
          },
        });
      }
    };

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      (window as any).onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      const timer = setTimeout(() => {
        initPlayer();
      }, 100);
      return () => clearTimeout(timer);
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isOpen, onClose, videoId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    let timeoutId: any;
    
    const handleMouseMove = () => {
      setShowClose(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowClose(false);
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleMouseMove);

    timeoutId = setTimeout(() => {
      setShowClose(false);
    }, 2500);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [isOpen]);

  const handleToggleMute = () => {
    if (playerRef.current) {
      if (playerRef.current.isMuted()) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-grafito/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-grafito rounded-xl overflow-hidden shadow-2xl border border-neutral-700">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-30 p-2.5 bg-grisoscuro/95 text-white rounded-full hover:bg-naranjafuego transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-naranjafuego shadow-lg ${
            showClose ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          }`}
          aria-label="Cerrar video"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Custom Mute/Unmute Overlay Toggle - Top Left */}
        <button
          onClick={handleToggleMute}
          className={`absolute top-4 left-4 z-30 flex items-center gap-2 px-4 py-2.5 bg-grisoscuro/95 text-white rounded-full hover:bg-naranjafuego transition-all duration-300 focus:outline-none shadow-lg ${
            showClose ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          }`}
        >
          {isMuted ? (
            <>
              <VolumeX className="h-4.5 w-4.5 text-red-500 animate-pulse" /> Activar sonido
            </>
          ) : (
            <>
              <Volume2 className="h-4.5 w-4.5 text-emerald-500" /> Silenciar
            </>
          )}
        </button>

        <div className="aspect-video w-full">
          <div id={containerId} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default function PlanchetaLandingPage({ product }: PlanchetaLandingPageProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(true); // Starts on load
  const { addToCart, setIsCartOpen } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const faqs = [
    {
      q: '¿Es necesario curar el hierro antes de usarlo?',
      a: 'Sí, todas nuestras piezas de hierro requieren un proceso de curado sencillo inicial (aceite y calor) para crear su capa antiadherente natural y protegerlas contra el óxido.',
    },
    {
      q: '¿En qué fuentes de calor la puedo utilizar?',
      a: 'Su diseño es compatible con cocinas a gas, eléctricas, cocinas de inducción (usando un difusor adecuado), parrillas a carbón, leña y fogón directo.',
    },
    {
      q: '¿Cómo prevengo que se oxide la plancha?',
      a: 'El truco es secarla inmediatamente después de lavarla (se recomienda ponerla un minuto al fuego para evaporar humedad residual) y guardarla con una fina capa de aceite de cocina aplicada con servilleta.',
    },
    {
      q: '¿Viene con las tapas de acero inoxidable?',
      a: 'Sí, el set incluye la plancha de hierro y sus dos tapas de acero inoxidable con mangos de madera barnizados.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Safe pricing fallback
  const regularPrice = Number(product.regular_price) || 43000;
  const offerPrice = Number(product.price) || 34000;
  const savings = Math.max(0, regularPrice - offerPrice);

  return (
    <div className="bg-white text-grafito min-h-screen">
      <Navigation transparent={false} />
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white text-grafito pt-28 pb-12 md:pt-36 md:pb-24 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 md:space-y-8"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-naranjafuego/10 px-4 py-2 text-sm font-semibold text-naranjafuego">
                <Sparkles className="h-4 w-4" /> Oferta especial
              </span>

              <h1 className="text-4xl font-black tracking-tight text-grafito md:text-6xl leading-tight uppercase text-left">
                ¡Una gran
                <span className="block my-2">
                  <span className="bg-rojooferta px-4 py-1.5 rounded-lg text-grafito inline-block -rotate-1 shadow-md">
                    Oportunidad
                  </span>
                </span>
                para tu cocina!
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-neutral-600 text-left">
                Cocina carnes, hamburguesas, verduras, pescados y mucho más sobre una amplia superficie de hierro laminado que mantiene y distribuye el calor.
              </p>

              {/* Price Block */}
              <div className="bg-grisclaro p-6 rounded-xl border border-neutral-200 w-fit space-y-2">
                <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase block text-left">
                  VALOR DE OFERTA EXCLUSIVO
                </span>
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-6xl md:text-7xl font-black text-grafito tracking-tight leading-none">
                    {formatCLP(offerPrice)}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-sm text-neutral-400 line-through font-semibold leading-none">
                      Antes {formatCLP(regularPrice)}
                    </span>
                    {savings > 0 && (
                      <span className="inline-flex items-center rounded bg-rojooferta px-2 py-0.5 text-xs font-bold text-grafito w-fit mt-1.5 shadow-sm leading-none">
                        Ahorras {formatCLP(savings)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="bg-naranjafuego hover:bg-naranjafuego/90 text-white text-base px-8 py-4 rounded-md shadow-lg shadow-naranjafuego/10 hover:shadow-naranjafuego/30 transform hover:-translate-y-0.5 transition-all w-full sm:w-auto font-bold text-center"
                >
                  Agregar a mi Cotización
                </button>
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="inline-flex items-center justify-center gap-2 font-semibold text-white bg-red-600 hover:bg-red-700 px-8 py-4 rounded-md shadow-md hover:shadow-red-600/20 transform hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                >
                  <Play className="h-4 w-4 fill-current" /> Ver cómo funciona
                </button>
              </div>

              <p className="text-sm text-neutral-500 text-left">
                Plancheta 2 quemadores · 48 × 28 × 2,5 cm
              </p>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center items-center"
            >
              <div className="absolute inset-0 bg-neutral-100 rounded-3xl -z-10 transform rotate-1 scale-95" />
              
              <div className="relative p-4 md:p-8">
                <img
                  src="/images/producto-la-planchetta.jpg"
                  alt="Oportunidad 2 Quemadores con tapas de acero inoxidable y mangos de madera"
                  width={800}
                  height={600}
                  className="max-w-full h-auto object-contain rounded-2xl drop-shadow-2xl"
                />

                <div className="absolute -top-2 -left-2 bg-grisoscuro text-blancocalido text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-neutral-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-naranjafuego" />
                  Hierro laminado
                </div>

                <div className="absolute -bottom-2 left-6 bg-grisoscuro text-blancocalido text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-neutral-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Uso interior y exterior
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* YELLOW BENEFITS BAR */}
      <div className="bg-rojooferta border-y border-neutral-200 text-grafito py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 text-center">
            {[
              { icon: <Flame className="h-6 w-6 text-naranjafuego" />, text: 'Calor uniforme' },
              { icon: <Maximize className="h-6 w-6 text-naranjafuego" />, text: 'Gran superficie' },
              { icon: <Layers className="h-6 w-6 text-naranjafuego" />, text: 'Múltiples fuentes de calor' },
              { icon: <Shield className="h-6 w-6 text-naranjafuego" />, text: 'Construcción resistente' }
            ].map((benefit, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2 justify-center">
                <div className="bg-white/60 p-3 rounded-full shadow-sm">
                  {benefit.icon}
                </div>
                <span className="text-sm md:text-base font-bold tracking-wide text-grafito">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BENEFITS CARDS */}
      <section className="py-20 md:py-28 bg-blancocalido text-grafito border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Flame className="h-8 w-8 text-naranjafuego" />,
                title: "Hierro Laminado en Caliente",
                desc: "Material profesional que absorbe el calor, lo retiene y lo irradia de forma constante en toda la superficie de cocción."
              },
              {
                icon: <Layers className="h-8 w-8 text-naranjafuego" />,
                title: "Tapas de Acero Inoxidable",
                desc: "Incluye dos tapas separadas con mangos de madera para cocinar al vapor y mantener tus preparaciones calientes."
              },
              {
                icon: <Maximize className="h-8 w-8 text-naranjafuego" />,
                title: "Para 2 Quemadores",
                desc: "Cubre perfectamente dos fuegos de tu cocina clásica, dándote espacio de sobra para alimentar a toda tu familia."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-grisclaro p-8 rounded-xl border border-neutral-200 shadow-sm hover:border-naranjafuego transition-colors">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-grafito mb-3 text-left">{item.title}</h3>
                <p className="text-neutral-600 leading-relaxed text-sm text-left">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECIPES SECTION */}
      <section className="py-20 md:py-28 bg-blancocalido text-grafito border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-naranjafuego font-bold">Versatilidad total</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-grafito md:text-5xl mt-2">Del desayuno a la parrilla</h2>
            <div className="w-12 h-1 bg-naranjafuego mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Hamburguesas', subtitle: 'Costra perfecta y queso fundido al vapor.', image: '/images/9.webp' },
              { title: 'Carnes', subtitle: 'Sellado a alta temperatura manteniendo los jugos.', image: '/images/10.webp' },
              { title: 'Verduras', subtitle: 'Salteados rápidos que conservan color y textura.', image: '/images/11.webp' },
              { title: 'Pescados', subtitle: 'Cocción delicada sin que se desarme la pieza.', image: '/images/12.webp' },
              { title: 'Mariscos', subtitle: 'A la plancha con ajo, perejil y cocción uniforme.', image: '/images/13.webp' },
              { title: 'Desayunos', subtitle: 'Huevos, tocino y pan tostado al mismo tiempo.', image: '/images/14.webp' }
            ].map((item, idx) => (
              <div key={idx} className="group relative h-72 rounded-xl border border-neutral-200 bg-white overflow-hidden flex flex-col justify-end p-6 hover:border-naranjafuego transition-all duration-300 shadow-md">
                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-grafito/90 via-grafito/40 to-transparent pointer-events-none" />
                <div className="absolute top-6 right-6 opacity-40 group-hover:opacity-60 transition-opacity z-10">
                  <ChefHat className="h-8 w-8 text-white" />
                </div>
                <div className="relative z-10 space-y-1.5 text-left">
                  <h3 className="text-xl font-bold text-white group-hover:text-rojooferta transition-colors">{item.title}</h3>
                  <p className="text-sm text-neutral-200 leading-relaxed">{item.subtitle}</p>
                  <div className="pt-1">
                    <span className="text-xs text-rojooferta font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 block">
                      Ideal para esta preparación →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPATIBILITY */}
      <section className="py-20 md:py-28 bg-grisclaro text-grafito border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-grafito md:text-5xl">Uso universal en tu hogar</h2>
              <p className="text-neutral-600 leading-relaxed">
                Diseño optimizado para responder perfectamente sobre cualquier fuente de calor de uso común, tanto en interiores como exteriores.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['Cocina a gas', 'Cocina eléctrica', 'Parrilla a carbón', 'Fogones / Fogatas'].map((source, idx) => (
                  <div key={idx} className="flex items-center space-x-3 bg-white p-4 rounded-lg border border-neutral-200/50 shadow-sm">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-grafito">{source}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical visual representation */}
            <div className="relative bg-grisoscuro rounded-2xl p-8 border border-neutral-800 shadow-2xl overflow-hidden aspect-video flex flex-col justify-between h-80">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

              {/* Fire animations in CSS */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-12 flex justify-around items-end opacity-80 pointer-events-none">
                <div className="w-4 h-8 bg-naranjafuego rounded-t-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-5 h-12 bg-naranjafuego rounded-t-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                <div className="w-3 h-6 bg-rojooferta rounded-t-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-5 h-10 bg-naranjafuego rounded-t-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                <div className="w-4 h-12 bg-amber-500 rounded-t-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>

              {/* Header of Schematic */}
              <div className="relative z-10 flex justify-between items-center text-neutral-400 text-xs font-mono">
                <span>ESQUEMA TÉCNICO // COMPATIBILIDAD</span>
                <Compass className="h-4 w-4 text-neutral-500" />
              </div>

              {/* The CSS Planchetta Model */}
              <div className="relative z-10 my-auto flex flex-col items-center">
                {/* Outer Planchetta frame */}
                <div className="w-3/4 h-24 bg-grafito border-2 border-neutral-700 rounded-lg shadow-inner flex p-1 relative">
                  
                  {/* Left Lid */}
                  <div className="flex-1 bg-gradient-to-br from-neutral-300 to-neutral-400 border border-neutral-200 rounded m-0.5 flex flex-col items-center justify-center shadow-md relative">
                    {/* Wooden handle */}
                    <div className="w-10 h-2 bg-amber-800 rounded shadow-sm border border-amber-950" />
                    <span className="absolute bottom-1 text-[8px] font-mono text-neutral-700">Tapa Inox</span>
                  </div>

                  {/* Open Space / Grill Area */}
                  <div className="flex-1 bg-grisoscuro rounded m-0.5 flex items-center justify-center border border-neutral-800 relative">
                    {/* Food representation */}
                    <div className="w-3 h-3 bg-red-800 rounded-full animate-pulse mr-1" />
                    <div className="w-3.5 h-2 bg-orange-700 rounded-sm" />
                    <span className="absolute bottom-1 text-[8px] font-mono text-neutral-500">Superficie Hierro</span>
                  </div>

                  {/* Handles */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-8 border-y-2 border-l-2 border-neutral-600 rounded-l-md" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-8 border-y-2 border-r-2 border-neutral-600 rounded-r-md" />
                </div>
              </div>

              {/* Metadata Footer of Schematic */}
              <div className="relative z-10 flex justify-between items-end text-[10px] font-mono text-neutral-500">
                <div className="text-left">
                  <p>ANCHO: 48 CM</p>
                  <p>ALTO: 28 CM</p>
                </div>
                <p className="text-orange-500 font-bold">100% VERSÁTIL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIFICATIONS */}
      <section className="py-20 md:py-28 bg-blancocalido text-grafito border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0E1F33] md:text-5xl">Características del producto</h2>
            <div className="w-12 h-1 bg-[#2161a8] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-neutral-200">
                <tbody className="divide-y divide-neutral-100">
                  {[
                    { label: 'Producto', value: product.name },
                    { label: 'Medidas', value: '48 × 28 × 2,5 cm' },
                    { label: 'Material principal', value: 'Hierro laminado en caliente' },
                    { label: 'Componentes', value: 'Hierro, aluminio y madera' },
                    { label: 'Fuentes de calor', value: 'Gas, electricidad, parrilla, fogón' },
                    { label: 'SKU', value: product.sku },
                  ].map((spec, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-grisclaro/50' : 'bg-white'}>
                      <td className="px-6 py-4 text-sm font-semibold text-neutral-500 w-1/3 text-left">{spec.label}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-grafito text-left">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-grisclaro text-grafito p-8 rounded-xl border border-neutral-200 shadow-sm flex flex-col justify-between h-full text-left">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-naranjafuego">
                  <Sparkles className="h-6 w-6" />
                  <h3 className="text-lg font-bold uppercase tracking-wider">Cuidado y limpieza</h3>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Lava con agua caliente y detergente. Evita los productos abrasivos (como desengrasantes abrasivos) and seca completamente después de cada uso para prolongar la vida útil del hierro.
                </p>
              </div>
              
              <div className="mt-8 p-4 bg-white rounded-lg border border-neutral-200 flex items-start space-x-3">
                <Info className="h-5 w-5 text-naranjafuego flex-shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-500 leading-relaxed">
                  El curado adecuado y evitar la humedad constante previenen la oxidación natural del hierro y mejoran sus propiedades antiadherentes con el tiempo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BOX */}
      <section className="py-20 md:py-24 bg-blancocalido text-grafito border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-naranjafuego/10 rounded-full blur-2xl -z-10" />
            <div className="space-y-4 text-center md:text-left">
              <span className="inline-flex items-center gap-1 bg-rojooferta/10 text-grafito text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                <Tag className="h-3.5 w-3.5 text-naranjafuego" /> Precio especial
              </span>
              <h2 className="text-3xl font-extrabold text-grafito tracking-tight md:text-4xl text-left">
                Lleva tu Oportunidad por {formatCLP(offerPrice)}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <div className="text-sm font-semibold text-neutral-400">
                  Antes: <span className="line-through">{formatCLP(regularPrice)}</span>
                </div>
                <div className="text-2xl font-bold text-grafito">
                  Ahora: {formatCLP(offerPrice)}
                </div>
                {savings > 0 && (
                  <div className="bg-rojooferta text-grafito text-xs font-bold px-2.5 py-1 rounded">
                    Ahorras {formatCLP(savings)}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-auto flex-shrink-0">
              <button 
                onClick={handleAddToCart}
                className="bg-naranjafuego hover:bg-naranjafuego/90 text-white text-lg px-8 py-4 rounded-md shadow-lg w-full md:w-auto font-bold text-center"
              >
                Quiero mi Oportunidad
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-blancocalido text-grafito border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-grafito md:text-5xl">Preguntas frecuentes</h2>
            <div className="w-12 h-1 bg-naranjafuego mx-auto mt-4 rounded-full" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-grafito hover:text-naranjafuego transition-colors focus:outline-none"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-neutral-400 text-left" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-sm text-neutral-600 border-t border-neutral-100 pt-4 leading-relaxed text-left">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL YELLOW CTA */}
      <section className="relative overflow-hidden bg-rojooferta text-grafito py-24 md:py-32 border-b border-neutral-200">
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-96 h-96 bg-naranjafuego/10 rounded-full blur-3xl -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(#00000004_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="inline-flex p-3 bg-white/50 border border-white/20 rounded-full text-naranjafuego shadow-md">
            <Flame className="h-8 w-8 animate-pulse" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-grafito md:text-5xl">Tu cocina puede hacer mucho más</h2>
            <p className="max-w-xl mx-auto text-base md:text-lg text-neutral-800 leading-relaxed">
              Amplía tus posibilidades y disfruta el sabor de cocinar sobre hierro.
            </p>
          </div>

          <div className="space-y-2 bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/40 shadow-xl max-w-md mx-auto">
            <p className="text-xs font-bold tracking-widest text-neutral-500 uppercase">VALOR EXCLUSIVO ONLINE</p>
            <div className="text-6xl md:text-7xl font-black text-grafito tracking-tight">{formatCLP(offerPrice)}</div>
            <p className="text-sm font-semibold text-neutral-500">Antes: {formatCLP(regularPrice)} · Ahorras {formatCLP(savings)}</p>
          </div>

          <div className="pt-4">
            <button 
              onClick={handleAddToCart}
              className="bg-naranjafuego hover:bg-naranjafuego/90 text-white text-lg px-10 py-5 rounded-md shadow-xl w-full sm:w-auto font-bold text-center"
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal overlay */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </div>
  );
}
