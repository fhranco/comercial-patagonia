import React from "react";
import { Product } from "@/types/woocommerce";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/FinalOfficialFooter";
import ProductDetailClient from "./ProductDetailClient";
import { writeLog } from "@/lib/logger";

// 🏎️ NITRO PRODUCT FETCH
async function getProduct(id: string): Promise<Product> {
  const CK = process.env.WOOCOMMERCE_CK;
  const CS = process.env.WOOCOMMERCE_CS;
  const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://productos.comercialpatagonia.cl/wp-json/wc/v3";

  // Fallback a Mock si no hay llaves
  if (!CK || !CS) {
    writeLog(`[INFO DETAIL] Product id ${id} using mock because WooCommerce keys are missing.`);
    return generateDynamicMock(id);
  }

  const authHeader = Buffer.from(`${CK}:${CS}`).toString('base64');
  const authUrl = `${WOO_URL}/products/${id}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 Seconds Maximum

  try {
    writeLog(`[FETCH DETAIL] Fetching product id ${id} from: ${authUrl}`);
    const response = await fetch(authUrl, {
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "User-Agent": "ComercialPatagonia-B2B-Turbo/1.1"
      },
      next: { revalidate: 3600, tags: [`product-${id}`] },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    writeLog(`[RESPONSE DETAIL] Product id ${id} status: ${response.status} ok: ${response.ok}`);

    const bodyText = await response.text();
    if (response.status !== 200 || bodyText.startsWith('<')) {
        writeLog(`[ERROR DETAIL] Product id ${id} failed status: ${response.status}. Using mock fallback.`);
        console.warn(`[WooCommerce API] Error ${response.status}, usando fallback dinámico.`);
        const existingMock = MOCK_PRODUCTS.find(p => p.id === Number(id));
        if (existingMock) return { ...existingMock, id: Number(id) };
        return generateDynamicMock(id);
    }

    const product = JSON.parse(bodyText);
    if (!product || typeof product !== 'object' || !product.name || !Array.isArray(product.images)) {
        writeLog(`[ERROR DETAIL] Product id ${id} returned an invalid JSON schema. Using mock fallback.`);
        return generateDynamicMock(id);
    }

    writeLog(`[SUCCESS DETAIL] Product id ${id} loaded successfully: "${product.name}"`);
    return product;
  } catch (error: any) {
    clearTimeout(timeoutId);
    writeLog(`[EXCEPTION DETAIL] Product id ${id} crashed: ${error.message || error}`, error);
    console.warn("API Timeout/Error, usando Mock Dinámico:", id);
    return generateDynamicMock(id);
  }
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
  const CK = process.env.WOOCOMMERCE_CK;
  const CS = process.env.WOOCOMMERCE_CS;
  const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://productos.comercialpatagonia.cl/wp-json/wc/v3";

  if (!CK || !CS) return [];

  const authHeader = Buffer.from(`${CK}:${CS}`).toString('base64');
  try {
    const res = await fetch(`${WOO_URL}/products?per_page=100&_fields=id`, {
      headers: { "Authorization": `Basic ${authHeader}` }
    });
    const products = await res.json();
    return products.map((p: any) => ({ id: p.id.toString() }));
  } catch (e) {
    return [];
  }
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
