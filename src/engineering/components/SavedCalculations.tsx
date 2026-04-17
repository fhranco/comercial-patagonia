import React from 'react';
import { History, Trash2, Eye, Calendar, ArrowRight } from 'lucide-react';
import { Calculation } from '@/engineering/types/materials';
import { formatCurrency } from '@/engineering/utils/calculations';

interface SavedCalculationsProps {
  calculations: Calculation[];
  onViewCalculation: (calculation: Calculation) => void;
  onDeleteCalculation: (calculationId: string) => void;
}

const SavedCalculations: React.FC<SavedCalculationsProps> = ({
  calculations,
  onViewCalculation,
  onDeleteCalculation
}) => {
  if (calculations.length === 0) return null;

  return (
    <div style={{
        marginTop: '60px',
        padding: '50px',
        borderRadius: '32px',
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(14, 31, 51, 0.08)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{ 
        fontSize: '1.2rem', 
        fontWeight: 900, 
        textTransform: 'uppercase', 
        color: 'var(--brand-navy)', 
        marginBottom: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px',
        letterSpacing: '0.1em'
      }}>
        <History className="text-[var(--brand-blue)]" /> HISTORIAL DE CÁLCULOS ({calculations.length})
      </h2>

      <div style={{ display: 'grid', gap: '15px' }}>
        {calculations.slice(0, 5).map((calculation) => (
          <div
            key={calculation.id}
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '25px 35px', 
                backgroundColor: '#F9FAFB', 
                borderRadius: '20px',
                border: '1px solid rgba(0,0,0,0.03)',
                transition: 'all 0.4s'
            }}
            className="hover:shadow-lg group"
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--brand-navy)', marginBottom: '8px' }}>
                {calculation.materialName}
              </h3>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', opacity: 0.5, fontSize: '11px', fontWeight: 700 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={12} /> {new Date(calculation.date).toLocaleDateString('es-CL')}
                  </span>
                  <p style={{ fontSize: '11px', color: 'rgba(14, 31, 51, 0.4)', fontWeight: 700 }}>
                    {calculation.area.toFixed(1)} m² • {calculation.unitsWithExtra} unidades x {formatCurrency(calculation.pricePerUnit)} • {' '}
                    <span style={{ color: 'var(--brand-blue)' }}>{formatCurrency(calculation.totalCostWithExtra)}</span>
                  </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => onViewCalculation(calculation)}
                style={{ 
                    padding: '12px 25px', 
                    backgroundColor: 'var(--brand-navy)', 
                    color: 'white', 
                    borderRadius: '8px', 
                    border: 'none', 
                    fontSize: '9px', 
                    fontWeight: 900, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
              >
                REVISAR <Eye size={14} />
              </button>
              <button
                onClick={() => onDeleteCalculation(calculation.id)}
                style={{ 
                    width: '40px', height: '40px', 
                    backgroundColor: 'transparent', 
                    color: '#EF4444', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(239, 68, 68, 0.1)', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        
        {calculations.length > 5 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, opacity: 0.3 }}>
                MOSTRANDO LOS ÚLTIMOS 5 CÁLCULOS DE UN TOTAL DE {calculations.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedCalculations;