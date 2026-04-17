export interface Material {
  id: string;
  name: string;
  category: string;
  icon: string;
  unit: string;
  defaultRendimiento: number; // área/volumen que cubre una unidad
  defaultPrice: number; // precio por unidad en CLP
  unitType: 'area' | 'volume' | 'length';
  description: string;
  tips: string[];
}

export interface Calculation {
  id: string;
  materialId: string;
  materialName: string;
  area: number;
  volume?: number;
  largo: number;
  ancho: number;
  alto?: number;
  rendimiento: number;
  pricePerUnit: number;
  unitsNeeded: number;
  unitsWithExtra: number;
  totalCost: number;
  totalCostWithExtra: number;
  extraPercentage: number;
  date: string;
}

export interface SavedQuotation {
  id: string;
  projectName: string;
  clientName?: string;
  calculations: Calculation[];
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialCategory {
  id: string;
  name: string;
  materials: string[]; // IDs de materiales
}