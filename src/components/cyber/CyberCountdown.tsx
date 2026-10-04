"use client";

import React from "react";
import { Clock, Flame } from "lucide-react";
import { useCyberCampaign } from "@/lib/campaigns/useCyberCampaign";

interface CyberCountdownProps {
  className?: string;
}

export default function CyberCountdown({ className = "" }: CyberCountdownProps) {
  const { isClient, isVisible, isActive, timeLeft } = useCyberCampaign();

  if (!isClient || !isVisible) {
    return null;
  }

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
          color: #FFE600;
        }
        .countdown-timer-grid {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .time-card {
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.1);
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
          border-color: #FFE600;
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
          color: #FFE5E7;
          margin-top: 4px;
        }
        .colon-separator {
          font-size: 20px;
          font-weight: 900;
          color: #FFE600;
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
          <Clock size={13} style={{ color: "#FFE600" }} />
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
              color: "#FF4B4B",
              textShadow: "0 0 12px rgba(255, 75, 75, 0.6)"
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
