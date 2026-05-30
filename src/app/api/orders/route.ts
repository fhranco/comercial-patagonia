import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const CK = process.env.WOOCOMMERCE_CK;
  const CS = process.env.WOOCOMMERCE_CS;
  const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;

  if (!CK || !CS || !WOO_URL) {
    console.error("Critical: Missing WooCommerce Credentials in Server.");
    return NextResponse.json({ error: "Faltan credenciales del servidor WooCommerce" }, { status: 500 });
  }

  try {
    const { name, email, phone, projectName, cart } = await request.json();

    if (!name || !email || !phone || !cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Datos del cliente o carrito incompletos" }, { status: 400 });
    }

    const authHeader = Buffer.from(`${CK}:${CS}`).toString('base64');
    
    // Format order for WooCommerce REST API
    const orderData = {
      payment_method: "b2b_quote",
      payment_method_title: "Cotización B2B (Web)",
      set_paid: false,
      status: "on-hold", // "on-hold" is perfect for quote requests as it holds stock but awaits manual processing
      billing: {
        first_name: name,
        last_name: "",
        address_1: "Región de Magallanes",
        city: "Punta Arenas",
        state: "Magallanes",
        postcode: "6200000",
        country: "CL",
        email: email,
        phone: phone
      },
      shipping: {
        first_name: name,
        last_name: "",
        address_1: "Región de Magallanes",
        city: "Punta Arenas",
        state: "Magallanes",
        postcode: "6200000",
        country: "CL"
      },
      line_items: cart.map((item: any) => ({
        product_id: item.id,
        quantity: item.quantity
      })),
      customer_note: projectName ? `Obra/Proyecto: ${projectName}` : "Cotización General B2B",
      meta_data: [
        {
          key: "b2b_project_name",
          value: projectName || ""
        },
        {
          key: "_b2b_quote_source",
          value: "B2B Web Portal"
        }
      ]
    };

    const response = await fetch(`${WOO_URL.replace(/\/$/, "")}/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json",
        "User-Agent": "PatagoniaCommerce-B2B/1.0"
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[WooCommerce REST API Error] Status: ${response.status}. Response: ${errorText}`);
      return NextResponse.json({ 
        error: "Error al comunicarse con WooCommerce", 
        status: response.status,
        details: errorText 
      }, { status: 502 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      orderId: data.id,
      orderNumber: data.number,
      total: data.total,
      status: data.status
    });

  } catch (error: any) {
    console.error("API POST /api/orders error:", error);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
