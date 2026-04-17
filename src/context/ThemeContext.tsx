"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 🏔️ INTEGRACIÓN ABSOLUTA: Forzamos Light de entrada para integrar fotos blancas
    const saved = localStorage.getItem("patagonia_theme") as Theme;
    const initialTheme = saved || "light";
    
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    setIsHydrated(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("patagonia_theme", newTheme);
      return newTheme;
    });
  }, []);

  // Prevent hydration flicker by not rendering or rendering with a specific strategy 
  // during the first pass if needed, but for theme usually setAttribute is enough.

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {isHydrated ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
