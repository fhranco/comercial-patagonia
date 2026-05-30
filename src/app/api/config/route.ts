import { NextResponse } from 'next/server';

export async function GET() {
  const CK = process.env.WOOCOMMERCE_CK;
  const CS = process.env.WOOCOMMERCE_CS;
  const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;

  if (!CK || !CS || !WOO_URL) {
    return NextResponse.json({ error: "Faltan credenciales del servidor WooCommerce" }, { status: 500 });
  }

  return NextResponse.json({
    url: WOO_URL,
    ck: CK,
    cs: CS
  });
}
