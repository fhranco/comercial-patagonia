import React from 'react';
import { Package, Square, Home, Grid3X3, Waves, ArrowUpRight } from 'lucide-react';
import { Material } from '@/engineering/types/materials';
import { formatCurrency } from '@/engineering/utils/calculations';

interface MaterialCardProps {
  material: Material;
  isSelected: boolean;
  onSelect: (materialId: string) => void;
}

const iconMap = {
  Package,
  Square,
  Home,
  Grid3X3,
  Waves
};

const MaterialCard: React.FC<MaterialCardProps> = ({ material, isSelected, onSelect }) => {
  const IconComponent = iconMap[material.icon as keyof typeof iconMap] || Package;

  const getUnitDisplay = () => {
    switch (material.unitType) {
      case 'area':
        return `${material.defaultRendimiento} m² / ${material.unit}`;
      case 'volume':
        return `${material.defaultRendimiento} m³ / ${material.unit}`;
      default:
        return `${material.defaultRendimiento} / ${material.unit}`;
    }
  };

  return (
    <div
      onClick={() => onSelect(material.id)}
      style={{
        padding: '35px',
        borderRadius: '24px',
        backgroundColor: isSelected ? 'rgba(249, 195, 0, 0.05)' : '#FFF',
        border: '1px solid',
        borderColor: isSelected ? 'var(--brand-yellow)' : 'rgba(14, 31, 51, 0.08)',
        cursor: 'pointer',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: isSelected ? '0 20px 60px rgba(249, 195, 0, 0.15)' : 'none'
      }}
      className="group hover:shadow-2xl"
    >
      {/* 🚀 Indicador de Acción */}
      <div style={{ position: 'absolute', top: '25px', right: '25px', opacity: 0.3 }} className="group-hover:opacity-100 transition-opacity">
        <ArrowUpRight size={18} />
      </div>

      <div style={{ 
        width: '60px', height: '60px', 
        backgroundColor: isSelected ? 'var(--brand-yellow)' : '#F9F9FB', 
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
        color: isSelected ? 'var(--brand-navy)' : 'var(--brand-blue)',
        transition: 'all 0.4s'
      }}>
        <IconComponent size={28} />
      </div>

      <h3 style={{ 
        fontSize: '1.2rem', 
        fontWeight: 900, 
        color: 'var(--brand-navy)', 
        marginBottom: '15px',
        lineHeight: 1.2,
        textTransform: 'uppercase',
        fontFamily: 'var(--font-heading)'
      }}>
        {material.name}
      </h3>

      <div style={{ flex: 1 }}>
        <p style={{ 
            fontSize: '13px', 
            color: 'rgba(14, 31, 51, 0.5)', 
            marginBottom: '20px', 
            lineHeight: 1.6,
            fontWeight: 400
        }}>
            {material.description}
        </p>
      </div>

      <div style={{ 
        paddingTop: '20px', 
        borderTop: '1px solid rgba(14, 31, 51, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <div>
            <p style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '5px' }}>
                Rendimiento Certificado
            </p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-blue)' }}>
                {getUnitDisplay()}
            </p>
        </div>
        <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '18px', fontWeight: 900, color: 'var(--brand-navy)' }}>
                {formatCurrency(material.defaultPrice)}
            </p>
            <p style={{ fontSize: '10px', fontWeight: 600, opacity: 0.4 }}>
                por {material.unit}
            </p>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;