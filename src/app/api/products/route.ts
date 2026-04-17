import { NextResponse } from 'next/server';

export async function GET() {
  // 🔍 Diagnóstico de Sonda Master
  const CK = process.env.WOOCOMMERCE_CK;
  const CS = process.env.WOOCOMMERCE_CS;
  const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;

  if (!CK || !CS || !WOO_URL) {
    console.error("Critical: Missing WooCommerce Credentials in Vercel.");
    return NextResponse.json({ error: "Faltan credenciales en Vercel" }, { status: 500 });
  }

  try {
    const authHeader = Buffer.from(`${CK}:${CS}`).toString('base64');
    
    // WooCommerce max per_page is 100. We fetch up to 500 (pages 1-5).
    const fetchPage = async (page: number) => {
      const url = `${WOO_URL}/products?per_page=100&page=${page}&status=publish&_fields=id,name,price,regular_price,on_sale,images,categories,sku`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${authHeader}`,
          "Content-Type": "application/json",
          "User-Agent": "PatagoniaCommerce-Bridge/1.0"
        },
        next: { revalidate: 3600 } 
      });
      return response.ok ? await response.json() : [];
    };

    const pages = await Promise.all([
      fetchPage(1),
      fetchPage(2),
      fetchPage(3),
      fetchPage(4),
      fetchPage(5)
    ]);

    const data = pages.flat();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Error Interno", details: error.message }, { status: 500 });
  }
}
