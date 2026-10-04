import React from "react";
import HomeClient from "@/components/layout/HomeClient";
import { fetchWooCommerceProducts, fetchWooCommerceProductsByCategorySlug } from "@/lib/woocommerce";
import { CYBER_CAMPAIGN_CONFIG, isCyberCampaignVisible } from "@/lib/campaigns/cyber";
import { writeLog } from "@/lib/logger";
import { Product } from "@/types/woocommerce";

// 🚀 ISR: 5 minutos (300 segundos), alineado con /tienda y fichas de producto
export const revalidate = 300;

export default async function Page() {
    let products: Product[] = [];
    let cyberProducts: Product[] = [];
    writeLog("[RENDER] Homepage Server Side render initiated.");
    
    try {
        const isVisible = isCyberCampaignVisible();
        const [fetchedProducts, fetchedCyberProducts] = await Promise.all([
            fetchWooCommerceProducts(),
            isVisible
              ? fetchWooCommerceProductsByCategorySlug(CYBER_CAMPAIGN_CONFIG.categorySlug, 16)
              : Promise.resolve([] as Product[])
        ]);

        if (fetchedProducts && fetchedProducts.length > 0) {
            products = fetchedProducts;
            writeLog(`[RENDER] Homepage successfully loaded ${products.length} live products.`);
        } else {
            products = [];
            writeLog("[RENDER] Homepage loaded empty product list due to empty WooCommerce request.");
        }

        if (fetchedCyberProducts && fetchedCyberProducts.length > 0) {
            cyberProducts = fetchedCyberProducts;
            writeLog(`[RENDER] Homepage loaded ${cyberProducts.length} cyber products.`);
        }
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        writeLog(`[RENDER ERROR] Homepage products fetch crashed: ${msg}`, error);
        console.error("Error fetching homepage products:", error);
        products = [];
        cyberProducts = [];
    }

    return (
        <HomeClient products={products} cyberProducts={cyberProducts} />
    );
}

