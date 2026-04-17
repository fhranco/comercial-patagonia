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
  const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://darkorange-bat-658298.hostingersite.com/wp-json/wc/v3";

  // Fallback a Mock si no hay llaves
  if (!CK || !CS) {
    return MOCK_PRODUCTS.find(p => p.id === Number(id)) || MOCK_PRODUCTS[0];
  }

  const authHeader = Buffer.from(`${CK}:${CS}`).toString('base64');
  const authUrl = `${WOO_URL}/products/${id}`;

  try {
    const response = await fetch(authUrl, {
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      next: { revalidate: 1 } 
    });

    const bodyText = await response.text();
    console.log(`[WooCommerce API] Product ID: ${id} - Status: ${response.status}`);
    
    if (response.status !== 200 || bodyText.startsWith('<')) {
        console.error(`[WooCommerce API] Error en respuesta ID ${id}: Probable bloqueo de Hostinger.`);
        return MOCK_PRODUCTS.find(p => p.id === Number(id)) || MOCK_PRODUCTS[0];
    }

    return JSON.parse(bodyText);
  } catch (error) {
    console.warn("API Error, usando Mock para el producto:", id);
    return MOCK_PRODUCTS.find(p => p.id === Number(id)) || MOCK_PRODUCTS[0];
  }
}

// 🚀 NITRO: Pre-renderizado de páginas para velocidad instantánea
export async function generateStaticParams() {
  const CK = process.env.WOOCOMMERCE_CK;
  const CS = process.env.WOOCOMMERCE_CS;
  const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://darkorange-bat-658298.hostingersite.com/wp-json/wc/v3";

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
      <Footer />
    </>
  );
}
