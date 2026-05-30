// 🛍️ WOOCOMMERCE API CLIENT CONFIGURATION
// Status: CONNECTED 🏔️🔌 WITH IN-MEMORY CACHE + RETRIES + STATIC JSON BACKUP
// Fix: Deduplication cache to prevent re-fetch storms, backoff retries, and offline backup filesystem cache

import { writeLog } from './logger';
import cyberProductsData from '../data/cyber-products.json';

interface CyberExcelProduct {
  sku: string;
  name: string;
  regular_price: number;
  sale_price: number;
  discount_pct: number;
}

const cyberProductsArray = cyberProductsData as CyberExcelProduct[];
const cyberProductsMap = new Map<string, { name: string; regular_price: number; sale_price: number; discount_pct: number; cyber_order_index: number }>();

cyberProductsArray.forEach((item, index) => {
  cyberProductsMap.set(item.sku, {
    name: item.name,
    regular_price: item.regular_price,
    sale_price: item.sale_price,
    discount_pct: item.discount_pct,
    cyber_order_index: index
  });
});

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
 * 🏷️ AUTOMATIC CYBER DISCOUNTS ENGINE
 * Computes and simulates a 25% discount for products in the 'cybermonday' category
 * if they do not have an active sale price configured in WooCommerce.
 */
function applyCyberDiscounts(products: any[] | null): any[] | null {
  if (!products || !Array.isArray(products)) return products;
  
  const matchedSkus = new Set<string>();
  
  const updatedProducts = products.map(product => {
    const sku = product.sku ? product.sku.toString().trim().replace('.0', '') : '';
    
    // Check if product is in our Excel JSON list
    const excelPromo = sku ? cyberProductsMap.get(sku) : undefined;
    
    if (excelPromo) {
      matchedSkus.add(sku);
      // 1. Ensure the product is marked as being in the 'cybermonday' and 'cyberday' categories
      const cleanCategories = (product.categories || []).filter(
        (cat: any) => cat.slug && cat.slug.toLowerCase() !== "cybermonday" && cat.slug.toLowerCase() !== "cyberday"
      );
      
      const injectedCategories = [
        { id: 9999, name: "Cyberday", slug: "cybermonday" },
        { id: 9998, name: "Cyberday", slug: "cyberday" },
        ...cleanCategories
      ];
      
      // 2. Override name, prices, metadata, and images if there is a backend SKU conflict
      const nameDiffers = product.name.toLowerCase().trim() !== excelPromo.name.toLowerCase().trim();
      let images = product.images;
      
      if (nameDiffers) {
        let imageUrl = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop"; // Living/Hogar genérico elegante
        const nameLower = excelPromo.name.toLowerCase();
        if (nameLower.includes("piso") || nameLower.includes("flotante") || nameLower.includes("madera")) {
          imageUrl = "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=600&auto=format&fit=crop";
        } else if (nameLower.includes("llave") || nameLower.includes("monomando") || nameLower.includes("griferia") || nameLower.includes("ducha")) {
          imageUrl = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop";
        } else if (nameLower.includes("ropero") || nameLower.includes("estante") || nameLower.includes("mueble") || nameLower.includes("organizador")) {
          imageUrl = "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop";
        } else if (nameLower.includes("adhesivo") || nameLower.includes("frague") || nameLower.includes("pegamento")) {
          imageUrl = "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?q=80&w=600&auto=format&fit=crop";
        } else if (nameLower.includes("prot.") || nameLower.includes("lasur") || nameLower.includes("pintura") || nameLower.includes("barniz")) {
          imageUrl = "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop";
        }
        
        images = [
          {
            id: 0,
            src: imageUrl,
            name: excelPromo.name,
            alt: excelPromo.name
          }
        ];
      }

      return {
        ...product,
        name: excelPromo.name, // Force name to match Excel!
        images: images,        // Force correct image if conflict
        categories: injectedCategories,
        regular_price: excelPromo.regular_price.toString(),
        price: excelPromo.sale_price.toString(),
        sale_price: excelPromo.sale_price.toString(),
        on_sale: true,
        cyber_order_index: excelPromo.cyber_order_index
      };
    } else {
      // If it's NOT in the Excel list, remove any cyber categories it might have in WooCommerce
      const cleanCategories = (product.categories || []).filter(
        (cat: any) => cat.slug && cat.slug.toLowerCase() !== "cybermonday" && cat.slug.toLowerCase() !== "cyberday"
      );
      
      return {
        ...product,
        categories: cleanCategories
      };
    }
  });

  // 🪄 INYECTAR PRODUCTOS VIRTUALES PARA AQUELLOS ELEMENTOS DEL EXCEL QUE NO ESTÉN CREADOS EN WOOCOMMERCE
  cyberProductsArray.forEach((excelPromo, index) => {
    if (!matchedSkus.has(excelPromo.sku)) {
      // Determinar una imagen premium y contextual según el nombre del producto
      let imageUrl = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop"; // Living/Hogar genérico elegante
      
      const nameLower = excelPromo.name.toLowerCase();
      if (nameLower.includes("piso") || nameLower.includes("flotante") || nameLower.includes("madera")) {
        imageUrl = "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=600&auto=format&fit=crop"; // Piso de madera premium
      } else if (nameLower.includes("llave") || nameLower.includes("monomando") || nameLower.includes("griferia") || nameLower.includes("ducha")) {
        imageUrl = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop"; // Grifería de baño de alta gama
      } else if (nameLower.includes("ropero") || nameLower.includes("estante") || nameLower.includes("mueble") || nameLower.includes("organizador")) {
        imageUrl = "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop"; // Mueble/Organizador
      } else if (nameLower.includes("adhesivo") || nameLower.includes("frague") || nameLower.includes("pegamento")) {
        imageUrl = "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?q=80&w=600&auto=format&fit=crop"; // Construcción/Materiales
      }

      updatedProducts.push({
        id: 9999000 + index,
        name: excelPromo.name,
        slug: `cyber-virtual-${excelPromo.sku}`,
        permalink: `#`,
        description: `Producto de la campaña Cyberday (SKU: ${excelPromo.sku}).`,
        short_description: `Campaña Especial Cyberday - Descuento del ${excelPromo.discount_pct}%`,
        sku: excelPromo.sku,
        price: excelPromo.sale_price.toString(),
        regular_price: excelPromo.regular_price.toString(),
        sale_price: excelPromo.sale_price.toString(),
        on_sale: true,
        stock_status: 'instock',
        images: [
          {
            id: 0,
            src: imageUrl,
            name: excelPromo.name,
            alt: excelPromo.name
          }
        ],
        categories: [
          { id: 9999, name: "Cyberday", slug: "cybermonday" },
          { id: 9998, name: "Cyberday", slug: "cyberday" }
        ],
        attributes: [],
        cyber_order_index: index
      });
    }
  });

  return updatedProducts;
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
    const processedResult = applyCyberDiscounts(result);
    productsCache = { data: processedResult, timestamp: Date.now() };
    return processedResult;
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
  } catch (error: any) {
    writeLog(`[FATAL EXCEPTION] fetchWooCommerceCategories caught error: ${error.message || error}. Falling back to disk backup...`, error);
    console.error("WooCommerce Categories Fetch Error:", error);
    return loadBackupData('backup-categories.json');
  }
}
