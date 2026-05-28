import React, { useState, useEffect } from 'react';
import { X, Calculator, Ruler, Settings, DollarSign, Save, Share2, AlertTriangle, ChevronRight } from 'lucide-react';
import { Material, Calculation } from '@/engineering/types/materials';
import { calculateArea, calculateRoofArea, calculateVolume, calculateMaterialNeeds, formatCurrency, calculateSheetsNeeded } from '@/engineering/utils/calculations';

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

  // Advanced Roofing States
  const [roofType, setRoofType] = useState<'gabled' | 'shed' | 'hip' | 'flat'>('gabled');
  const [lateralOverlap, setLateralOverlap] = useState<number>(9); // default 9cm lateral overlap
  const [longitudinalOverlap, setLongitudinalOverlap] = useState<number>(20); // default 20cm longitudinal overlap

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
      setRoofType('gabled');
      setLateralOverlap(9);
      setLongitudinalOverlap(20);
    }
  }, [isOpen]);

  // Dynamically recommend waste margin depending on the roof style
  useEffect(() => {
    if (material && material.category === 'roofing') {
      if (roofType === 'gabled') setExtraPercentage(10);
      else if (roofType === 'shed') setExtraPercentage(8);
      else if (roofType === 'hip') setExtraPercentage(18); // complex hip cuts require more waste
      else if (roofType === 'flat') setExtraPercentage(5);
    }
  }, [roofType, material]);

  const isSheetBased = !!(material && material.category === 'roofing' && material.sheetWidth && material.sheetLength);

  const area = (material && material.category === 'roofing') 
    ? calculateRoofArea(largo, ancho, alto, roofType)
    : calculateArea(largo, ancho);
    
  const volume = (material && material.unitType === 'volume') ? calculateVolume(largo, ancho, alto) : undefined;

  const sheetInfo = (material && material.sheetWidth && material.sheetLength)
    ? calculateSheetsNeeded(area, material.sheetWidth, material.sheetLength, lateralOverlap, longitudinalOverlap)
    : { usefulAreaPerSheet: 0, exactSheets: 0, sheetsNeeded: 0 };

  const finalRendimiento = isSheetBased ? sheetInfo.usefulAreaPerSheet : rendimiento;

  const materialNeeds = material ? calculateMaterialNeeds(
    material,
    area,
    volume,
    finalRendimiento,
    pricePerUnit,
    extraPercentage
  ) : { unitsNeeded: 0, unitsWithExtra: 0, totalCost: 0, totalCostWithExtra: 0 };

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

  const handleSave = React.useCallback(() => {
    if (!material || area === 0) return;
    const calculation: Calculation = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      materialId: material.id,
      materialName: material.name,
      area,
      volume,
      largo,
      ancho,
      alto: material.category === 'roofing' && roofType === 'flat' ? undefined : alto,
      rendimiento: finalRendimiento,
      pricePerUnit,
      unitsNeeded: materialNeeds.unitsNeeded,
      unitsWithExtra: materialNeeds.unitsWithExtra,
      totalCost: materialNeeds.totalCost,
      totalCostWithExtra: materialNeeds.totalCostWithExtra,
      extraPercentage,
      date: new Date().toISOString(),
      roofType: material.category === 'roofing' ? roofType : undefined,
      lateralOverlap: isSheetBased ? lateralOverlap : undefined,
      longitudinalOverlap: isSheetBased ? longitudinalOverlap : undefined,
      usefulAreaPerSheet: isSheetBased ? sheetInfo.usefulAreaPerSheet : undefined
    };
    onSaveCalculation(calculation);
    onClose();
  }, [
    area,
    material,
    volume,
    largo,
    ancho,
    alto,
    finalRendimiento,
    pricePerUnit,
    materialNeeds,
    extraPercentage,
    onSaveCalculation,
    onClose,
    roofType,
    isSheetBased,
    lateralOverlap,
    longitudinalOverlap,
    sheetInfo.usefulAreaPerSheet
  ]);

  if (!isOpen || !material) return null;

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

                    {material.category === 'roofing' && (
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '10px' }}>
                                Diseño del Techo (Cálculo Geométrico)
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                {[
                                    { id: 'gabled', name: 'Dos Aguas (Gabled)' },
                                    { id: 'shed', name: 'Un Agua (Shed)' },
                                    { id: 'hip', name: 'Cuatro Aguas (Hip)' },
                                    { id: 'flat', name: 'Plano (Flat / Low Slope)' }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setRoofType(type.id as any)}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            border: roofType === type.id ? '2px solid var(--brand-blue)' : '1px solid rgba(14, 31, 51, 0.1)',
                                            backgroundColor: roofType === type.id ? 'rgba(37, 99, 235, 0.05)' : 'white',
                                            color: 'var(--brand-navy)',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {type.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gap: '20px', marginBottom: '25px' }}>
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
                        {(material.unitType === 'volume' || (material.category === 'roofing' && roofType !== 'flat')) && (
                             <div style={{ display: 'block' }}>
                                 <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '10px' }}>
                                    {material.category === 'roofing' ? 'Altura Cumbrera (m)' : (material.id.includes('cemento') ? 'Espesor (cm)' : `Alto (${unit})`)}
                                 </label>
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

                    {isSheetBased && (
                        <div style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid rgba(14, 31, 51, 0.05)' }}>
                            <h4 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--brand-navy)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Settings size={12} className="text-[var(--brand-blue)]" /> TRASLAPES DE PLANCHAS
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px' }}>Traslape Lateral (cm)</label>
                                    <input
                                        type="number"
                                        value={lateralOverlap}
                                        onChange={(e) => setLateralOverlap(Number(e.target.value) || 0)}
                                        style={{ width: '100%', padding: '12px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px' }}>Traslape Long. (cm)</label>
                                    <input
                                        type="number"
                                        value={longitudinalOverlap}
                                        onChange={(e) => setLongitudinalOverlap(Number(e.target.value) || 0)}
                                        style={{ width: '100%', padding: '12px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '10px', color: 'rgba(0,0,0,0.6)' }}>
                                <p style={{ margin: 0, lineHeight: 1.4 }}>
                                    📏 <strong>Ficha Técnica de Cobertura:</strong><br />
                                    • Dimensiones Brutas: <strong>{material.sheetWidth}m × {material.sheetLength}m</strong> ({material.defaultRendimiento.toFixed(3)} m²)<br />
                                    • Área Útil de Cobertura Real: <strong style={{ color: 'var(--brand-blue)' }}>{sheetInfo.usefulAreaPerSheet.toFixed(3)} m²</strong> por plancha (restado traslapes).
                                </p>
                            </div>
                        </div>
                    )}
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
                            <input 
                              type="number" 
                              value={finalRendimiento} 
                              disabled={isSheetBased} 
                              onChange={(e) => setRendimiento(Number(e.target.value))} 
                              style={{ width: '100%', padding: '15px', backgroundColor: '#F4F7FA', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, opacity: isSheetBased ? 0.6 : 1 }} 
                            />
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
                        {volume !== undefined && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #F0F0F0', paddingBottom: '15px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(0,0,0,0.5)' }}>Volumen Proyectado</span>
                                <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--brand-navy)' }}>{volume.toFixed(3)} m³</span>
                            </div>
                        )}
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