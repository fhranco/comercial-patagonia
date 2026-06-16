"use client";

import { useEffect, useState } from "react";

interface DayData { date: string; visits: number; }
interface Stats { pathname: string; total: number; today: number; history: DayData[]; }

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/views?pathname=/&days=30")
      .then(async (r) => {
        if (!r.ok) {
          const errData = await r.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const maxVisits = stats && stats.history ? Math.max(...stats.history.map(d => d.visits), 1) : 1;

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f", color: "#e8e8f0",
      fontFamily: "'Inter', sans-serif", padding: "40px 24px"
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>
            📊 Panel de Visitas
          </h1>
          <p style={{ color: "#666", marginTop: 6, fontSize: 14 }}>
            comercial-de-la-patagonia · Últimos 30 días
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: "center", color: "#555", padding: 80 }}>
            Cargando estadísticas...
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            borderRadius: "12px",
            padding: "16px 20px",
            color: "#f87171",
            textAlign: "center",
            margin: "40px 0"
          }}>
            ⚠️ Error al cargar estadísticas: {error}
          </div>
        )}

        {!loading && !error && stats && stats.history && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 40 }}>
              {[
                { label: "Total acumulado", value: stats.total.toLocaleString(), color: "#7c6fff" },
                { label: "Visitas hoy", value: stats.today.toLocaleString(), color: "#4ade80" },
                { label: "Días con datos", value: stats.history.filter(d => d.visits > 0).length.toString(), color: "#fb923c" },
              ].map(kpi => (
                <div key={kpi.label} style={{
                  background: "#13131a", borderRadius: 12, padding: "24px 20px",
                  border: "1px solid #1e1e2e"
                }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: kpi.color }}>
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Gráfico de barras */}
            <div style={{
              background: "#13131a", borderRadius: 12, padding: 28,
              border: "1px solid #1e1e2e"
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: "#ccc" }}>
                Visitas diarias — últimos 30 días
              </h2>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 180 }}>
                {stats.history.map(day => {
                  const pct = (day.visits / maxVisits) * 100;
                  const isToday = day.date === new Date().toISOString().slice(0, 10);
                  return (
                    <div key={day.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      {day.visits > 0 && (
                        <span style={{ fontSize: 10, color: "#888" }}>{day.visits}</span>
                      )}
                      <div
                        title={`${day.date}: ${day.visits} visitas`}
                        style={{
                          width: "100%", borderRadius: 4,
                          height: `${Math.max(pct, day.visits > 0 ? 4 : 2)}%`,
                          background: isToday
                            ? "#4ade80"
                            : day.visits > 0 ? "#7c6fff" : "#1e1e2e",
                          transition: "height 0.3s ease",
                          minHeight: 3,
                        }}
                      />
                      {/* Solo mostrar fecha cada 5 días para no saturar */}
                      <span style={{ fontSize: 9, color: "#444", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                        {day.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 16, fontSize: 12, color: "#555" }}>
                <span><span style={{ color: "#7c6fff" }}>■</span> Días anteriores</span>
                <span><span style={{ color: "#4ade80" }}>■</span> Hoy</span>
              </div>
            </div>

            {/* Tabla detallada solo de días con visitas */}
            <div style={{ marginTop: 24, background: "#13131a", borderRadius: 12, border: "1px solid #1e1e2e", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e1e2e" }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "#ccc", margin: 0 }}>
                  Detalle por día
                </h2>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0f0f18" }}>
                    <th style={{ padding: "10px 24px", textAlign: "left", fontSize: 12, color: "#555", fontWeight: 500 }}>FECHA</th>
                    <th style={{ padding: "10px 24px", textAlign: "right", fontSize: 12, color: "#555", fontWeight: 500 }}>VISITAS ÚNICAS</th>
                  </tr>
                </thead>
                <tbody>
                  {[...stats.history].reverse().filter(d => d.visits > 0).map((day, i) => (
                    <tr key={day.date} style={{ borderTop: "1px solid #1a1a24", background: i % 2 === 0 ? "transparent" : "#0f0f18" }}>
                      <td style={{ padding: "12px 24px", fontSize: 14 }}>{day.date}</td>
                      <td style={{ padding: "12px 24px", textAlign: "right", fontSize: 14, fontWeight: 600, color: "#7c6fff" }}>
                        {day.visits.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {stats.history.every(d => d.visits === 0) && (
                    <tr>
                      <td colSpan={2} style={{ padding: "32px 24px", textAlign: "center", color: "#444", fontSize: 14 }}>
                        Aún no hay datos. Las visitas aparecerán aquí a partir de hoy.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
