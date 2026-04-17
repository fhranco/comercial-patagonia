import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Construction, ShieldAlert } from 'lucide-react';
import { Material } from '@/engineering/types/materials';

interface TipsSectionProps {
  selectedMaterial: Material | null;
}

const TipsSection: React.FC<TipsSectionProps> = ({ selectedMaterial }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const generalTips = [
    'Mide siempre dos veces antes de la compra final.',
    'En Magallanes, proteja sus materiales de la humedad extrema de la bodega.',
    'Los vientos patagónicos requieren fijaciones de alto estándar certificado.',
    'Utilice herramientas de nivel profesional para garantizar el rendimiento.',
    'Confirme los tiempos de fraguado según la temperatura ambiente regional.'
  ];

  const tips = selectedMaterial ? selectedMaterial.tips : generalTips;

  return (
    <div style={{
        marginTop: '60px',
        padding: '50px',
        borderRadius: '32px',
        backgroundColor: 'rgba(249, 195, 0, 0.03)',
        border: '1px solid rgba(249, 195, 0, 0.15)',
        boxShadow: '0 20px 40px rgba(249, 195, 0, 0.05)',
        transition: 'all 0.6s'
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--brand-yellow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-navy)' }}>
                <ShieldAlert size={20} />
            </div>
            <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--brand-navy)', letterSpacing: '0.1em' }}>
                    {selectedMaterial ? `Directrices Técnicas: ${selectedMaterial.name}` : 'Directrices Generales de Obra'}
                </h3>
                <p style={{ fontSize: '11px', opacity: 0.5, fontWeight: 700 }}>RECOMENDACIONES PARA EL CLIMA PATAGÓNICO</p>
            </div>
        </div>
        <div style={{ opacity: 0.3 }}>
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {tips.map((tip, index) => (
            <div key={index} style={{ 
                padding: '25px', 
                backgroundColor: '#FFFFFF', 
                borderRadius: '20px', 
                border: '1px solid rgba(249, 195, 0, 0.1)',
                display: 'flex',
                gap: '15px'
            }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--brand-yellow)', marginTop: '3px' }}>
                0{index + 1}
              </span>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--brand-navy)', fontWeight: 400 }}>
                {tip}
              </p>
            </div>
          ))}
        </div>
      )}

      {isExpanded && selectedMaterial && (
        <div style={{ 
            marginTop: '30px', 
            padding: '20px 30px', 
            backgroundColor: 'rgba(14, 31, 51, 0.03)', 
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        }}>
            <Construction size={16} className="text-[var(--brand-blue)]" />
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--brand-blue)' }}>
                <strong>Especificación:</strong> {selectedMaterial.description}
            </p>
        </div>
      )}
    </div>
  );
};

export default TipsSection;