"use client";

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import '@/engineering/engineering.css';
import Header from '@/engineering/components/Header';
import MaterialSelector from '@/engineering/components/MaterialSelector';
import CalculatorPopup from '@/engineering/components/CalculatorPopup';
import SavedCalculations from '@/engineering/components/SavedCalculations';
import QuotationManager from '@/engineering/components/QuotationManager';
import TipsSection from '@/engineering/components/TipsSection';
import { materials } from '@/engineering/data/materials';
import { Material, Calculation } from '@/engineering/types/materials';

export default function CalculatorPage() {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [savedCalculations, setSavedCalculations] = useState<Calculation[]>([]);

  // Material seleccionado
  const selectedMaterial = selectedMaterialId 
    ? materials.find(m => m.id === selectedMaterialId) || null 
    : null;

  // Cargar cálculos guardados al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('patagonia-calculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  // Funciones de manejo
  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterialId(materialId);
    setShowCalculator(true);
  };

  const handleCloseCalculator = () => {
    setShowCalculator(false);
    setSelectedMaterialId(null);
  };

  const handleSaveCalculation = (calculation: Calculation) => {
    const updatedCalculations = [calculation, ...savedCalculations];
    setSavedCalculations(updatedCalculations);
    localStorage.setItem('patagonia-calculations', JSON.stringify(updatedCalculations));
    alert('Cálculo guardado exitosamente!');
  };

  const handleViewCalculation = (calculation: Calculation) => {
    setSelectedMaterialId(calculation.materialId);
    setShowCalculator(true);
  };

  const handleDeleteCalculation = (calculationId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cálculo?')) {
      const updatedCalculations = savedCalculations.filter(c => c.id !== calculationId);
      setSavedCalculations(updatedCalculations);
      localStorage.setItem('patagonia-calculations', JSON.stringify(updatedCalculations));
    }
  };

  const handleClearCalculations = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todos los cálculos actuales?')) {
      setSavedCalculations([]);
      localStorage.removeItem('patagonia-calculations');
    }
  };

  return (
    <main style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: 'initial' }}>
        <Navigation />
        
        <div style={{ paddingTop: '80px' }}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <Header />
                
                <div className="container mx-auto px-4 py-8 space-y-8">
                    <MaterialSelector
                        selectedMaterialId={selectedMaterialId}
                        onMaterialSelect={handleMaterialSelect}
                    />

                    <QuotationManager
                        calculations={savedCalculations}
                        onClearCalculations={handleClearCalculations}
                    />

                    <TipsSection selectedMaterial={selectedMaterial} />

                    <SavedCalculations
                        calculations={savedCalculations}
                        onViewCalculation={handleViewCalculation}
                        onDeleteCalculation={handleDeleteCalculation}
                    />
                </div>

                <CalculatorPopup
                    material={selectedMaterial}
                    isOpen={showCalculator}
                    onClose={handleCloseCalculator}
                    onSaveCalculation={handleSaveCalculation}
                />
            </div>
        </div>

        <Footer />
    </main>
  );
}
