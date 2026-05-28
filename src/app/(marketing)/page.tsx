import React from "react";
import HomeClient from "@/components/layout/HomeClient";
import { fetchWooCommerceProducts } from "@/lib/woocommerce";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { writeLog } from "@/lib/logger";

// 🚀 ISR: Revalidar cada hora (en dev mode se ignora, pero el cache en memoria lo maneja)
export const revalidate = 3600;

export default async function Page() {
    let products = [];
    writeLog("[RENDER] Homepage Server Side render initiated.");
    
    try {
        const fetchedProducts = await fetchWooCommerceProducts();
        if (fetchedProducts && fetchedProducts.length > 0) {
            products = fetchedProducts;
            writeLog(`[RENDER] Homepage successfully loaded ${products.length} live products.`);
        } else {
            products = MOCK_PRODUCTS;
            writeLog("[RENDER] Homepage using MOCK_PRODUCTS fallback due to empty or failed WooCommerce request.");
        }
    } catch (error: any) {
        writeLog(`[RENDER ERROR] Homepage products fetch crashed: ${error.message || error}`, error);
        console.error("Error fetching homepage products:", error);
        products = MOCK_PRODUCTS;
    }

    return (
        <HomeClient products={products} />
    );
}
