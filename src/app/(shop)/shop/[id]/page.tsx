import React from "react";
import { Product } from "@/types/woocommerce";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/FinalOfficialFooter";
import ProductDetailClient from "./ProductDetailClient";
import { writeLog } from "@/lib/logger";
import { fetchWooCommerceProducts } from "@/lib/woocommerce";

// 🏎️ NITRO PRODUCT FETCH (Deduplicated cache and offline backup)
async function getProduct(id: string): Promise<Product> {
  writeLog(`[GET DETAIL] Resolving product id ${id}`);
  
  try {
    const products = await fetchWooCommerceProducts();
    if (products && products.length > 0) {
      const found = products.find((p: any) => p.id.toString() === id);
      if (found) {
        writeLog(`[SUCCESS DETAIL] Product id ${id} resolved from cache/backup: "${found.name}"`);
        return found;
      }
    }
  } catch (err: any) {
    writeLog(`[EXCEPTION DETAIL] Error searching product id ${id}: ${err.message || err}`);
  }

  // Fallback if not found in live products or complete network crash
  writeLog(`[FALLBACK DETAIL] Product id ${id} not found in live products. Using mock.`);
  const existingMock = MOCK_PRODUCTS.find(p => p.id === Number(id));
  if (existingMock) return { ...existingMock, id: Number(id) } as Product;
  return generateDynamicMock(id);
}

// 🎭 FUNCIÓN GENERADORA: Centralizamos la creación de productos de prueba
function generateDynamicMock(id: string): Product {
    let numId = Number(id);
    if (isNaN(numId)) numId = 999; // Fallback estable si el ID es un texto/slug
    
    const existingMock = MOCK_PRODUCTS.find(p => p.id === numId);
    if (existingMock) return { ...existingMock, id: numId } as Product;

    return {
      id: numId,
      name: `Suministro Estratégico #${id}`,
      slug: `producto-${id}`,
      permalink: "#",
      price: (12000 + (numId % 40) * 1500).toString(),
      regular_price: (20000 + (numId % 40) * 1500).toString(),
      sale_price: (12000 + (numId % 40) * 1500).toString(),
      on_sale: numId % 3 === 0,
      stock_status: "instock" as "instock",
      images: [{ id: numId, src: "/images/comodoro-2000.png", name: "Producto", alt: "Vista de Producto" }],
      categories: [{ id: 1, name: "Catálogo Magallanes", slug: "catalogo" }],
      sku: `SKU-${id}-TEST`,
      description: "Este producto se muestra porque el sistema está en modo local o la API de Hostinger no está disponible. Sin embargo, toda la estructura de la página es real.",
      short_description: "Equipo de alta resistencia para clima austral.",
      attributes: []
    };
}

// 🚀 NITRO: Pre-renderizado de páginas para velocidad instantánea
export async function generateStaticParams() {
  try {
    const products = await fetchWooCommerceProducts();
    if (products && products.length > 0) {
      return products.map((p: any) => ({ id: p.id.toString() }));
    }
  } catch (e) {
    writeLog(`[STATIC PARAMS ERROR] Could not generate static params: ${e}`);
  }
  return [];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  return (
    <>
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
