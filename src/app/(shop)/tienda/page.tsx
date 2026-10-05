import React from "react";
import { Metadata } from "next";
import ShopContainer from "@/components/shop/ShopContainer";
import { fetchWooCommerceProducts } from "@/lib/woocommerce";
import { writeLog } from "@/lib/logger";
import { Product } from "@/types/woocommerce";

// Fallback de seguridad de 1 hora (3600 segundos), revalidado bajo demanda por webhook de WooCommerce
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Catálogo de Materiales y Muebles | Comercial de la Patagonia",
  description: "Explora nuestra oferta de cemento Comodoro, herramientas profesionales, muebles para el hogar, seguridad y materiales para construcción en Punta Arenas.",
};

export default async function ShopPage() {
  let products: Product[] = [];
  let isLive = false;
  
  writeLog("[RENDER] ShopPage Server Side render initiated.");

  try {
    const data = await fetchWooCommerceProducts();
    if (data && data.length > 0) {
        products = data;
        isLive = true;
        writeLog(`[RENDER] ShopPage successfully loaded ${products.length} live products.`);
    } else {
        products = [];
        writeLog("[RENDER] ShopPage loaded empty product list due to empty WooCommerce request.");
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    writeLog(`[RENDER ERROR] ShopPage products fetch crashed: ${msg}`, error);
    products = [];
  }

  return (
    <ShopContainer 
      initialProducts={products} 
      isLive={isLive}
    />
  );
}
