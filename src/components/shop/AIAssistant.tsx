"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, HardHat, Wind, ThermometerSnowflake, Ruler } from "lucide-react";

const INITIAL_MESSAGES = [
  { role: 'bot', text: 'Hola, soy el Asesor Técnico de Comercial de la Patagonia. ¿En qué proyecto estás trabajando hoy?' },
  { role: 'bot', text: 'Puedo ayudarte con rendimientos de cemento, herramientas para clima extremo o logística en Magallanes.' }
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    // 🤖 Lógica Simulada de IA Técnica de la Patagonia
    setTimeout(() => {
        let response = "";
        const lowerInput = userMsg.text.toLowerCase();

        if (lowerInput.includes("viento") || lowerInput.includes("clima")) {
            response = "Para condiciones de viento extremo (+100km/h), te sugiero fijaciones de torque industrial y sellantes de poliuretano de alta elasticidad. ¿Vemos opciones?";
        } else if (lowerInput.includes("cemento") || lowerInput.includes("saco")) {
            response = "Para cimientos en Magallanes, el Cemento Comodoro CPP 40 es el estándar. Recuerda añadir un 10% de margen por merma. ¿Quieres que lo sume a tu cotización?";
        } else if (lowerInput.includes("frio") || lowerInput.includes("escarcha")) {
            response = "La escarcha requiere aditivos acelerantes de fraguado si estás hormigonando ahora. ¿Buscas aditivos MasterBuilders?";
        } else {
            response = "Entendido. Estoy analizando tu requerimiento con nuestro inventario en tiempo real. ¿Tienes el m² del proyecto?";
        }

        setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 1000);
  };

  return (
    <>
      {/* 🔮 TRIGGER BUTTON */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed', bottom: '130px', right: '30px', zIndex: 9998,
          width: '60px', height: '60px', borderRadius: '50%',
          backgroundColor: '#0E1F33', border: '1px solid rgba(212, 175, 55, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 40px rgba(14, 31, 51, 0.4)', cursor: 'pointer',
          color: '#D4AF37'
        }}
      >
        <Sparkles size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            style={{
              position: 'fixed', bottom: '130px', right: '100px', zIndex: 9999,
              width: '380px', height: '550px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(30px)',
              borderRadius: '20px', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 40px 100px rgba(14, 31, 51, 0.25)',
              border: '1px solid rgba(14, 31, 51, 0.1)'
            }}
          >
            {/* 🏗️ HEADER ASISTENTE */}
            <div style={{ padding: '25px', backgroundColor: '#0E1F33', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HardHat className="text-[#D4AF37]" size={20} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>AI Architect</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                            <span style={{ fontSize: '9px', fontWeight: 700, opacity: 0.6 }}>Technical Advisor Live</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', opacity: 0.5 }}>
                    <X size={20} />
                </button>
            </div>

            {/* 💬 CHAT AREA */}
            <div 
                ref={scrollRef}
                style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}
                className="no-scrollbar"
            >
                {messages.map((msg, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx} 
                        style={{ 
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            display: 'flex', gap: '10px', alignItems: 'flex-end',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                        }}
                    >
                        <div style={{ 
                            width: '28px', height: '28px', borderRadius: '8px', 
                            backgroundColor: msg.role === 'user' ? '#D4AF37' : '#0E1F33',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            {msg.role === 'user' ? <User size={14} className="text-[#0E1F33]" /> : <Bot size={14} className="text-[#D4AF37]" />}
                        </div>
                        <div style={{ 
                            padding: '12px 16px', borderRadius: '15px',
                            backgroundColor: msg.role === 'user' ? '#D4AF37' : '#F1F5F9',
                            color: msg.role === 'user' ? '#0E1F33' : '#334155',
                            fontSize: '13px', lineHeight: 1.5, fontWeight: msg.role === 'user' ? 600 : 400,
                            borderBottomRightRadius: msg.role === 'user' ? '2px' : '15px',
                            borderBottomLeftRadius: msg.role === 'bot' ? '2px' : '15px'
                        }}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ⚡ SUGGESTED ACTIONS */}
            <div style={{ padding: '10px 20px', display: 'flex', gap: '10px', overflowX: 'auto' }} className="no-scrollbar">
                <button 
                  onClick={() => setInputValue("Rendimiento cemento...")}
                  style={{ whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '20px', border: '1px solid #E2E8F0', fontSize: '10px', fontWeight: 700, backgroundColor: '#FFF', cursor: 'pointer' }}
                >
                    <Ruler size={10} className="inline mr-1" /> Rendimientos
                </button>
                <button 
                  onClick={() => setInputValue("Info climática...")}
                  style={{ whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '20px', border: '1px solid #E2E8F0', fontSize: '10px', fontWeight: 700, backgroundColor: '#FFF', cursor: 'pointer' }}
                >
                    <Wind size={10} className="inline mr-1" /> Clima Extremo
                </button>
                <button 
                  onClick={() => setInputValue("Logística cruce...")}
                  style={{ whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '20px', border: '1px solid #E2E8F0', fontSize: '10px', fontWeight: 700, backgroundColor: '#FFF', cursor: 'pointer' }}
                >
                    <ThermometerSnowflake size={10} className="inline mr-1" /> Frío/Nieve
                </button>
            </div>

            {/* ⌨️ INPUT AREA */}
            <div style={{ padding: '20px', borderTop: '1px solid #EEE', display: 'flex', gap: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Pregunta sobre tu obra..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    style={{ flex: 1, border: 'none', background: '#F1F5F9', padding: '12px 18px', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
                />
                <button 
                    onClick={handleSend}
                    style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#0E1F33', color: '#D4AF37', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                    <Send size={18} />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
