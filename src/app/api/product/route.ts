import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  const CK = process.env.WOOCOMMERCE_CK;
  const CS = process.env.WOOCOMMERCE_CS;
  const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://darkorange-bat-658298.hostingersite.com/wp-json/wc/v3";
  
  const authHeader = Buffer.from(`${CK}:${CS}`).toString('base64');
  const authUrl = `${WOO_URL}/products/${id}`;

  try {
    const response = await fetch(authUrl, {
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      cache: 'no-store'
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from WooCommerce" }, { status: 500 });
  }
}
