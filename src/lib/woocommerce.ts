// 🛍️ WOOCOMMERCE API CLIENT CONFIGURATION
// Status: CONNECTED 🏔️🔌

export const WOOCOMMERCE_URL = (process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "").replace(/\/$/, "");
const CK = process.env.WOOCOMMERCE_CK || "";
const CS = process.env.WOOCOMMERCE_CS || "";

/**
 * Fetches products from your WooCommerce server
 */
export async function fetchWooCommerceProducts() {
  if (!CK || !CS || !WOOCOMMERCE_URL) {
    console.error("Missing WooCommerce credentials.");
    return null;
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${CK}:${CS}`).toString('base64')}`;
    
    const fetchPage = async (page: number) => {
      const url = `${WOOCOMMERCE_URL}/products?per_page=80&page=${page}&status=publish`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": authHeader,
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "ComercialPatagonia-B2B-Agent/1.0"
        },
        next: { revalidate: 0 } // Desactivar cache temporalmente para debug
      });
      
      if (!response.ok) return [];
      return await response.json();
    };

    // Fetch 5 pages concurrently to maximize speed and bypass 100 limit
    const pages = await Promise.all([
      fetchPage(1),
      fetchPage(2),
      fetchPage(3),
      fetchPage(4),
      fetchPage(5)
    ]);

    // Flatten all pages into a single array
    const allProducts = pages.flat();
    
    return allProducts.length > 0 ? allProducts : null;
  } catch (error) {
    console.error("WooCommerce Fetch Error:", error);
    return null;
  }
}

/**
 * Fetches categories from WooCommerce
 */
export async function fetchWooCommerceCategories() {
  if (!CK || !CS || !WOOCOMMERCE_URL) return null;

  try {
    const authHeader = `Basic ${Buffer.from(`${CK}:${CS}`).toString('base64')}`;
    const authUrl = `${WOOCOMMERCE_URL}/products/categories?per_page=100&hide_empty=true`;
    
    const response = await fetch(authUrl, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "ComercialPatagonia-B2B-Agent/1.0"
      },
      next: { revalidate: 3600 } 
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.filter((cat: any) => cat.slug !== 'uncategorized');
  } catch (error) {
    console.error("WooCommerce Categories Fetch Error:", error);
    return null;
  }
}
