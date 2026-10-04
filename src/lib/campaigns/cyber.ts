/**
 * Configuración Central de la Campaña Cyber Monday 2026
 * Comercial de la Patagonia
 */

export interface CyberCampaignConfig {
  startAt: string; // ISO 8601 con offset -03:00 (America/Santiago)
  endAt: string;   // ISO 8601 con offset -03:00 (America/Santiago)
  timezone: string;
  categorySlug: string;
  categoryId: number;
  enabled: boolean;
  featuredLimit: number;
}

export const CYBER_CAMPAIGN_CONFIG: CyberCampaignConfig = {
  startAt: "2026-10-05T00:00:00-03:00",
  endAt: "2026-10-07T23:59:59-03:00",
  timezone: "America/Santiago",
  categorySlug: "cyberday",
  categoryId: 87,
  enabled: true,
  featuredLimit: 8,
};

export type CyberCampaignState = "PRE_START" | "ACTIVE" | "ENDED";

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

/**
 * Calcula el estado de la campaña en base a la fecha actual o suministrada.
 */
export function getCyberCampaignState(currentDate: Date | number = Date.now()): CyberCampaignState {
  if (!CYBER_CAMPAIGN_CONFIG.enabled) return "ENDED";

  const now = typeof currentDate === "number" ? currentDate : currentDate.getTime();
  const start = new Date(CYBER_CAMPAIGN_CONFIG.startAt).getTime();
  const end = new Date(CYBER_CAMPAIGN_CONFIG.endAt).getTime();

  if (now < start) {
    return "PRE_START";
  } else if (now <= end) {
    return "ACTIVE";
  } else {
    return "ENDED";
  }
}

/**
 * Calcula el desglose de tiempo restante hasta un objetivo.
 */
export function calculateTimeRemaining(targetTime: number, nowTime: number = Date.now()): TimeRemaining {
  const totalMs = Math.max(0, targetTime - nowTime);
  const seconds = Math.floor((totalMs / 1000) % 60);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, totalMs };
}
