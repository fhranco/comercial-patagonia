import { Material } from '../types/materials';

export const materials: Material[] = [
  // CEMENTOS
  {
    id: 'cemento_normal',
    name: 'Cemento Secado Normal',
    category: 'cement',
    icon: 'Package',
    unit: 'saco',
    defaultRendimiento: 0.06, 
    defaultPrice: 4990,
    unitType: 'volume',
    description: 'Cemento secado normal, saco de 25 kilos, rendimiento 0.06 m³',
    tips: [
      'Un saco de 25kg rinde exactamente 0.06 m³ de concreto',
      'Ideal para construcción general y obras menores',
      'Almacenar en lugar seco y elevado del suelo'
    ]
  },
  {
    id: 'cemento_rapido',
    name: 'Cemento Secado Rápido',
    category: 'cement',
    icon: 'Package',
    unit: 'saco',
    defaultRendimiento: 0.06,
    defaultPrice: 5490,
    unitType: 'volume',
    description: 'Cemento secado rápido, saco de 25 kilos, rendimiento 0.06 m³',
    tips: [
      'Fraguado más rápido que el cemento normal',
      'Perfecto para clima patagónico con cambios bruscos',
      'Mayor resistencia inicial'
    ]
  },

  // ÁRIDOS
  {
    id: 'arena_gruesa',
    name: 'Arena Gruesa Planta',
    category: 'aggregates',
    icon: 'Activity',
    unit: 'm³',
    defaultRendimiento: 1,
    defaultPrice: 28500,
    unitType: 'volume',
    description: 'Arena gruesa de planta, ideal para mezclas de hormigón y mortero.',
    tips: [
      'Material base para cualquier mezcla de construcción.',
      'En Magallanes, considerar el acopio protegido del viento.'
    ]
  },
  {
    id: 'gravilla_limpia',
    name: 'Gravilla Limpia 3/4',
    category: 'aggregates',
    icon: 'Activity',
    unit: 'm³',
    defaultRendimiento: 1,
    defaultPrice: 32000,
    unitType: 'volume',
    description: 'Gravilla seleccionada para drenajes y hormigón estructural.',
    tips: [
      'Rendimiento directo por volumen excavado.',
      'Excelente capacidad de drenaje en terrenos húmedos.'
    ]
  },

  // CERÁMICAS (PISO Y MURO)
  {
    id: 'ceramica_piso_31x53',
    name: 'Cerámica Piso 31x53cm',
    category: 'ceramics',
    icon: 'Square',
    unit: 'caja',
    defaultRendimiento: 1.65,
    defaultPrice: 13900,
    unitType: 'area',
    description: 'Cerámica para piso formato 31x53cm, rendimiento 1.65 m² por caja',
    tips: ['Considerar 10% extra para cortes y ajustes']
  },
  {
    id: 'ceramica_muro_31x53',
    name: 'Cerámica Muro 31x53cm',
    category: 'ceramics',
    icon: 'Square',
    unit: 'caja',
    defaultRendimiento: 1.65,
    defaultPrice: 18900,
    unitType: 'area',
    description: 'Cerámica para muro formato 31x53cm, rendimiento 1.65 m² por caja',
    tips: ['Resistente a la humedad extrema']
  },
  {
    id: 'porcelanato_53x53',
    name: 'Porcelanato 53x53cm',
    category: 'ceramics',
    icon: 'Square',
    unit: 'caja',
    defaultRendimiento: 2.0,
    defaultPrice: 28900,
    unitType: 'area',
    description: 'Porcelanato formato 53x53cm, rendimiento 2.0 m² por caja',
    tips: ['Material de alta resistencia y durabilidad premium']
  },

  // TECHUMBRES
  {
    id: 'plancha_techo_2_5m',
    name: 'Plancha Techo 1.09x2.5m',
    category: 'roofing',
    icon: 'Home',
    unit: 'plancha',
    defaultRendimiento: 2.725,
    defaultPrice: 18600,
    unitType: 'area',
    description: 'Plancha de techo 1.09x2.5m, cobertura 2.725 m² por plancha',
    tips: ['Resistente a vientos patagónicos certificados']
  },

  // TABIQUERÍA (YESO)
  {
    id: 'yeso_10mm_std',
    name: 'Plancha Yeso 10mm Standard',
    category: 'drywall',
    icon: 'Square',
    unit: 'plancha',
    defaultRendimiento: 2.88,
    defaultPrice: 9490,
    unitType: 'area',
    description: 'Plancha yeso cartón 10mm standard 1.20x2.40m',
    tips: ['Ideal para tabiques livianos interiores']
  },
  {
    id: 'yeso_12_5mm_rh',
    name: 'Plancha Yeso 12.5mm RH',
    category: 'drywall',
    icon: 'Square',
    unit: 'plancha',
    defaultRendimiento: 2.88,
    defaultPrice: 17390,
    unitType: 'area',
    description: 'Plancha yeso cartón 12.5mm RH (Resistente Humedad)',
    tips: ['Obligatorio en baños y zonas húmedas']
  },
  // DORMITORIOS
  {
    id: 'piso_flotante_premium',
    name: 'Piso Flotante Premium 8mm',
    category: 'dormitorios',
    icon: 'Layers',
    unit: 'caja',
    defaultRendimiento: 2.4,
    defaultPrice: 32500,
    unitType: 'area',
    description: 'Piso laminado de alta resistencia, ideal para dormitorios y áreas secas.',
    tips: ['Instalar sobre espuma niveladora patagónica']
  }
];