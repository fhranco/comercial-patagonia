import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./plancheta.css";
import { ThemeProvider } from "../context/ThemeContext";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/shop/CartDrawer";
import B2BConcierge from "../components/shop/B2BConcierge";
import Footer from "../components/layout/FinalOfficialFooter";
import GlobalQuickView from "../components/shop/GlobalQuickView";
import { BRAND_CONFIG } from "../lib/constants";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body',
  display: 'swap',
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Comercial de la Patagonia | Suministro Profesional en Magallanes",
  description: "Distribuidor oficial de cemento, herramientas y materiales de construcción en Punta Arenas y la Región de Magallanes. Tradición y Trayectoria.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🧠 ESTRUCTURA DE DATOS PARA IAs (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Comercial de la Patagonia",
    "image": "https://comercialpatagonia.cl/logo.png",
    "@id": "https://comercialpatagonia.cl",
    "url": "https://comercialpatagonia.cl",
    "telephone": BRAND_CONFIG.whatsapp,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenida Carlos Ibañez del Campo",
      "addressLocality": "Punta Arenas",
      "addressRegion": "Magallanes",
      "addressCountry": "CL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -53.1638,
      "longitude": -70.9171
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://facebook.com/comercialdelapatagonia",
      "https://instagram.com/comercialdelapatagonia"
    ],
    "priceRange": "$$$",
    "description": "Distribuidor líder de materiales de construcción y equipamiento industrial en la Patagonia Chilena. Especialistas en cementos, herramientas de alto desempeño y logística regional."
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="google37a431e967a22c49" />
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-3ZL06WB636" strategy="afterInteractive" />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3ZL06WB636');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <ThemeProvider>
          <CartProvider>
            <CartDrawer />
            <GlobalQuickView />
            {/* 🛡️ UNIFIED B2B HUB (Replacing multiple floating buttons) */}
            <B2BConcierge />
            {/* MagallanesLogistics and AIAssistant now live inside the Concierge or are hidden on mobile to avoid clutter */}
            {children}
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
