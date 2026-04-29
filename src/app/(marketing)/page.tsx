import React from "react";
import HomeClient from "@/components/layout/HomeClient";
import { fetchWooCommerceProducts } from "@/lib/woocommerce";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

// 🚀 REVALIDACIÓN Dinámica (ISR)
export const revalidate = 60; // Actualizar cada minuto

export default async function Page() {
    let products = [];
    
    try {
        const fetchedProducts = await fetchWooCommerceProducts();
        products = (fetchedProducts && fetchedProducts.length > 0) ? fetchedProducts : MOCK_PRODUCTS;
    } catch (error) {
        console.error("Error fetching homepage products:", error);
        products = MOCK_PRODUCTS;
    }

    return (
        <HomeClient products={products} />
    );
}
