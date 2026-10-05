import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { revalidateTag, revalidatePath } from "next/cache";
import {
  invalidateProductMemoryCache,
  invalidateCatalogMemoryCache,
  invalidateCategoryProductsMemoryCache
} from "@/lib/woocommerce";

/**
 * Comparación de firmas en tiempo constante para mitigar ataques de temporización (timing attacks)
 */
function safeTimingCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Valida la firma HMAC-SHA256 enviada por WooCommerce en el header X-WC-Webhook-Signature
 */
function verifyWooCommerceSignature(
  rawBuffer: Buffer,
  signatureHeader: string | null,
  secret: string
): { isValid: boolean; headerLength: number; computedLength: number } {
  if (!signatureHeader || !secret) {
    return { isValid: false, headerLength: signatureHeader ? signatureHeader.length : 0, computedLength: 0 };
  }

  // Normalizar cabecera recibida (eliminar posibles espacios y prefijos como 'sha256=')
  const cleanHeader = signatureHeader.trim().replace(/^sha256=/i, "");
  
  // Normalizar secreto (limpiar espacios y comillas accidentales de configuración)
  const trimmedSecret = secret.trim().replace(/^["\x27]|["\x27]$/g, "");

  try {
    // 1. Digest estándar de WooCommerce: Base64
    const computedBase64 = crypto
      .createHmac("sha256", secret)
      .update(rawBuffer)
      .digest("base64");

    const computedBase64Trimmed = crypto
      .createHmac("sha256", trimmedSecret)
      .update(rawBuffer)
      .digest("base64");

    // 2. Digest fallback alternativo: Hexadecimal (por si alguna versión envía hex)
    const computedHex = crypto
      .createHmac("sha256", secret)
      .update(rawBuffer)
      .digest("hex");

    const computedHexTrimmed = crypto
      .createHmac("sha256", trimmedSecret)
      .update(rawBuffer)
      .digest("hex");

    const isValid =
      safeTimingCompare(cleanHeader, computedBase64) ||
      safeTimingCompare(cleanHeader, computedBase64Trimmed) ||
      safeTimingCompare(cleanHeader, computedHex) ||
      safeTimingCompare(cleanHeader, computedHexTrimmed);

    return {
      isValid,
      headerLength: cleanHeader.length,
      computedLength: computedBase64.length
    };
  } catch (err) {
    console.error("[WC WEBHOOK ERROR] Exception during HMAC verification:", err);
    return { isValid: false, headerLength: cleanHeader.length, computedLength: 0 };
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;

  if (!secret) {
    console.error("[WC WEBHOOK ERROR] WOOCOMMERCE_WEBHOOK_SECRET environment variable is missing on server.");
    return NextResponse.json(
      { error: "Webhook secret not configured on server" },
      { status: 500 }
    );
  }

  // 1. Obtener cabeceras relevantes
  const signatureHeader =
    req.headers.get("x-wc-webhook-signature") ||
    req.headers.get("X-WC-Webhook-Signature");

  const topicHeader =
    req.headers.get("x-wc-webhook-topic") ||
    req.headers.get("X-WC-Webhook-Topic") ||
    "";

  const eventHeader =
    req.headers.get("x-wc-webhook-event") ||
    req.headers.get("X-WC-Webhook-Event") ||
    "";

  const resourceHeader =
    req.headers.get("x-wc-webhook-resource") ||
    req.headers.get("X-WC-Webhook-Resource") ||
    "";

  // 2. Leer BODY RAW como Buffer binario exacto ANTES de cualquier JSON.parse()
  let rawBuffer: Buffer;
  let rawBodyText: string;
  try {
    const arrayBuffer = await req.arrayBuffer();
    rawBuffer = Buffer.from(arrayBuffer);
    rawBodyText = rawBuffer.toString("utf8");
  } catch (readErr) {
    console.error("[WC WEBHOOK ERROR] Failed reading raw body:", readErr);
    return NextResponse.json({ error: "Could not read request body" }, { status: 400 });
  }

  // 3. Validar criptográficamente la firma
  const { isValid, headerLength, computedLength } = verifyWooCommerceSignature(
    rawBuffer,
    signatureHeader,
    secret
  );

  // 4. Logs seguros de auditoría solicitados (sin exponer secreto ni body)
  console.log(`[WC WEBHOOK AUTH] Signature check:`, {
    hasSignatureHeader: Boolean(signatureHeader),
    signatureHeaderLength: headerLength,
    computedSignatureLength: computedLength,
    signaturesMatch: isValid,
    topic: topicHeader || eventHeader || "none",
    rawBytesLength: rawBuffer.length
  });

  if (!isValid) {
    console.warn(`[WC WEBHOOK WARN] Rejected request: Invalid webhook signature. (Header len: ${headerLength}, Computed len: ${computedLength}, Topic: ${topicHeader || "none"})`);
    return NextResponse.json(
      {
        error: "Invalid webhook signature",
        diagnostics: {
          hasSignatureHeader: Boolean(signatureHeader),
          signatureHeaderLength: headerLength,
          computedSignatureLength: computedLength,
          signaturesMatch: false,
          topic: topicHeader || "none"
        }
      },
      { status: 401 }
    );
  }

  // 5. Solo después de validar la firma se realiza el parseo de JSON
  let payload: Record<string, unknown> | null = null;
  try {
    payload = JSON.parse(rawBodyText);
  } catch {
    console.error("[WC WEBHOOK ERROR] Payload is not valid JSON.");
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

  // 6. Manejo de verificación/ping de WooCommerce
  if (
    topicHeader === "action.woocommerce_webhook_ping" ||
    eventHeader === "ping" ||
    "webhook_id" in payload
  ) {
    const webhookId = payload.webhook_id ?? "unknown";
    console.log(`[WC WEBHOOK] Webhook ping successfully verified (id: ${webhookId})`);
    return NextResponse.json({ received: true, event: "ping" }, { status: 200 });
  }

  // 7. Determinar si el evento corresponde a productos
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
    // 1. Invalidar tags de Data Cache en Next.js
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

    // 2. Limpiar promesas in-flight en la memoria de la instancia activa
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
