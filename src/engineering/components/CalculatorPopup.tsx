import React, { useState, useEffect } from 'react';
import { X, Calculator, Ruler, Settings, DollarSign, Save, Share2, AlertTriangle, ChevronRight } from 'lucide-react';
import { Material, Calculation } from '@/engineering/types/materials';
import { calculateArea, calculateVolume, calculateMaterialNeeds, formatCurrency } from '@/engineering/utils/calculations';

interface CalculatorPopupProps {
  material: Material | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCalculation: (calculation: Calculation) => void;
}

const CalculatorPopup: React.FC<CalculatorPopupProps> = ({
  material,
  isOpen,
  onClose,
  onSaveCalculation
}) => {
  const [largo, setLargo] = useState<number>(0);
  const [ancho, setAncho] = useState<number>(0);
  const [alto, setAlto] = useState<number>(0);
  
  // Local string states for better typing experience
  const [largoStr, setLargoStr] = useState('0');
  const [anchoStr, setAnchoStr] = useState('0');
  const [altoStr, setAltoStr] = useState('0');

  const [rendimiento, setRendimiento] = useState<number>(0);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [extraPercentage, setExtraPercentage] = useState<number>(10);
  const [unit, setUnit] = useState<'metros' | 'pies'>('metros');

  useEffect(() => {
    if (material) {
      setRendimiento(material.defaultRendimiento);
      setPricePerUnit(material.defaultPrice);
    }
  }, [material]);

  useEffect(() => {
    if (!isOpen) {
      setLargo(0);
      setAncho(0);
      setAlto(0);
      setLargoStr('0');
      setAnchoStr('0');
      setAltoStr('0');
      setUnit('metros');
    }
  }, [isOpen]);

  if (!isOpen || !material) return null;

  const area = calculateArea(largo, ancho);
  const volume = material.unitType === 'volume' ? calculateVolume(largo, ancho, alto) : undefined;

  const materialNeeds = calculateMaterialNeeds(
    material,
    area,
    volume,
    rendimiento,
    pricePerUnit,
    extraPercentage
  );

  const convertValue = (value: number, fromMeters: boolean): number => {
    if (unit === 'metros') return value;
    return fromMeters ? value * 3.28084 : value / 3.28084;
  };

  const handleInputChange = (value: string, setVal: (n: number) => void, setStr: (s: string) => void) => {
    setStr(value);
    const numValue = parseFloat(value) || 0;
    const metricValue = unit === 'pies' ? numValue / 3.28084 : numValue;
    setVal(metricValue);
  };

  const handleSave = () => {
    if (area === 0) return;
    const calculation: Calculation = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      materialId: material.id,
      materialName: material.name,
      area,
      volume,
      largo,
      ancho,
      alto,
      rendimiento,
      pricePerUnit,
      unitsNeeded: materialNeeds.unitsNeeded,
      unitsWithExtra: materialNeeds.unitsWithExtra,
      totalCost: materialNeeds.totalCost,
      totalCostWithExtra: materialNeeds.totalCostWithExtra,
      extraPercentage,
      date: new Date().toISOString()
    };
    onSaveCalculation(calculation);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(14, 31, 51, 0.4)', backdropFilter: 'blur(20px)' }}>
      <div style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: '1000px', borderRadius: '40px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '100vh', height: '100%', boxShadow: '0 50px 100px rgba(0,0,0,0.2)' }} className="rounded-none sm:rounded-[40px] sm:h-auto sm:max-h-[95vh]">
        
        {/* 🏔️ HEADER DE CONTROL */}
        <div style={{ padding: '25px', backgroundColor: 'var(--brand-navy)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="sm:p-[40px_50px]">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className="sm:gap-[20px]">
                <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }} className="sm:w-[56px] sm:h-[56px]">
                    <Calculator className="w-5 h-5 text-[var(--brand-yellow)] sm:w-6 sm:h-6" />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-heading)' }} className="sm:text-[1.5rem]">
                        Cálculo: {material.name}
                    </h2>
                    <p style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        Región de Magallanes B2B Edition
                    </p>
                </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5 }}>
                <X size={24} className="sm:w-[32px] sm:h-[32px]" />
            </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', overflowY: 'auto', paddingBottom: '100px' }} className="sm:grid-cols-2 sm:pb-0 no-scrollbar">
            
            {/* 🏗️ LADO DE INPUTS */}
            <div style={{ padding: '25px', borderBottom: '1px solid rgba(14, 31, 51, 0.05)' }} className="sm:p-[50px] sm:border-b-0 sm:border-r">
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--brand-navy)', borderLeft: '4px solid var(--brand-blue)', paddingLeft: '15px' }}>
                            Dimensiones del Proyecto
                        </h3>
                        <div style={{ backgroundColor: '#F4F7FA', padding: '4px', borderRadius: '100px', display: 'flex', gap: '5px' }}>
                            <button onClick={() => setUnit('metros')} style={{ padding: '8px 16px', borderRadius: '100px', fontSize: '10px', fontWeight: 900, border: 'none', cursor: 'pointer', backgroundColor: unit === 'metros' ? 'white' : 'transparent', color: unit === 'metros' ? 'var(--brand-navy)' : 'rgba(0,0,0,0.4)', boxShadow: unit === 'metros' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}>METROS</button>
                            <button onClick={() => setUnit('pies')} style={{ padding: '8px 16px', borderRadius: '100px', fontSize: '10px', fontWeight: 900, border: 'none', cursor: 'pointer', backgroundColor: unit === 'pies' ? 'white' : 'transparent', color: unit === 'pies' ? 'var(--brand-navy)' : 'rgba(0,0,0,0.4)', boxShadow: unit === 'pies' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}>PIES</button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'block' }}>
                            <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '10px' }}>Largo ({unit})</label>
                            <input 
                              type="number" 
                              step="0.1"
                              inputMode="decimal"
                              value={largoStr} 
                              onChange={(e) => handleInputChange(e.target.value, setLargo, setLargoStr)} 
                              style={{ width: '100%', padding: '20px', backgroundColor: '#F4F7FA', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-navy)', outline: 'none' }} 
                            />
                        </div>
                        <div style={{ display: 'block' }}>
                             <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '10px' }}>Ancho ({unit})</label>
                             <input 
                              type="number" 
                              step="0.1"
                              inputMode="decimal"
                              value={anchoStr} 
                              onChange={(e) => handleInputChange(e.target.value, setAncho, setAnchoStr)} 
                              style={{ width: '100%', padding: '20px', backgroundColor: '#F4F7FA', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-navy)', outline: 'none' }} 
                             />
                        </div>
                        {material.unitType === 'volume' && (
                             <div style={{ display: 'block' }}>
                                 <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '10px' }}>Alto ({material.id.includes('cemento') ? 'cm' : unit})</label>
                                 <input 
                                  type="number" 
                                  step="0.1"
                                  inputMode="decimal"
                                  value={altoStr} 
                                  onChange={(e) => {
                                      const val = e.target.value;
                                      setAltoStr(val);
                                      const numValue = parseFloat(val) || 0;
                                      if (material.id.includes('cemento')) setAlto(numValue / 100);
                                      else setAlto(unit === 'pies' ? numValue / 3.28084 : numValue);
                                  }} 
                                  style={{ width: '100%', padding: '20px', backgroundColor: '#F4F7FA', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-navy)', outline: 'none' }} 
                                 />
                             </div>
                        )}
                    </div>
                </div>

                <div>
                     <h3 style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--brand-navy)', borderLeft: '4px solid var(--brand-blue)', paddingLeft: '15px', marginBottom: '25px' }}>
                        Parámetros de Obra
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '10px' }}>% Desperdicio</label>
                            <input type="number" value={extraPercentage} onChange={(e) => setExtraPercentage(Number(e.target.value))} style={{ width: '100%', padding: '15px', backgroundColor: '#F4F7FA', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700 }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '10px' }}>Rendimiento</label>
                            <input type="number" value={rendimiento} onChange={(e) => setRendimiento(Number(e.target.value))} style={{ width: '100%', padding: '15px', backgroundColor: '#F4F7FA', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 📊 LADO DE RESULTADOS */}
            <div style={{ padding: '25px', backgroundColor: '#FAFBFC' }} className="sm:p-[50px]">
                <div style={{ marginBottom: '40px' }} className="sm:mb-[50px]">
                     <h3 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--brand-navy)', opacity: 0.4, letterSpacing: '0.2em', marginBottom: '20px' }}>
                        Resumen Técnico
                    </h3>
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(14, 31, 51, 0.03)' }} className="sm:p-[40px]">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #F0F0F0', paddingBottom: '15px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(0,0,0,0.5)' }}>Área Proyectada</span>
                            <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--brand-navy)' }}>{area.toFixed(2)} m²</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', borderBottom: '1px solid #F0F0F0', paddingBottom: '15px' }} className="sm:mb-[30px]">
                            <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(0,0,0,0.5)' }}>Precio unitario</span>
                            <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--brand-blue)' }}>{formatCurrency(pricePerUnit)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <div>
                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--brand-blue)', marginBottom: '5px' }}>Sugerido</p>
                                <p style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--brand-navy)', lineHeight: 1 }} className="sm:text-[2.2rem]">
                                    {materialNeeds.unitsWithExtra} <span style={{ fontSize: '1rem', fontWeight: 600, opacity: 0.4 }}>{material.unit}s</span>
                                </p>
                            </div>
                        </div>
                        <div style={{ backgroundColor: 'var(--brand-navy)', padding: '20px', borderRadius: '16px', color: 'white' }} className="sm:p-[30px]">
                            <p style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.1em', marginBottom: '5px' }}>Total Estimado</p>
                            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--brand-yellow)' }} className="sm:text-[2rem]">
                                {formatCurrency(materialNeeds.totalCostWithExtra)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 📱 MOBILE PERSISTENT ACTIONS */}
                <div style={{ 
                    position: 'fixed', bottom: 0, left: 0, right: 0, 
                    backgroundColor: 'white', padding: '20px', 
                    borderTop: '1px solid rgba(0,0,0,0.1)',
                    display: 'flex', gap: '10px', zIndex: 6000
                }} className="sm:static sm:p-0 sm:bg-transparent sm:border-0 sm:flex-col sm:gap-[15px]">
                    <button onClick={handleSave} style={{ flex: 2, padding: '20px', backgroundColor: 'var(--brand-blue)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} className="sm:w-100 sm:p-[24px]">
                        <Save size={18} /> GUARDAR
                    </button>
                    <button style={{ flex: 1, padding: '18px', backgroundColor: 'transparent', color: 'var(--brand-navy)', border: '1px solid rgba(14, 31, 51, 0.1)', borderRadius: '12px', fontSize: '0px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="sm:fontSize-10 sm:p-[20px] sm:w-100">
                        <Share2 size={16} /> <span className="hidden sm:inline" style={{ marginLeft: '10px', fontSize: '10px' }}>COMPARTIR</span>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPopup;