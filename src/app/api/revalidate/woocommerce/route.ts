import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { revalidateTag, revalidatePath } from "next/cache";
import {
  invalidateProductMemoryCache,
  invalidateCatalogMemoryCache,
  invalidateCategoryProductsMemoryCache
} from "@/lib/woocommerce";

/**
 * Valida la firma HMAC-SHA256 enviada por WooCommerce en el header x-wc-webhook-signature
 */
function verifyWooCommerceSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader || !secret) {
    return false;
  }

  try {
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("base64");

    const headerBuf = Buffer.from(signatureHeader.trim());
    const computedBuf = Buffer.from(computedSignature.trim());

    if (headerBuf.length !== computedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(headerBuf, computedBuf);
  } catch (err) {
    console.error("[WC WEBHOOK ERROR] Error verifying HMAC signature:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;

  if (!secret) {
    console.error("[WC WEBHOOK ERROR] WOOCOMMERCE_WEBHOOK_SECRET environment variable is missing.");
    return NextResponse.json(
      { error: "Webhook secret not configured on server" },
      { status: 500 }
    );
  }

  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Could not read request body" }, { status: 400 });
  }

  const signature = req.headers.get("x-wc-webhook-signature");

  // Validación criptográfica obligatoria
  const isValidSignature = verifyWooCommerceSignature(rawBody, signature, secret);
  if (!isValidSignature) {
    console.warn("[WC WEBHOOK WARN] Rejected request: Invalid or missing webhook signature.");
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 401 }
    );
  }

  // Parseo del payload JSON
  let payload: Record<string, unknown> | null = null;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error("[WC WEBHOOK ERROR] Rejected request: Malformed JSON payload.");
    return NextResponse.json(
      { error: "Malformed JSON payload" },
      { status: 400 }
    );
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { error: "Invalid payload format" },
      { status: 400 }
    );
  }

  const topicHeader = req.headers.get("x-wc-webhook-topic") || "";
  const eventHeader = req.headers.get("x-wc-webhook-event") || "";
  const resourceHeader = req.headers.get("x-wc-webhook-resource") || "";

  // 1. Manejo de verificación/ping de WooCommerce
  if (
    topicHeader === "action.woocommerce_webhook_ping" ||
    eventHeader === "ping" ||
    "webhook_id" in payload
  ) {
    const webhookId = payload.webhook_id ?? "unknown";
    console.log(`[WC WEBHOOK] Webhook ping successfully verified (id: ${webhookId})`);
    return NextResponse.json({ received: true, event: "ping" }, { status: 200 });
  }

  // 2. Determinar si el evento corresponde a productos
  const isProductResource =
    resourceHeader === "product" ||
    topicHeader.startsWith("product.") ||
    eventHeader.startsWith("product.") ||
    ("id" in payload && ("sku" in payload || "regular_price" in payload || "manage_stock" in payload));

  if (!isProductResource) {
    const ignoredName = topicHeader || eventHeader || resourceHeader || "unknown";
    console.log(`[WC WEBHOOK] Ignored non-product event: ${ignoredName}`);
    return NextResponse.json(
      { revalidated: false, message: `Ignored non-product event: ${ignoredName}` },
      { status: 200 }
    );
  }

  const productId = payload.id ? String(payload.id) : undefined;
  const productSlug = typeof payload.slug === "string" ? payload.slug : undefined;

  // Detectar si el producto pertenece a CyberDay
  let isCyber = false;
  if (Array.isArray(payload.categories)) {
    isCyber = payload.categories.some((cat: unknown) => {
      if (cat && typeof cat === "object") {
        const c = cat as { slug?: unknown; name?: unknown };
        const s = String(c.slug || "").toLowerCase();
        const n = String(c.name || "").toLowerCase();
        return (
          s === "cyberday" ||
          s === "cybermonday" ||
          s.includes("cyber") ||
          n.includes("cyber")
        );
      }
      return false;
    });
  }

  const revalidatedTags: string[] = [];
  const revalidatedPaths: string[] = [];

  try {
    // 1. Invalidar tags de Data Cache
    if (productId) {
      revalidateTag(`product:${productId}`, { expire: 0 });
      revalidatedTags.push(`product:${productId}`);
    }

    if (productSlug) {
      revalidateTag(`product-slug:${productSlug}`, { expire: 0 });
      revalidatedTags.push(`product-slug:${productSlug}`);
      
      // Invalidar path exacto de la ficha
      revalidatePath(`/tienda/${productSlug}`, "page");
      revalidatedPaths.push(`/tienda/${productSlug}`);
    }

    // Invalidar listados de productos (catálogo y home)
    revalidateTag("products", { expire: 0 });
    revalidatedTags.push("products");

    revalidatePath("/tienda", "page");
    revalidatedPaths.push("/tienda");

    revalidatePath("/", "page");
    revalidatedPaths.push("/");

    // Si es producto Cyber, invalidar tag específico
    if (isCyber) {
      revalidateTag("cyber-products", { expire: 0 });
      revalidatedTags.push("cyber-products");
    }

    // 2. Limpiar memoria local de la instancia activa
    invalidateProductMemoryCache(productId, productSlug);
    invalidateCatalogMemoryCache();
    if (isCyber) {
      invalidateCategoryProductsMemoryCache("cyberday");
    }

    const eventName = topicHeader || eventHeader || "product.updated";
    console.log(`[WC WEBHOOK] ${eventName} id=${productId || "none"} slug=${productSlug || "none"}`);
    console.log(`[CACHE] revalidated tags: [${revalidatedTags.join(", ")}], paths: [${revalidatedPaths.join(", ")}]`);

    return NextResponse.json({
      revalidated: true,
      id: productId,
      slug: productSlug,
      isCyber,
      tags: revalidatedTags,
      paths: revalidatedPaths,
      timestamp: Date.now()
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[WC WEBHOOK EXCEPTION] Error executing revalidation: ${errorMsg}`);
    return NextResponse.json(
      { error: "Error during revalidation", details: errorMsg },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST with WooCommerce webhook signature." },
    { status: 405 }
  );
}
