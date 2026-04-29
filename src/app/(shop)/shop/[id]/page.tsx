import React from "react";
import { Product } from "@/types/woocommerce";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/FinalOfficialFooter";
import ProductDetailClient from "./ProductDetailClient";

// 🏎️ NITRO PRODUCT FETCH
async function getProduct(id: string): Promise<Product> {
  const CK = process.env.WOOCOMMERCE_CK;
  const CS = process.env.WOOCOMMERCE_CS;
  const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://tienda.comercialpatagonia.cl/wp-json/wc/v3";

  // Fallback a Mock si no hay llaves
  if (!CK || !CS) {
    return MOCK_PRODUCTS.find(p => p.id === Number(id)) || MOCK_PRODUCTS[0];
  }

  const authHeader = Buffer.from(`${CK}:${CS}`).toString('base64');
  const authUrl = `${WOO_URL}/products/${id}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 Segundos Máximo

  try {
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

    const bodyText = await response.text();
    if (response.status !== 200 || bodyText.startsWith('<')) {
        return MOCK_PRODUCTS.find(p => p.id === Number(id)) || MOCK_PRODUCTS[0];
    }

    return JSON.parse(bodyText);
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("API Timeout/Error, usando Mock para el producto:", id);
    return MOCK_PRODUCTS.find(p => p.id === Number(id)) || MOCK_PRODUCTS[0];
  }
}

// 🚀 NITRO: Pre-renderizado de páginas para velocidad instantánea
export async function generateStaticParams() {
  const CK = process.env.WOOCOMMERCE_CK;
  const CS = process.env.WOOCOMMERCE_CS;
  const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://tienda.comercialpatagonia.cl/wp-json/wc/v3";

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

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return (
    <>
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
