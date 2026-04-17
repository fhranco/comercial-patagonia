import { Material, Calculation } from '../types/materials';

export const calculateArea = (largo: number, ancho: number): number => {
  return largo * ancho;
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