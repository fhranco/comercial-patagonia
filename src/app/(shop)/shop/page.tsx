import React from "react";
import ShopContainer from "@/components/shop/ShopContainer";
import { fetchWooCommerceProducts } from "@/lib/woocommerce";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

export const revalidate = 1; // 🚀 NUCLEAR RESET: Forzando actualización instantánea de cache

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  let products = [];
  let isLive = false;
  const params = await searchParams;

  try {
    const data = await fetchWooCommerceProducts();
    if (data && data.length > 0) {
        products = data;
        isLive = true;
    } else {
        products = MOCK_PRODUCTS;
    }
  } catch (error) {
    products = MOCK_PRODUCTS;
  }

  return (
    <ShopContainer 
      initialProducts={products} 
      initialCategory={params.category as string} 
      isLive={isLive}
    />
  );
}
