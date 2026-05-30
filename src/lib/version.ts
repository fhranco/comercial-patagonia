export const APP_VERSION = "v1.3.0";
export const APP_RELEASE_DATE = "2026-05-30";
export const APP_CHANGELOG = [
  {
    version: "v1.3.0",
    date: "2026-05-30",
    changes: [
      "Sincronización 100% en tiempo real del catálogo B2B con WooCommerce oficial.",
      "Remoción absoluta de base de datos y catálogos locales alternativos (Excel/JSON).",
      "Mitigación y cierre de vulnerabilidad crítica mediante API de cotización segura Server-Side (/api/orders).",
      "Activación nativa de optimización de imágenes (Next.js Image Engine) con compresión WebP automática para fotos WooCommerce.",
      "Resolución de advertencias de consola y carga de tamaños adaptados (sizes) para optimizar rendimiento.",
      "Establecimiento de contingencia segura para ignorar certificados SSL expirados exclusivamente en desarrollo local."
    ]
  },
  {
    version: "v1.2.2",
    date: "2026-05-04",
    changes: [
      "Integración de Logo Oficial en alta resolución (Header & Footer).",
      "Ajuste de tamaño de marca a 300px para mayor autoridad visual.",
      "Unificación de sistema QuickView (Vista Rápida) en toda la Home.",
      "Corrección de navegación en marquesina Radar de Equipamiento.",
      "Limpieza de categorías obsoletas (Fierros, Equipos).",
      "Sincronización de Mock Data con categorías reales de la tienda.",
      "Implementación de lógica de cálculo para Techumbres (Altura Cumbrera)."
    ]
  },
  {
    version: "v1.2.1",
    date: "2026-04-30",
    changes: [
      "Optimización de carga SPA.",
      "Corrección de estilos en ProductCard para móviles."
    ]
  }
];
