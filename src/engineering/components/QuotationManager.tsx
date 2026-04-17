import React, { useState } from 'react';
import { FileText, Save, Trash2, Send, MessageCircle, User, Phone, Mail, FolderOpen } from 'lucide-react';
import { Calculation } from '@/engineering/types/materials';
import { formatCurrency } from '@/engineering/utils/calculations';

interface QuotationManagerProps {
  calculations: Calculation[];
  onClearCalculations: () => void;
}

const QuotationManager: React.FC<QuotationManagerProps> = ({
  calculations,
  onClearCalculations
}) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const totalCost = calculations.reduce((sum, calc) => sum + calc.totalCostWithExtra, 0);

  const handleSendWhatsApp = () => {
    if (!projectName.trim() || !clientName.trim() || !clientPhone.trim()) {
      alert('Por favor complete los campos obligatorios (*)');
      return;
    }

    const message = `
*--- COTIZACIÓN PROFESIONAL ---*
*Comercial de la Patagonia B2B*

*PROYECTO:* ${projectName}
*CLIENTE:* ${clientName}
*FECHA:* ${new Date().toLocaleDateString('es-CL')}

*MATERIALES COTIZADOS:*
${calculations.map((item, index) => `
${index + 1}. *${item.materialName}*
   - Cantidad: ${item.unitsWithExtra} unidades
   - Subtotal: ${formatCurrency(item.totalCostWithExtra)}
`).join('')}

*TOTAL ESTIMADO: ${formatCurrency(totalCost)}*

_Nota: Precios referenciales sujetos a stock y logística regional._
    `.trim();

    const whatsappLink = `https://wa.me/56985806127?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
    setShowShareDialog(false);
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <FolderOpen className="text-[var(--brand-blue)]" /> RESUMEN DE PROYECTO
            </h2>
            <p style={{ fontSize: '13px', opacity: 0.5, marginTop: '5px' }}>
                Gestión avanzada de materiales y presupuestos técnicos
            </p>
        </div>
        <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '10px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Monto consolidado</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--brand-blue)', lineHeight: 1 }}>
                {formatCurrency(totalCost)}
            </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '15px', marginBottom: '40px' }}>
        {calculations.map((calc) => (
            <div key={calc.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '20px 30px', 
                backgroundColor: '#F9FAFB', 
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.03)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--brand-yellow)', borderRadius: '50%' }} />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-navy)' }}>{calc.materialName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', fontWeight: 900, color: 'var(--brand-navy)' }}>{formatCurrency(calc.totalCostWithExtra)}</p>
                        <p style={{ fontSize: '9px', opacity: 0.4, fontWeight: 700 }}>{calc.unitsWithExtra} unid. x {formatCurrency(calc.pricePerUnit)}</p>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <button 
            onClick={() => setShowShareDialog(true)}
            style={{ 
                flex: 2, padding: '24px', backgroundColor: 'var(--brand-navy)', color: 'white', 
                borderRadius: '12px', border: 'none', fontWeight: 900, fontSize: '11px', 
                textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px',
                boxShadow: '0 20px 40px rgba(14, 31, 51, 0.2)'
            }}
        >
            <Send size={18} /> GENERAR COTIZACIÓN OFICIAL
        </button>
        <button 
            onClick={onClearCalculations}
            style={{ 
                flex: 1, padding: '24px', backgroundColor: 'transparent', color: '#EF4444', 
                borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 900, fontSize: '11px', 
                textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'
            }}
        >
            <Trash2 size={18} /> LIMPIAR
        </button>
      </div>

      {/* 🚀 DIALOG DE COMPARTIR PREMIUM */}
      {showShareDialog && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(14,31,51,0.5)', backdropFilter: 'blur(20px)', padding: '20px' }}>
              <div style={{ backgroundColor: '#FFF', width: '100%', maxWidth: '500px', borderRadius: '32px', padding: '50px', boxShadow: '0 50px 100px rgba(0,0,0,0.3)' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '30px', color: 'var(--brand-navy)' }}>Configurar Cotización</h3>
                  
                  <div style={{ display: 'grid', gap: '20px', marginBottom: '40px' }}>
                      <div className="group">
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px' }}>Nombre del Proyecto *</label>
                          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} style={{ width: '100%', padding: '15px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', fontSize: '14px' }} placeholder="Ej: Obra Puerto Natales" />
                      </div>
                      <div>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px' }}>Nombre Cliente *</label>
                          <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: '100%', padding: '15px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', fontSize: '14px' }} />
                      </div>
                      <div>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px' }}>Teléfono *</label>
                          <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} style={{ width: '100%', padding: '15px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', fontSize: '14px' }} />
                      </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <button 
                        onClick={handleSendWhatsApp}
                        style={{ padding: '24px', backgroundColor: '#25D366', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', cursor: 'pointer' }}
                      >
                          <MessageCircle size={20} /> ENVIAR POR WHATSAPP
                      </button>
                      <button 
                        onClick={() => setShowShareDialog(false)}
                        style={{ padding: '15px', background: 'none', border: 'none', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', opacity: 0.4, cursor: 'pointer' }}
                      >
                          CANCELAR
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default QuotationManager;