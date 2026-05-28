import { Material, Calculation } from '../types/materials';

export const calculateArea = (largo: number, ancho: number): number => {
  return largo * ancho;
};

export const calculateShedRoofArea = (largo: number, ancho: number, alto: number): number => {
  // Techo a un agua: L * sqrt(W^2 + H^2)
  return largo * Math.sqrt(Math.pow(ancho, 2) + Math.pow(alto, 2));
};

export const calculateGabledRoofArea = (largo: number, ancho: number, alto: number): number => {
  // Techo a dos aguas: L * sqrt(W^2 + (2*H)^2)
  return largo * Math.sqrt(Math.pow(ancho, 2) + Math.pow(2 * alto, 2));
};

export const calculateHipRoofArea = (largo: number, ancho: number, alto: number): number => {
  // Techo a cuatro aguas: matemáticamente equivalente al área de dos aguas para pendientes uniformes,
  // pero el desperdicio práctico recomendado en el UI es del 18-20% para cortes a inglete.
  return largo * Math.sqrt(Math.pow(ancho, 2) + Math.pow(2 * alto, 2));
};

export const calculateFlatRoofArea = (largo: number, ancho: number): number => {
  // Techo plano o pendiente mínima
  return largo * ancho;
};

export const calculateRoofArea = (
  largo: number,
  ancho: number,
  alto: number,
  type: 'gabled' | 'shed' | 'hip' | 'flat' = 'gabled'
): number => {
  switch (type) {
    case 'shed':
      return calculateShedRoofArea(largo, ancho, alto);
    case 'hip':
      return calculateHipRoofArea(largo, ancho, alto);
    case 'flat':
      return calculateFlatRoofArea(largo, ancho);
    case 'gabled':
    default:
      return calculateGabledRoofArea(largo, ancho, alto);
  }
};

export const calculateSheetsNeeded = (
  roofArea: number,
  sheetWidth: number,
  sheetLength: number,
  lateralOverlapCm: number = 9,
  longitudinalOverlapCm: number = 20
): {
  usefulAreaPerSheet: number;
  exactSheets: number;
  sheetsNeeded: number;
} => {
  const usefulWidth = sheetWidth - (lateralOverlapCm / 100);
  const usefulLength = sheetLength - (longitudinalOverlapCm / 100);
  const usefulAreaPerSheet = Math.max(0.01, usefulWidth * usefulLength);
  const exactSheets = roofArea / usefulAreaPerSheet;
  return {
    usefulAreaPerSheet,
    exactSheets,
    sheetsNeeded: Math.ceil(exactSheets)
  };
};

export const calculateVolume = (largo: number, ancho: number, alto: number): number => {
  return largo * ancho * alto;
};

export const convertMetersToFeet = (meters: number): number => {
  return meters * 3.28084;
};

export const convertFeetToMeters = (feet: number): number => {
  return feet / 3.28084;
};

export const calculateMaterialNeeds = (
  material: Material,
  area: number,
  volume: number | undefined,
  rendimiento: number,
  pricePerUnit: number,
  extraPercentage: number = 10
): {
  unitsNeeded: number;
  unitsWithExtra: number;
  totalCost: number;
  totalCostWithExtra: number;
} => {
  const measureToUse = material.unitType === 'volume' ? (volume || 0) : area;
  const exactUnits = measureToUse / rendimiento;
  const unitsNeeded = Math.ceil(exactUnits);
  const unitsWithExtra = Math.ceil(exactUnits * (1 + extraPercentage / 100));
  
  const totalCost = unitsNeeded * pricePerUnit;
  const totalCostWithExtra = unitsWithExtra * pricePerUnit;

  return {
    unitsNeeded,
    unitsWithExtra,
    totalCost,
    totalCostWithExtra
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount);
};

export const generateCalculationId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};