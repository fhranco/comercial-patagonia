"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "./actions";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;

    setError("");
    setPending(true);

    try {
      const formData = new FormData();
      formData.append("password", password);

      const res = await handleLogin(null, formData);

      if (res.success) {
        // Guardar estado y redirigir
        router.push("/admin/stats");
        router.refresh();
      } else {
        setError(res.error || "Contraseña incorrecta");
        setPending(false);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al validar la contraseña.");
      setPending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05060b",
        color: "#e8e8f0",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "24px",
      }}
    >
      {/* 🔮 Efectos Ambientales de Fondo (Luces de Neón Difusas) */}
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(58, 105, 168, 0.12) 0%, rgba(0,0,0,0) 70%)",
          top: "10%",
          left: "15%",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(249, 195, 0, 0.06) 0%, rgba(0,0,0,0) 70%)",
          bottom: "10%",
          right: "15%",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* 🏁 Card Principal */}
      <div
        style={{
          background: "rgba(14, 16, 27, 0.65)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(58, 105, 168, 0.18)",
          borderRadius: "24px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
          zIndex: 10,
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* Logo / Ícono Superior */}
        <div
          style={{
            width: "64px",
            height: "64px",
            background: "linear-gradient(135deg, rgba(58, 105, 168, 0.1) 0%, rgba(58, 105, 168, 0.25) 100%)",
            border: "1px solid rgba(58, 105, 168, 0.3)",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
            boxShadow: "0 8px 24px rgba(58, 105, 168, 0.15)",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3A69A8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Títulos */}
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          Área Restringida
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#858699",
            marginBottom: "36px",
            lineHeight: "1.5",
          }}
        >
          Por favor ingresa la contraseña de administración para acceder al panel de estadísticas de Comercial de la Patagonia.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ position: "relative", textAlign: "left" }}>
            <label
              htmlFor="password"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#a0a2b8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={pending}
                autoFocus
                style={{
                  width: "100%",
                  background: "rgba(10, 11, 18, 0.8)",
                  border: "1px solid rgba(58, 105, 168, 0.25)",
                  borderRadius: "12px",
                  padding: "14px 48px 14px 16px",
                  color: "#ffffff",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  fontFamily: showPassword ? "inherit" : "monospace",
                  letterSpacing: showPassword ? "normal" : "0.2em",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3A69A8";
                  e.target.style.boxShadow = "0 0 0 3px rgba(58, 105, 168, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(58, 105, 168, 0.25)";
                  e.target.style.boxShadow = "none";
                }}
              />

              {/* Botón Mostrar/Ocultar Contraseña */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#5f617a",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  outline: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3A69A8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#5f617a")}
              >
                {showPassword ? (
                  /* Ojo Abierto */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  /* Ojo Cerrado */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Panel de Error con Transición */}
          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textAlign: "left",
                animation: "fadeIn 0.2s ease-out",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: "13px", color: "#f87171", fontWeight: 500, lineHeight: "1.4" }}>
                {error}
              </span>
            </div>
          )}

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={pending || !password}
            style={{
              width: "100%",
              background: pending ? "rgba(58, 105, 168, 0.5)" : "#3A69A8",
              border: "none",
              borderRadius: "12px",
              padding: "15px",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
              cursor: pending || !password ? "not-allowed" : "pointer",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: pending || !password ? "none" : "0 4px 16px rgba(58, 105, 168, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!pending && password) {
                e.currentTarget.style.background = "#2a5084";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(58, 105, 168, 0.4)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!pending && password) {
                e.currentTarget.style.background = "#3A69A8";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(58, 105, 168, 0.3)";
                e.currentTarget.style.transform = "none";
              }
            }}
          >
            {pending ? (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" />
                </svg>
                <span>Validando...</span>
              </>
            ) : (
              <span>Acceder al Panel</span>
            )}
          </button>
        </form>
      </div>

      {/* Reglas de animación inyectadas inline */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      ` }} />
    </div>
  );
}
