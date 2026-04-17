import React from 'react';
import { Calculator, MapPin, Construction } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header style={{ 
      background: 'var(--brand-navy)', 
      color: 'white', 
      position: 'relative',
      overflow: 'hidden'
    }} className="rounded-b-[40px] shadow-2xl eng-header-pad">
      {/* 🔮 Fondo Decorativo de Ingeniería */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}>
        <Construction size={400} />
      </div>

      <div className="container mx-auto px-4">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
          <div style={{ 
            backgroundColor: 'rgba(249, 195, 0, 0.1)', 
            padding: '12px 24px', 
            borderRadius: '100px',
            border: '1px solid rgba(249, 195, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <MapPin className="w-4 h-4 text-[var(--brand-yellow)]" />
            <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--brand-yellow)' }}>
              Precisión Magallanes & Antártica
            </span>
          </div>
          
          <div>
            <h1 style={{ 
              fontWeight: 900, 
              lineHeight: 0.9, 
              textTransform: 'uppercase',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.03em'
            }} className="eng-title-size">
              CALCULADORA DE <br/>
              <span style={{ color: 'var(--brand-yellow)' }}>MATERIALES</span>
            </h1>
            <p style={{ 
              fontSize: '1rem', 
              opacity: 0.6, 
              maxWidth: '600px', 
              marginTop: '25px',
              fontWeight: 400,
              lineHeight: 1.6
            }}>
              Optimice su obra con nuestro motor de cálculo inteligente. Logística regional 
              y rendimientos certificados para las condiciones extremas de la Patagonia.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;