"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { Clock, Flame } from "lucide-react";
import {
  CYBER_CAMPAIGN_CONFIG,
  CyberCampaignState,
  getCyberCampaignState,
  calculateTimeRemaining,
  TimeRemaining
} from "@/lib/campaigns/cyber";

interface CyberCountdownProps {
  onStateChange?: (state: CyberCampaignState) => void;
  className?: string;
}

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function CyberCountdown({ onStateChange, className = "" }: CyberCountdownProps) {
  const isClient = useIsClient();
  const [campaignState, setCampaignState] = useState<CyberCampaignState>("PRE_START");
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0
  });

  useEffect(() => {
    if (!isClient) return;

    const updateTimer = () => {
      const now = Date.now();
      const state = getCyberCampaignState(now);
      setCampaignState(state);
      onStateChange?.(state);

      if (state === "ENDED") {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
        return;
      }

      const targetTime = state === "PRE_START"
        ? new Date(CYBER_CAMPAIGN_CONFIG.startAt).getTime()
        : new Date(CYBER_CAMPAIGN_CONFIG.endAt).getTime();

      const remaining = calculateTimeRemaining(targetTime, now);
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isClient, onStateChange]);

  if (!isClient || campaignState === "ENDED") {
    return null;
  }

  const isActive = campaignState === "ACTIVE";

  return (
    <div className={`cyber-countdown-wrapper ${className}`}>
      <style jsx>{`
        .cyber-countdown-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .countdown-label-row {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #E2E8F0;
        }
        .countdown-label-text {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: ${isActive ? "#FF5C5C" : "var(--primary-gold, #D4AF37)"};
        }
        .countdown-timer-grid {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .time-card {
          background: rgba(14, 31, 51, 0.85);
          backdrop-filter: blur(15px);
          border: 1px solid ${isActive ? "rgba(255, 75, 75, 0.4)" : "rgba(212, 175, 55, 0.3)"};
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          padding: 10px 14px;
          min-width: 54px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .time-card:hover {
          transform: translateY(-2px);
          border-color: ${isActive ? "#FF4B4B" : "#FFD700"};
        }
        .time-number {
          font-size: clamp(20px, 3vw, 24px);
          font-weight: 1000;
          line-height: 1;
          color: #FFFFFF;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        .time-label {
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: ${isActive ? "#FFA8A8" : "#E2E8F0"};
          margin-top: 4px;
        }
        .colon-separator {
          font-size: 20px;
          font-weight: 900;
          color: ${isActive ? "#FF4B4B" : "var(--primary-gold, #D4AF37)"};
          opacity: 0.8;
          user-select: none;
        }
        @media (max-width: 640px) {
          .countdown-timer-grid {
            gap: 4px;
          }
          .time-card {
            padding: 8px 8px;
            min-width: 44px;
          }
          .time-number {
            font-size: 17px;
          }
          .time-label {
            font-size: 7px;
          }
          .colon-separator {
            font-size: 16px;
          }
        }
      `}</style>

      <div className="countdown-label-row">
        {isActive ? (
          <Flame size={13} className="animate-pulse" style={{ color: "#FF4B4B" }} />
        ) : (
          <Clock size={13} style={{ color: "var(--primary-gold, #D4AF37)" }} />
        )}
        <span className="countdown-label-text">
          {isActive ? "OFERTAS EN VIVO — TERMINA EN:" : "CUENTA REGRESIVA AL INICIO:"}
        </span>
      </div>

      <div className="countdown-timer-grid" aria-label="Cuenta regresiva Cyber Monday">
        {timeLeft.days > 0 && (
          <>
            <div className="time-card">
              <span className="time-number">{timeLeft.days}</span>
              <span className="time-label">Días</span>
            </div>
            <span className="colon-separator">:</span>
          </>
        )}

        <div className="time-card">
          <span className="time-number">{timeLeft.hours.toString().padStart(2, "0")}</span>
          <span className="time-label">Horas</span>
        </div>
        <span className="colon-separator">:</span>

        <div className="time-card">
          <span className="time-number">{timeLeft.minutes.toString().padStart(2, "0")}</span>
          <span className="time-label">Min</span>
        </div>
        <span className="colon-separator">:</span>

        <div className="time-card">
          <span
            className="time-number"
            style={{
              color: isActive ? "#FF5C5C" : "var(--primary-gold, #D4AF37)",
              textShadow: isActive ? "0 0 10px rgba(255, 92, 92, 0.5)" : "0 0 10px rgba(212, 175, 55, 0.4)"
            }}
          >
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
          <span className="time-label">Seg</span>
        </div>
      </div>
    </div>
  );
}
