// 🛍️ WOOCOMMERCE API CLIENT CONFIGURATION
// Status: CONNECTED 🏔️🔌 WITH IN-MEMORY CACHE + RETRIES + STATIC READ-ONLY JSON BACKUP
// Optimized for Vercel Serverless / ISR: 0 filesystem writes, 5-min caching, single-product fetches.

import { writeLog } from './logger';
import { Product } from '@/types/woocommerce';

export const WOOCOMMERCE_URL = (process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "").replace(/\/$/, "");
const CK = process.env.WOOCOMMERCE_CK || "";
const CS = process.env.WOOCOMMERCE_CS || "";

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  image?: {
    src?: string;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧠 CACHE ARCHITECTURE — Next.js Data Cache + In-Flight Dedup
// Se elimina la caché persistente en memoria de instancia (Map/Object) para evitar
// el problema de Split-Brain / Stale Replica en Vercel Serverless (donde una Instancia B
// conservaría datos antiguos en memoria tras un webhook recibido por Instancia A).
// La persistencia y revalidación se delegan 100% al Data Cache compartido de Next.js
// mediante tags ('products', 'product:id', etc.), manteniendo únicamente deduplicación in-flight.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const REVALIDATE_SECONDS = 3600;     // 1 hora de fallback de seguridad para Data Cache / ISR

let productsCachePromise: Promise<Product[] | null> | null = null;
let categoriesCachePromise: Promise<CategoryItem[] | null> | null = null;
const singleProductPromises = new Map<string, Promise<Product | null>>();
const categoryProductsPromises: Record<string, Promise<Product[]> | null> = {};

/**
 * Invalida promesas in-flight de producto si estuvieran activas
 */
export function invalidateProductMemoryCache(id?: number | string, slug?: string): void {
  if (id) {
    singleProductPromises.delete(`id:${id}`);
  }
  if (slug) {
    singleProductPromises.delete(`slug:${slug}`);
  }
}

/**
 * Invalida la promesa in-flight del catálogo completo
 */
export function invalidateCatalogMemoryCache(): void {
  productsCachePromise = null;
}

/**
 * Invalida la promesa in-flight de categorías
 */
export function invalidateCategoriesMemoryCache(): void {
  categoriesCachePromise = null;
}

/**
 * Invalida la promesa in-flight de productos por categoría
 */
export function invalidateCategoryProductsMemoryCache(categorySlug?: string): void {
  if (categorySlug) {
    const norm = categorySlug.toLowerCase();
    for (const key of Object.keys(categoryProductsPromises)) {
      if (key.startsWith(norm)) {
        delete categoryProductsPromises[key];
      }
    }
  } else {
    for (const key of Object.keys(categoryProductsPromises)) {
      delete categoryProductsPromises[key];
    }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💾 READ-ONLY STATIC BACKUP (Offline / Crash Recovery)
// Runtime filesystem writes are completely disabled to prevent EROFS errors on Vercel.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function loadBackupData<T = unknown>(filename: string): Promise<T[] | null> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'src/data', filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        writeLog(`[BACKUP READ] Loaded ${parsed.length} items from local fallback backup: ${filename}`);
        return parsed as T[];
      }
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    writeLog(`[BACKUP READ ERROR] Could not load local fallback from ${filename}: ${msg}`);
  }
  return null;
}

export async function loadBackupProduct(slugOrId: string): Promise<Product | null> {
  const products = await loadBackupData<Product>('backup-products.json');
  if (!products || !Array.isArray(products)) return null;
  const isNumeric = /^\d+$/.test(slugOrId);
  if (isNumeric) {
    const foundById = products.find((p) => p.id?.toString() === slugOrId);
    if (foundById) return foundById;
  }
  return products.find((p) => p.slug === slugOrId) || null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔄 FETCH RETRIES WITH EXPONENTIAL BACKOFF
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  timeoutMs: number = 8000,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      if (attempt > 1) {
        writeLog(`[RETRY] Attempt ${attempt}/${maxRetries} for request: ${url}`);
      }
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      writeLog(`[RETRY ERROR] Attempt ${attempt}/${maxRetries} failed: ${msg}`);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 250; // 500ms, 1000ms, 2000ms
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError || new Error(`Request failed after ${maxRetries} attempts`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔗 AUTOMATIC DOMAIN REWRITE FOR IMAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function rewriteImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;
  
  let activeHost = "tiendacp.boostpatagonia.online";
  try {
    const activeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "";
    if (activeUrl) {
      const urlObj = new URL(activeUrl);
      activeHost = urlObj.hostname;
    }
  } catch {}

  let rewrittenUrl = url.replace(/^http:\/\//i, 'https://');

  rewrittenUrl = rewrittenUrl
    .replace(/https?:\/\/darkorange-bat-658298\.hostingersite\.com/g, `https://${activeHost}`)
    .replace(/https?:\/\/[\w-]+\.hostingersite\.com/g, `https://${activeHost}`);

  return rewrittenUrl;
}

export function rewriteSingleProductImageUrls(product: Product | null): Product | null {
  if (!product || typeof product !== 'object') return product;
  let images = product.images;
  if (images && Array.isArray(images)) {
    images = images.map((img) => {
      if (img && typeof img === 'object') {
        const newImg = { ...img };
        if (typeof newImg.src === 'string') {
          newImg.src = rewriteImageUrl(newImg.src);
        }
        return newImg;
      }
      return img;
    });
  }
  return {
    ...product,
    images
  };
}

export function rewriteProductImageUrls(products: Product[] | null): Product[] | null {
  if (!products || !Array.isArray(products)) return products;
  return products.map((product) => rewriteSingleProductImageUrls(product) as Product);
}

function rewriteCategoryImageUrls(categories: CategoryItem[] | null): CategoryItem[] | null {
  if (!categories || !Array.isArray(categories)) return categories;
  return categories.map((cat) => {
    if (cat.image && typeof cat.image === 'object') {
      const newImg = { ...cat.image };
      if (typeof newImg.src === 'string') {
        newImg.src = rewriteImageUrl(newImg.src);
      }
      return {
        ...cat,
        image: newImg
      };
    }
    return cat;
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 SINGLE PRODUCT FETCH (by slug or by ID)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Fetches a single product by slug from WooCommerce API (with memory cache, Next.js cache, and offline fallback)
 * Uses endpoint: /products?slug=...&status=publish&per_page=1
 */
export async function fetchWooCommerceProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;
  const cacheKey = `slug:${slug}`;

  // 🧠 DEDUP IN-FLIGHT: Si otra petición simultánea ya está consultando este slug en esta instancia, unirse a ella
  const inFlight = singleProductPromises.get(cacheKey);
  if (inFlight) {
    writeLog(`[CACHE DEDUP] In-flight fetch for product slug '${slug}'`);
    return inFlight;
  }

  const promise = (async () => {
    try {
      if (!CK || !CS || !WOOCOMMERCE_URL) {
        writeLog("[ERROR] fetchWooCommerceProductBySlug: Missing credentials or URL.");
        const fallback = await loadBackupProduct(slug);
        return fallback ? rewriteSingleProductImageUrls(fallback) : null;
      }

      const authHeader = `Basic ${Buffer.from(`${CK}:${CS}`).toString('base64')}`;
      const url = `${WOOCOMMERCE_URL}/products?slug=${encodeURIComponent(slug)}&status=publish&per_page=1`;
      const isVercel = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
      const timeoutMs = 9000;
      const maxRetries = isVercel ? 2 : 3;

      writeLog(`[FETCH] Single product by slug requesting: ${url}`);
      const response = await fetchWithRetry(
        url,
        {
          method: "GET",
          headers: {
            Authorization: authHeader,
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "ComercialPatagonia-B2B-Agent/1.0"
          },
          next: {
            revalidate: REVALIDATE_SECONDS,
            tags: ["products", `product-slug:${slug}`]
          }
        },
        timeoutMs,
        maxRetries
      );

      if (!response.ok) {
        writeLog(`[ERROR] Single product by slug '${slug}' failed with HTTP ${response.status}`);
        const fallback = await loadBackupProduct(slug);
        return fallback ? rewriteSingleProductImageUrls(fallback) : null;
      }

      const json = await response.json();
      if (Array.isArray(json) && json.length > 0) {
        const raw = json[0] as Product;
        return rewriteSingleProductImageUrls(raw);
      }

      // If empty in API, check offline backup as safety fallback
      const fallback = await loadBackupProduct(slug);
      return fallback ? rewriteSingleProductImageUrls(fallback) : null;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      writeLog(`[EXCEPTION] fetchWooCommerceProductBySlug('${slug}') failed: ${msg}`, err);
      const fallback = await loadBackupProduct(slug);
      return fallback ? rewriteSingleProductImageUrls(fallback) : null;
    } finally {
      singleProductPromises.delete(cacheKey);
    }
  })();

  singleProductPromises.set(cacheKey, promise);
  return promise;
}

/**
 * Fetches a single product by numeric ID from WooCommerce API (with memory cache, Next.js cache, and offline fallback)
 * Uses endpoint: /products/{id}
 */
export async function fetchWooCommerceProductById(id: number | string): Promise<Product | null> {
  const idStr = String(id);
  if (!idStr) return null;
  const cacheKey = `id:${idStr}`;

  // 🧠 DEDUP IN-FLIGHT: Si otra petición simultánea ya está consultando este id en esta instancia, unirse a ella
  const inFlight = singleProductPromises.get(cacheKey);
  if (inFlight) {
    writeLog(`[CACHE DEDUP] In-flight fetch for product ID '${idStr}'`);
    return inFlight;
  }

  const promise = (async () => {
    try {
      if (!CK || !CS || !WOOCOMMERCE_URL) {
        writeLog("[ERROR] fetchWooCommerceProductById: Missing credentials or URL.");
        const fallback = await loadBackupProduct(idStr);
        return fallback ? rewriteSingleProductImageUrls(fallback) : null;
      }

      const authHeader = `Basic ${Buffer.from(`${CK}:${CS}`).toString('base64')}`;
      const url = `${WOOCOMMERCE_URL}/products/${encodeURIComponent(idStr)}`;
      const isVercel = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
      const timeoutMs = 9000;
      const maxRetries = isVercel ? 2 : 3;

      writeLog(`[FETCH] Single product by ID requesting: ${url}`);
      const response = await fetchWithRetry(
        url,
        {
          method: "GET",
          headers: {
            Authorization: authHeader,
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "ComercialPatagonia-B2B-Agent/1.0"
          },
          next: {
            revalidate: REVALIDATE_SECONDS,
            tags: ["products", `product:${idStr}`]
          }
        },
        timeoutMs,
        maxRetries
      );

      if (!response.ok) {
        writeLog(`[ERROR] Single product by ID '${idStr}' failed with HTTP ${response.status}`);
        const fallback = await loadBackupProduct(idStr);
        return fallback ? rewriteSingleProductImageUrls(fallback) : null;
      }

      const json = await response.json();
      if (json && typeof json === 'object' && 'id' in json) {
        const raw = json as Product;
        return rewriteSingleProductImageUrls(raw);
      }

      const fallback = await loadBackupProduct(idStr);
      return fallback ? rewriteSingleProductImageUrls(fallback) : null;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      writeLog(`[EXCEPTION] fetchWooCommerceProductById('${idStr}') failed: ${msg}`, err);
      const fallback = await loadBackupProduct(idStr);
      return fallback ? rewriteSingleProductImageUrls(fallback) : null;
    } finally {
      singleProductPromises.delete(cacheKey);
    }
  })();

  singleProductPromises.set(cacheKey, promise);
  return promise;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 FULL CATALOG FETCH (for catalog, home and generateStaticParams)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Fetches products from your WooCommerce server (with deduplication cache and backup fallback)
 */
export async function fetchWooCommerceProducts(): Promise<Product[] | null> {
  // 🧠 DEDUP IN-FLIGHT: Si otra petición simultánea ya está consultando el catálogo en esta instancia, esperar su promesa
  if (productsCachePromise) {
    writeLog(`[CACHE DEDUP] Another fetch is in-flight, waiting for it...`);
    return productsCachePromise;
  }

  productsCachePromise = (async () => {
    try {
      const result = await _fetchProductsFromAPI();
      return rewriteProductImageUrls(result);
    } finally {
      productsCachePromise = null;
    }
  })();

  return productsCachePromise;
}

/**
 * Internal: Actually fetches products from WooCommerce API
 */
async function _fetchProductsFromAPI(): Promise<Product[] | null> {
  writeLog(`[INIT] fetchWooCommerceProducts: WOOCOMMERCE_URL="${WOOCOMMERCE_URL}", CK=${CK ? 'SET' : 'MISSING'}, CS=${CS ? 'SET' : 'MISSING'}`);

  if (!CK || !CS || !WOOCOMMERCE_URL) {
    writeLog("[ERROR] fetchWooCommerceProducts: Missing WooCommerce credentials or URL environment variables.");
    console.error("Missing WooCommerce credentials.");
    return loadBackupData<Product>('backup-products.json');
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${CK}:${CS}`).toString('base64')}`;
    
    const isVercel = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
    const timeoutMs = 9000;
    const maxRetries = isVercel ? 2 : 3;

    const fetchPage = async (page: number): Promise<Product[]> => {
      const url = `${WOOCOMMERCE_URL}/products?per_page=80&page=${page}&status=publish`;
      
      try {
        writeLog(`[FETCH] Page ${page} requesting: ${url}`);
        const response = await fetchWithRetry(url, {
          method: "GET",
          headers: {
            "Authorization": authHeader,
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "ComercialPatagonia-B2B-Agent/1.0"
          },
          next: {
            revalidate: REVALIDATE_SECONDS,
            tags: ["products"]
          }
        }, timeoutMs, maxRetries);
        
        writeLog(`[RESPONSE] Page ${page} received. Status: ${response.status} ok: ${response.ok}`);
        
        if (!response.ok) {
          writeLog(`[ERROR] Page ${page} request failed with HTTP status ${response.status}`);
          return [];
        }
        
        const json = await response.json();
        if (!Array.isArray(json)) {
          writeLog(`[ERROR] Page ${page} returned a non-array response. Response detail: ${JSON.stringify(json)}`);
          return [];
        }
        
        writeLog(`[SUCCESS] Page ${page} successfully fetched ${json.length} products.`);
        return json as Product[];
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        writeLog(`[EXCEPTION] Page ${page} failed after retries: ${msg}`, err);
        return [];
      }
    };

    // Fetch pages sequentially to avoid Netlify timeouts / Hostinger blocking
    const pages: Product[][] = [];
    for (let i = 1; i <= 6; i++) {
      const pageData = await fetchPage(i);
      if (!pageData || pageData.length === 0) {
        writeLog(`[LOOP_BREAK] Stopped product loop at page ${i} (no more products or connection failed).`);
        break;
      }
      pages.push(pageData);
    }

    // Flatten all pages into a single array
    const allProducts = pages.flat();
    
    if (allProducts.length > 0) {
      writeLog(`[COMPLETE] fetchWooCommerceProducts completed. Total real products flattened: ${allProducts.length}`);
      return allProducts;
    } else {
      writeLog(`[FALLBACK] No products could be retrieved. Loading offline static backup...`);
      return loadBackupData<Product>('backup-products.json');
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    writeLog(`[FATAL EXCEPTION] fetchWooCommerceProducts caught error: ${msg}. Falling back to disk backup...`, error);
    console.error("WooCommerce Fetch Error:", error);
    return loadBackupData<Product>('backup-products.json');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🗂️ CATEGORIES FETCH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Fetches categories from WooCommerce (with deduplication cache and backup fallback)
 */
export async function fetchWooCommerceCategories(): Promise<CategoryItem[] | null> {
  // 🧠 DEDUP IN-FLIGHT: Si otra petición simultánea ya está consultando categorías en esta instancia, unirse a ella
  if (categoriesCachePromise) {
    writeLog(`[CACHE DEDUP] Categories fetch in-flight, waiting...`);
    return categoriesCachePromise;
  }

  categoriesCachePromise = (async () => {
    try {
      const result = await _fetchCategoriesFromAPI();
      return rewriteCategoryImageUrls(result);
    } finally {
      categoriesCachePromise = null;
    }
  })();

  return categoriesCachePromise;
}

/**
 * Internal: Actually fetches categories from WooCommerce API
 */
async function _fetchCategoriesFromAPI(): Promise<CategoryItem[] | null> {
  writeLog(`[INIT] fetchWooCommerceCategories: WOOCOMMERCE_URL="${WOOCOMMERCE_URL}"`);
  if (!CK || !CS || !WOOCOMMERCE_URL) {
    writeLog("[ERROR] fetchWooCommerceCategories: Missing credentials or URL.");
    return loadBackupData<CategoryItem>('backup-categories.json');
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${CK}:${CS}`).toString('base64')}`;
    const authUrl = `${WOOCOMMERCE_URL}/products/categories?per_page=100&hide_empty=true`;
    
    const isVercel = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
    const timeoutMs = 9000;
    const maxRetries = isVercel ? 2 : 3;

    writeLog(`[FETCH] Categories requesting: ${authUrl}`);
    const response = await fetchWithRetry(authUrl, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "ComercialPatagonia-B2B-Agent/1.0"
      },
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["categories"]
      }
    }, timeoutMs, maxRetries);

    writeLog(`[RESPONSE] Categories received. Status: ${response.status} ok: ${response.ok}`);
    
    if (!response.ok) {
      writeLog(`[ERROR] Categories request failed with HTTP status ${response.status}`);
      return loadBackupData<CategoryItem>('backup-categories.json');
    }
    
    const data = await response.json();
    if (!Array.isArray(data)) {
      writeLog(`[ERROR] Categories did not return an array. Response detail: ${JSON.stringify(data)}`);
      return loadBackupData<CategoryItem>('backup-categories.json');
    }
    
    const filtered = (data as CategoryItem[]).filter((cat) => cat.slug !== 'uncategorized');
    writeLog(`[SUCCESS] Categories fetched successfully: ${filtered.length} categories.`);
    
    return filtered;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    writeLog(`[FATAL EXCEPTION] fetchWooCommerceCategories caught error: ${msg}. Falling back to disk backup...`, error);
    console.error("WooCommerce Categories Fetch Error:", error);
    return loadBackupData<CategoryItem>('backup-categories.json');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🏷️ CATEGORY PRODUCTS FETCH (CYBER & ESPECIALES)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


/**
 * Fetches products by category slug (dedicated query, e.g. limit = 8 for Cyber)
 */
export async function fetchWooCommerceProductsByCategorySlug(slug: string, limit = 8): Promise<Product[]> {
  const cacheKey = `${slug.toLowerCase()}_${limit}`;

  // 🧠 DEDUP IN-FLIGHT: Si otra petición simultánea ya está consultando esta categoría, unirse a ella
  if (categoryProductsPromises[cacheKey]) {
    writeLog(`[DEDUP] Joining existing category products fetch for "${slug}"`);
    return categoryProductsPromises[cacheKey]!;
  }

  categoryProductsPromises[cacheKey] = (async () => {
    try {
      return await _fetchProductsByCategorySlugFromAPI(slug, limit);
    } finally {
      categoryProductsPromises[cacheKey] = null;
    }
  })();

  return categoryProductsPromises[cacheKey]!;
}

/**
 * Internal: Fetches products by category from WooCommerce API
 */
async function _fetchProductsByCategorySlugFromAPI(slug: string, limit: number): Promise<Product[]> {
  const normalizedSlug = slug.toLowerCase().trim();
  writeLog(`[INIT] fetchWooCommerceProductsByCategorySlug: slug="${slug}", limit=${limit}`);

  if (!CK || !CS || !WOOCOMMERCE_URL) {
    writeLog("[ERROR] fetchWooCommerceProductsByCategorySlug: Missing credentials or URL.");
    return _fallbackCategoryProducts(normalizedSlug, limit);
  }

  try {
    // 1. Resolve numeric category ID
    let categoryId: number | null = null;
    if (normalizedSlug === "cyberday" || normalizedSlug === "cybermonday" || normalizedSlug === "cyber") {
      categoryId = 87; // ID conocido de CyberDay en WooCommerce
    } else {
      const categories = await fetchWooCommerceCategories();
      const matched = categories?.find(
        (c) => c.slug.toLowerCase() === normalizedSlug || c.name.toLowerCase() === normalizedSlug
      );
      if (matched) categoryId = matched.id;
    }

    if (!categoryId) {
      writeLog(`[WARN] Category slug "${slug}" not found. Falling back to local filter...`);
      return _fallbackCategoryProducts(normalizedSlug, limit);
    }

    const authHeader = `Basic ${Buffer.from(`${CK}:${CS}`).toString('base64')}`;
    const endpoint = `${WOOCOMMERCE_URL}/products?category=${categoryId}&per_page=${limit}&status=publish`;

    const isVercel = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
    const timeoutMs = 9000;
    const maxRetries = isVercel ? 2 : 3;

    const categoryTags = ["products", `category:${normalizedSlug}`];
    if (normalizedSlug === "cyberday" || normalizedSlug === "cybermonday" || normalizedSlug === "cyber") {
      categoryTags.push("cyber-products");
    }

    writeLog(`[FETCH] Category products requesting: ${endpoint}`);
    const response = await fetchWithRetry(endpoint, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "ComercialPatagonia-B2B-Agent/1.0"
      },
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: categoryTags
      }
    }, timeoutMs, maxRetries);

    if (!response.ok) {
      writeLog(`[ERROR] Category products request failed with HTTP ${response.status}`);
      return _fallbackCategoryProducts(normalizedSlug, limit);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      writeLog(`[ERROR] Category products did not return array: ${JSON.stringify(data)}`);
      return _fallbackCategoryProducts(normalizedSlug, limit);
    }

    const products = (rewriteProductImageUrls(data as Product[]) || []) as Product[];
    writeLog(`[SUCCESS] Category products for "${slug}" fetched: ${products.length} products.`);
    return products;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    writeLog(`[EXCEPTION] fetchWooCommerceProductsByCategorySlug error: ${msg}. Using fallback...`, error);
    return _fallbackCategoryProducts(normalizedSlug, limit);
  }
}

/**
 * Fallback: filters backup products by category slug/name
 */
async function _fallbackCategoryProducts(slug: string, limit: number): Promise<Product[]> {
  const allBackup = (await loadBackupData<Product>('backup-products.json')) || [];
  const filtered = allBackup.filter((p) =>
    p.categories.some(
      (c) =>
        c.slug.toLowerCase() === slug ||
        c.name.toLowerCase() === slug ||
        (slug === "cyberday" && (c.slug.toLowerCase() === "cyber" || c.name.toLowerCase().includes("cyber")))
    )
  );
  return (rewriteProductImageUrls(filtered.slice(0, limit)) || []) as Product[];
}


