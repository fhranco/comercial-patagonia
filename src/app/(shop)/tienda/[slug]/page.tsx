import React, { cache } from "react";
import { Product } from "@/types/woocommerce";
import ProductDetailClient from "./ProductDetailClient";
import PlanchetaLandingPage from "./PlanchetaLandingPage";
import { writeLog } from "@/lib/logger";
import {
  fetchWooCommerceProducts,
  fetchWooCommerceProductBySlug,
  fetchWooCommerceProductById
} from "@/lib/woocommerce";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

// Fallback de seguridad de 1 hora (3600 segundos), revalidado bajo demanda por webhook de WooCommerce
export const revalidate = 3600;
export const dynamicParams = true;

// Resolves a product by slug or id (retrocompatibility support)
// Wrapped with React cache() to deduplicate execution between generateMetadata() and Page()
const getProductBySlugOrId = cache(
  async (
    slugOrId: string
  ): Promise<{ product: Product | null; shouldRedirect: boolean; targetSlug?: string }> => {
    writeLog(`[GET DETAIL] Resolving product slug/id: ${slugOrId}`);

    const isNumeric = /^\d+$/.test(slugOrId);

    try {
      if (isNumeric) {
        // 1. Try search by numeric ID (retrocompatibility support)
        const productById = await fetchWooCommerceProductById(slugOrId);
        if (productById) {
          if (productById.slug && productById.slug !== slugOrId) {
            writeLog(`[RETRO DETAIL] Found by numeric ID: ${slugOrId}, redirecting to slug: ${productById.slug}`);
            return { product: productById, shouldRedirect: true, targetSlug: productById.slug };
          }
          return { product: productById, shouldRedirect: false };
        }

        // Fallback: in case a slug itself is composed of digits
        const productBySlug = await fetchWooCommerceProductBySlug(slugOrId);
        if (productBySlug) {
          return { product: productBySlug, shouldRedirect: false };
        }
      } else {
        // 1. Search single product by slug (/products?slug=...&status=publish&per_page=1)
        const productBySlug = await fetchWooCommerceProductBySlug(slugOrId);
        if (productBySlug) {
          return { product: productBySlug, shouldRedirect: false };
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      writeLog(`[EXCEPTION DETAIL] Error searching product slug/id: ${slugOrId}: ${msg}`);
    }

    return { product: null, shouldRedirect: false };
  }
);

// Generate static params for optimal server rendering speed
export async function generateStaticParams() {
  try {
    const products = await fetchWooCommerceProducts();
    if (products && products.length > 0) {
      return products.map((p) => ({ slug: p.slug }));
    }
  } catch (e: unknown) {
    writeLog(`[STATIC PARAMS ERROR] Could not generate static params: ${e}`);
  }
  return [];
}

// Generate Dynamic Metadata for Product SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { product } = await getProductBySlugOrId(resolvedParams.slug);

  if (!product) {
    return {
      title: "Producto No Encontrado | Comercial de la Patagonia",
      description: "El producto solicitado no está disponible actualmente."
    };
  }

  // Limpiar HTML de la descripción para el metatag
  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>/g, '').substring(0, 155) + "..."
    : `Adquiere ${product.name} en Comercial de la Patagonia. Suministro profesional en Punta Arenas y todo Magallanes.`;

  const imageUrl = product.images && product.images[0]?.src ? product.images[0].src : "/icon.png";

  return {
    title: `${product.name} | Comercial de la Patagonia`,
    description: cleanDescription,
    openGraph: {
      title: `${product.name} | Comercial de la Patagonia`,
      description: cleanDescription,
      images: [{ url: imageUrl }],
      type: "website"
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { product, shouldRedirect, targetSlug } = await getProductBySlugOrId(resolvedParams.slug);

  if (shouldRedirect && targetSlug) {
    redirect(`/tienda/${targetSlug}`);
  }

  if (!product) {
    notFound();
  }

  // Generar JSON-LD estructurado de tipo Product
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map((img) => img.src) || [],
    "description": product.description?.replace(/<[^>]*>/g, ''),
    "sku": product.sku || `sku-${product.id}`,
    "offers": {
      "@type": "Offer",
      "url": `https://comercialpatagonia.cl/tienda/${product.slug}`,
      "priceCurrency": "CLP",
      "price": product.price || "0",
      "availability": product.stock_status === "instock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {resolvedParams.slug === "plancheta" ? (
        <PlanchetaLandingPage product={product} />
      ) : (
        <ProductDetailClient initialProduct={product} />
      )}
    </>
  );
}
