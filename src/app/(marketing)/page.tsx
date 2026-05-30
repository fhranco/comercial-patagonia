import React from "react";
import HomeClient from "@/components/layout/HomeClient";
import { fetchWooCommerceProducts } from "@/lib/woocommerce";
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
            products = [];
            writeLog("[RENDER] Homepage loaded empty product list due to empty WooCommerce request.");
        }
    } catch (error: any) {
        writeLog(`[RENDER ERROR] Homepage products fetch crashed: ${error.message || error}`, error);
        console.error("Error fetching homepage products:", error);
        products = [];
    }

    return (
        <HomeClient products={products} />
    );
}
