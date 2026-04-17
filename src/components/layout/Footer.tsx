"use client";

import React from "react";
import { Globe, Sparkles, Maximize2 } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ padding: '80px 5%', textAlign: 'center', borderTop: `1px solid var(--border-color)` }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginBottom: '40px' }}>
            <Globe className="w-5 h-5 opacity-20" />
            <Sparkles className="w-5 h-5 opacity-20" />
            <Maximize2 className="w-5 h-5 opacity-20" />
        </div>
        <p style={{ fontSize: '8px', opacity: 0.1, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1em' }}>Comercial de la Patagonia 2026 • Chile</p>
    </footer>
  );
}
