import React from "react";
import { Product } from "@/types/woocommerce";
import ProductDetailClient from "./ProductDetailClient";
import { writeLog } from "@/lib/logger";
import { fetchWooCommerceProducts } from "@/lib/woocommerce";
import { notFound } from "next/navigation";

// 🏎️ NITRO PRODUCT FETCH (Deduplicated cache and offline backup)
async function getProduct(id: string): Promise<Product | null> {
  writeLog(`[GET DETAIL] Resolving product id ${id}`);
  
  try {
    const products = await fetchWooCommerceProducts();
    if (products && products.length > 0) {
      const found = products.find((p: any) => p.id.toString() === id);
      if (found) {
        writeLog(`[SUCCESS DETAIL] Product id ${id} resolved from cache: "${found.name}"`);
        return found;
      }
    }
  } catch (err: any) {
    writeLog(`[EXCEPTION DETAIL] Error searching product id ${id}: ${err.message || err}`);
  }

  writeLog(`[NOT FOUND DETAIL] Product id ${id} not found in WooCommerce catalog.`);
  return null;
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

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
