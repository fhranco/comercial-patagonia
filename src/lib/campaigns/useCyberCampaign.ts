"use client";

import { useSyncExternalStore } from "react";
import {
  CYBER_CAMPAIGN_CONFIG,
  CyberCampaignState,
  getCyberCampaignState,
  calculateTimeRemaining,
  TimeRemaining
} from "./cyber";

const emptySubscribe = () => () => {};

export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function subscribeToClock(callback: () => void) {
  const interval = setInterval(callback, 1000);
  return () => clearInterval(interval);
}

function getClientTimeSnapshot(): number {
  return Date.now();
}

function getServerTimeSnapshot(): number {
  return Date.now();
}

export interface CyberCampaignHookResult {
  isClient: boolean;
  state: CyberCampaignState;
  isPreStart: boolean;
  isActive: boolean;
  isEnded: boolean;
  isVisible: boolean;
  timeLeft: TimeRemaining;
  categoryUrl: string;
}

/**
 * Hook reactivo para el ciclo de vida de la Campaña Cyber Monday 2026.
 * Usa useSyncExternalStore para total compatibilidad SSR/React 19 y cero cascading renders.
 * Permite SSR para SEO y pre-renderizado del banner y productos sin layout shifts.
 * Basado estrictamente en reloj real y fechas oficiales de CYBER_CAMPAIGN_CONFIG.
 */
export function useCyberCampaign(): CyberCampaignHookResult {
  const isClient = useIsClient();
  const now = useSyncExternalStore(
    subscribeToClock,
    getClientTimeSnapshot,
    getServerTimeSnapshot
  );

  const state = getCyberCampaignState(now);
  const isPreStart = state === "PRE_START";
  const isActive = state === "ACTIVE";
  const isEnded = state === "ENDED";
  const isVisible = !isEnded && CYBER_CAMPAIGN_CONFIG.enabled;

  const targetTime = isPreStart
    ? new Date(CYBER_CAMPAIGN_CONFIG.startAt).getTime()
    : new Date(CYBER_CAMPAIGN_CONFIG.endAt).getTime();

  const timeLeft = calculateTimeRemaining(targetTime, now);

  return {
    isClient,
    state,
    isPreStart,
    isActive,
    isEnded,
    isVisible,
    timeLeft,
    categoryUrl: `/tienda?category=${CYBER_CAMPAIGN_CONFIG.categorySlug}`
  };
}
