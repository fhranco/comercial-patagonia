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
    defaultPrice: 6390,
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
    defaultPrice: 6790,
    unitType: 'volume',
    description: 'Cemento secado rápido, saco de 25 kilos, rendimiento 0.06 m³',
    tips: [
      'Fraguado más rápido que el cemento normal',
      'Perfecto para clima patagónico con cambios bruscos',
      'Mayor resistencia inicial'
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
    defaultPrice: 14850,
    unitType: 'area',
    description: 'Cerámica para piso formato 31x53cm, rendimiento 1.65 m² por caja',
    tips: ['Considerar 10% extra para cortes y ajustes']
  },
  {
    id: 'ceramica_piso_56x56',
    name: 'Cerámica Piso 56x56cm',
    category: 'ceramics',
    icon: 'Square',
    unit: 'caja',
    defaultRendimiento: 2.0,
    defaultPrice: 19590,
    unitType: 'area',
    description: 'Cerámica para piso formato 56x56cm, rendimiento 2.0 m² por caja',
    tips: ['Considerar 10% extra para cortes y ajustes']
  },
  {
    id: 'ceramica_piso_18x56',
    name: 'Cerámica Piso 18x56cm',
    category: 'ceramics',
    icon: 'Square',
    unit: 'caja',
    defaultRendimiento: 1.65,
    defaultPrice: 21560,
    unitType: 'area',
    description: 'Cerámica para piso formato 18x56cm, rendimiento 1.65 m² por caja',
    tips: ['Formato tipo tabla para pisos de alta estética']
  },
  {
    id: 'ceramica_muro_25x35',
    name: 'Cerámica Muro 25x35cm',
    category: 'ceramics',
    icon: 'Square',
    unit: 'caja',
    defaultRendimiento: 1.65,
    defaultPrice: 20500,
    unitType: 'area',
    description: 'Cerámica para muro formato 25x35cm, rendimiento 1.65 m² por caja',
    tips: ['Resistente a la humedad extrema, ideal para baños y cocinas']
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
    tips: ['Resistente a vientos patagónicos certificados'],
    sheetWidth: 1.09,
    sheetLength: 2.5
  },
  {
    id: 'plancha_zincalum_3_6m',
    name: 'Plancha Zinc-Alum 0.4mm x 3.66m',
    category: 'roofing',
    icon: 'Home',
    unit: 'plancha',
    defaultRendimiento: 3.2,
    defaultPrice: 24500,
    unitType: 'area',
    description: 'Plancha de zinc-alum ondulada de 3.66m, alta resistencia a la corrosión.',
    tips: ['Ideal para naves industriales y galpones en zonas costeras.'],
    sheetWidth: 0.9,
    sheetLength: 3.66
  },
  {
    id: 'fieltro_asfaltico_40_10',
    name: 'Fieltro Asfáltico 40/10',
    category: 'roofing',
    icon: 'Scroll',
    unit: 'rollo',
    defaultRendimiento: 40,
    defaultPrice: 28900,
    unitType: 'area',
    description: 'Fieltro asfáltico para impermeabilización de techumbres, rollo de 40m².',
    tips: ['Barrera esencial contra la humedad antes de instalar la plancha.']
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