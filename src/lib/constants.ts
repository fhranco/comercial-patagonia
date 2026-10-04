export const BRAND_CONFIG = {
  name: "Comercial de la Patagonia",
  whatsapp: "+56985806127",
  email: "contacto@comercialpatagonia.cl",
  address: "Punta Arenas, Chile",
  currency: "CLP",
  currencySymbol: "$",
  calculatorUrl: "https://calculadora.comercialpatagonia.cl",
};

/**
 * Configuración de campañas estacionales legacy (ej. Zanzini).
 * NOTA: La campaña Cyber Monday está centralizada de forma autónoma en
 * `@/lib/campaigns/cyber.ts` y `@/lib/campaigns/useCyberCampaign.ts`.
 */
export const CAMPAIGN_CONFIG = {
  activeCampaign: "none" as "zanzini_june" | "none",
};
