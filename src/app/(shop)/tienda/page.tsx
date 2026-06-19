import React from "react";
import { Metadata } from "next";
import ShopContainer from "@/components/shop/ShopContainer";
import { fetchWooCommerceProducts } from "@/lib/woocommerce";
import { writeLog } from "@/lib/logger";

export const revalidate = 3600; // Cache de 1 hora para evitar colapso de API

export const metadata: Metadata = {
  title: "Catálogo de Materiales y Muebles | Comercial de la Patagonia",
  description: "Explora nuestra oferta de cemento Comodoro, herramientas profesionales, muebles para el hogar, seguridad y materiales para construcción en Punta Arenas.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  let products = [];
  let isLive = false;
  const params = await searchParams;
  
  writeLog(`[RENDER] ShopPage Server Side render initiated. Category parameter: ${params.category}`);

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
  } catch (error: any) {
    writeLog(`[RENDER ERROR] ShopPage products fetch crashed: ${error.message || error}`, error);
    products = [];
  }

  return (
    <ShopContainer 
      initialProducts={products} 
      initialCategory={params.category as string} 
      isLive={isLive}
    />
  );
}
