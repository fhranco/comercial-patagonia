// 🛍️ WOOCOMMERCE API CLIENT CONFIGURATION
// Status: CONNECTED 🏔️🔌 WITH IN-MEMORY CACHE + RETRIES + STATIC JSON BACKUP
// Fix: Deduplication cache to prevent re-fetch storms, backoff retries, and offline backup filesystem cache

import { writeLog } from './logger';

export const WOOCOMMERCE_URL = (process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "").replace(/\/$/, "");
const CK = process.env.WOOCOMMERCE_CK || "";
const CS = process.env.WOOCOMMERCE_CS || "";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧠 IN-MEMORY CACHE — Prevents re-fetch storm
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

let productsCache: CacheEntry<any[] | null> | null = null;
let productsCachePromise: Promise<any[] | null> | null = null;

let categoriesCache: CacheEntry<any[] | null> | null = null;
let categoriesCachePromise: Promise<any[] | null> | null = null;

function isCacheValid<T>(cache: CacheEntry<T> | null): cache is CacheEntry<T> {
  return cache !== null && (Date.now() - cache.timestamp) < CACHE_TTL_MS;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💾 PERSISTENT FILE BACKUP (Offline / Crash Recovery)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function saveBackupData(filename: string, data: any) {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const dir = path.join(process.cwd(), 'src/data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2), 'utf-8');
    writeLog(`[BACKUP WRITE] Successfully saved offline backup to ${filename} (${data.length} items)`);
  } catch (error: any) {
    writeLog(`[BACKUP WRITE ERROR] Could not save offline backup: ${error.message || error}`);
  }
}

async function loadBackupData(filename: string): Promise<any[] | null> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'src/data', filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        writeLog(`[BACKUP READ] Loaded ${parsed.length} actual items from local fallback backup: ${filename}`);
        return parsed;
      }
    }
  } catch (error: any) {
    writeLog(`[BACKUP READ ERROR] Could not load local fallback from ${filename}: ${error.message || error}`);
  }
  return null;
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
  let lastError: any;
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
    } catch (err: any) {
      clearTimeout(timeoutId);
      lastError = err;
      writeLog(`[RETRY ERROR] Attempt ${attempt}/${maxRetries} failed: ${err.message || err}`);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 250; // 500ms, 1000ms, 2000ms
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError || new Error(`Request failed after ${maxRetries} attempts`);
}

/**
 * Fetches products from your WooCommerce server (with deduplication cache and backup fallback)
 */
export async function fetchWooCommerceProducts() {
  // 🧠 CACHE HIT — Return immediately without touching the network
  if (isCacheValid(productsCache)) {
    writeLog(`[CACHE HIT] Products returned from memory cache (${productsCache.data?.length ?? 0} products, age: ${Math.round((Date.now() - productsCache.timestamp) / 1000)}s)`);
    return productsCache.data;
  }

  // 🧠 DEDUP — If another render is already fetching, piggyback on it
  if (productsCachePromise) {
    writeLog(`[CACHE DEDUP] Another fetch is in-flight, waiting for it...`);
    return productsCachePromise;
  }

  // 🚀 FRESH FETCH — Only happens once per TTL window
  productsCachePromise = _fetchProductsFromAPI();

  try {
    const result = await productsCachePromise;
    productsCache = { data: result, timestamp: Date.now() };
    return result;
  } finally {
    productsCachePromise = null;
  }
}

/**
 * Internal: Actually fetches products from WooCommerce API
 */
async function _fetchProductsFromAPI(): Promise<any[] | null> {
  writeLog(`[INIT] fetchWooCommerceProducts: WOOCOMMERCE_URL="${WOOCOMMERCE_URL}", CK=${CK ? 'SET' : 'MISSING'}, CS=${CS ? 'SET' : 'MISSING'}`);

  if (!CK || !CS || !WOOCOMMERCE_URL) {
    writeLog("[ERROR] fetchWooCommerceProducts: Missing WooCommerce credentials or URL environment variables.");
    console.error("Missing WooCommerce credentials.");
    return loadBackupData('backup-products.json');
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${CK}:${CS}`).toString('base64')}`;
    
    const isVercel = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
    const timeoutMs = isVercel ? 2000 : 8000;
    const maxRetries = isVercel ? 1 : 3;

    const fetchPage = async (page: number) => {
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
          next: { revalidate: 3600 }
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
        return json;
      } catch (err: any) {
        writeLog(`[EXCEPTION] Page ${page} failed after retries: ${err.message || err}`, err);
        return [];
      }
    };

    // Fetch pages sequentially to avoid Netlify timeouts / Hostinger blocking
    const pages = [];
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
      // Save to disk backup asynchronously for future offline/crash fallback
      saveBackupData('backup-products.json', allProducts);
      return allProducts;
    } else {
      writeLog(`[FALLBACK] No products could be retrieved. Loading offline static backup...`);
      return loadBackupData('backup-products.json');
    }
  } catch (error: any) {
    writeLog(`[FATAL EXCEPTION] fetchWooCommerceProducts caught error: ${error.message || error}. Falling back to disk backup...`, error);
    console.error("WooCommerce Fetch Error:", error);
    return loadBackupData('backup-products.json');
  }
}

/**
 * Fetches categories from WooCommerce (with deduplication cache and backup fallback)
 */
export async function fetchWooCommerceCategories() {
  // 🧠 CACHE HIT
  if (isCacheValid(categoriesCache)) {
    writeLog(`[CACHE HIT] Categories returned from memory cache (age: ${Math.round((Date.now() - categoriesCache.timestamp) / 1000)}s)`);
    return categoriesCache.data;
  }

  // 🧠 DEDUP
  if (categoriesCachePromise) {
    writeLog(`[CACHE DEDUP] Categories fetch in-flight, waiting...`);
    return categoriesCachePromise;
  }

  categoriesCachePromise = _fetchCategoriesFromAPI();

  try {
    const result = await categoriesCachePromise;
    categoriesCache = { data: result, timestamp: Date.now() };
    return result;
  } finally {
    categoriesCachePromise = null;
  }
}

/**
 * Internal: Actually fetches categories from WooCommerce API
 */
async function _fetchCategoriesFromAPI(): Promise<any[] | null> {
  writeLog(`[INIT] fetchWooCommerceCategories: WOOCOMMERCE_URL="${WOOCOMMERCE_URL}"`);
  if (!CK || !CS || !WOOCOMMERCE_URL) {
    writeLog("[ERROR] fetchWooCommerceCategories: Missing credentials or URL.");
    return loadBackupData('backup-categories.json');
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${CK}:${CS}`).toString('base64')}`;
    const authUrl = `${WOOCOMMERCE_URL}/products/categories?per_page=100&hide_empty=true`;
    
      const isVercel = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
      const timeoutMs = isVercel ? 2000 : 8000;
      const maxRetries = isVercel ? 1 : 3;

      writeLog(`[FETCH] Categories requesting: ${authUrl}`);
      const response = await fetchWithRetry(authUrl, {
        method: "GET",
        headers: {
          "Authorization": authHeader,
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "ComercialPatagonia-B2B-Agent/1.0"
        },
        next: { revalidate: 3600 }
      }, timeoutMs, maxRetries);

      writeLog(`[RESPONSE] Categories received. Status: ${response.status} ok: ${response.ok}`);
      
      if (!response.ok) {
        writeLog(`[ERROR] Categories request failed with HTTP status ${response.status}`);
        return loadBackupData('backup-categories.json');
      }
      
      const data = await response.json();
      if (!Array.isArray(data)) {
        writeLog(`[ERROR] Categories did not return an array. Response detail: ${JSON.stringify(data)}`);
        return loadBackupData('backup-categories.json');
      }
      
      const filtered = data.filter((cat: { slug: string }) => cat.slug !== 'uncategorized');
      writeLog(`[SUCCESS] Categories fetched successfully: ${filtered.length} categories.`);
      
      // Save offline backup asynchronously
      saveBackupData('backup-categories.json', filtered);
      return filtered;
    } catch (err: any) {
      writeLog(`[EXCEPTION] Categories failed after retries: ${err.message || err}. Falling back to disk backup...`, err);
      return loadBackupData('backup-categories.json');
    }
  } catch (error: any) {
    writeLog(`[FATAL EXCEPTION] fetchWooCommerceCategories caught error: ${error.message || error}. Falling back to disk backup...`, error);
    console.error("WooCommerce Categories Fetch Error:", error);
    return loadBackupData('backup-categories.json');
  }
}
