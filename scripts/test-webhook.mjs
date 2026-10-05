import crypto from "crypto";

const PORT = process.env.PORT || "3005";
const BASE_URL = `http://127.0.0.1:${PORT}`;
const ENDPOINT = `${BASE_URL}/api/revalidate/woocommerce`;
const TEST_SECRET = process.env.WOOCOMMERCE_WEBHOOK_SECRET || "test_secret_patagonia_2026";

function computeSignature(payloadString, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(payloadString, "utf8")
    .digest("base64");
}

async function runTests() {
  console.log("=================================================");
  console.log(`🧪 TEST SUITE: WEBHOOK REVALIDACIÓN WOOCOMMERCE`);
  console.log(`🎯 URL: ${ENDPOINT}`);
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASÓ: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FALLÓ: ${message}`);
      failed++;
    }
  }

  // Esperar a que el servidor responda
  console.log("⏳ Esperando disponibilidad del servidor...");
  let serverReady = false;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/revalidate/woocommerce`, { method: "GET" });
      if (res.status === 405) {
        serverReady = true;
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (!serverReady) {
    console.error("❌ El servidor Next.js no respondió en el tiempo esperado.");
    process.exit(1);
  }
  console.log("🚀 Servidor en línea. Ejecutando pruebas...\n");

  // CASO 1: Firma inválida
  console.log("🔹 Caso 1: Firma inválida o ausente");
  {
    const payload = JSON.stringify({ id: 101, name: "Cemento Comodoro" });
    const fakeSignature = "invalid_signature_base64==";

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-wc-webhook-signature": fakeSignature,
        "x-wc-webhook-topic": "product.updated"
      },
      body: payload
    });

    const body = await res.json();
    assert(res.status === 401, `Status esperado 401, obtenido ${res.status}`);
    assert(body.error === "Invalid webhook signature", `Mensaje esperado 'Invalid webhook signature', obtenido '${body.error}'`);
  }

  // CASO 2: product.updated válido (producto estándar)
  console.log("\n🔹 Caso 2: product.updated válido");
  {
    const payload = JSON.stringify({
      id: 554,
      slug: "cemento-comodoro-25kg",
      name: "Cemento Comodoro 25kg",
      categories: [{ id: 10, name: "Materiales", slug: "materiales" }],
      price: "4990",
      stock_status: "instock"
    });
    const validSignature = computeSignature(payload, TEST_SECRET);

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-wc-webhook-signature": validSignature,
        "x-wc-webhook-topic": "product.updated"
      },
      body: payload
    });

    const body = await res.json();
    assert(res.status === 200, `Status esperado 200, obtenido ${res.status}`);
    assert(body.revalidated === true, "revalidated debe ser true");
    assert(body.tags.includes("product:554"), "Tags debe incluir 'product:554'");
    assert(body.tags.includes("product-slug:cemento-comodoro-25kg"), "Tags debe incluir slug");
    assert(body.tags.includes("products"), "Tags debe incluir 'products'");
    assert(!body.tags.includes("cyber-products"), "No debe revalidar 'cyber-products' para producto no-cyber");
    assert(body.paths.includes("/tienda/cemento-comodoro-25kg"), "Paths debe incluir /tienda/cemento-comodoro-25kg");
    assert(body.paths.includes("/tienda"), "Paths debe incluir /tienda");
    assert(body.paths.includes("/"), "Paths debe incluir /");
  }

  // CASO 3: Producto Cyber
  console.log("\n🔹 Caso 3: Producto Cyber (debe revalidar cyber-products y Home)");
  {
    const payload = JSON.stringify({
      id: 777,
      slug: "ropero-cyber-patagonia",
      name: "Ropero Zanzini Cyber",
      categories: [
        { id: 87, name: "CyberDay", slug: "cyberday" },
        { id: 22, name: "Muebles", slug: "muebles" }
      ],
      price: "89990"
    });
    const validSignature = computeSignature(payload, TEST_SECRET);

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-wc-webhook-signature": validSignature,
        "x-wc-webhook-topic": "product.updated"
      },
      body: payload
    });

    const body = await res.json();
    assert(res.status === 200, `Status esperado 200, obtenido ${res.status}`);
    assert(body.revalidated === true, "revalidated debe ser true");
    assert(body.isCyber === true, "isCyber debe ser true");
    assert(body.tags.includes("cyber-products"), "Tags debe incluir 'cyber-products'");
    assert(body.tags.includes("product:777"), "Tags debe incluir 'product:777'");
    assert(body.paths.includes("/"), "Paths debe incluir /");
  }

  // CASO 4: Payload corrupto
  console.log("\n🔹 Caso 4: Payload corrupto / malformado");
  {
    const malformedBody = "{ id: 101, name: 'broken json"; // no es JSON válido
    const signature = computeSignature(malformedBody, TEST_SECRET);

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-wc-webhook-signature": signature,
        "x-wc-webhook-topic": "product.updated"
      },
      body: malformedBody
    });

    const body = await res.json();
    assert(res.status === 400, `Status esperado 400, obtenido ${res.status}`);
    assert(body.error === "Malformed JSON payload", `Error esperado 'Malformed JSON payload', obtenido '${body.error}'`);
  }

  // CASO 5: Evento desconocido / recurso no relacionado
  console.log("\n🔹 Caso 5: Evento desconocido / no producto (ej: order.created)");
  {
    const payload = JSON.stringify({
      id: 9999,
      status: "completed",
      total: "150000"
    });
    const signature = computeSignature(payload, TEST_SECRET);

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-wc-webhook-signature": signature,
        "x-wc-webhook-topic": "order.created",
        "x-wc-webhook-resource": "order"
      },
      body: payload
    });

    const body = await res.json();
    assert(res.status === 200, `Status esperado 200, obtenido ${res.status}`);
    assert(body.revalidated === false, "revalidated debe ser false para eventos ignorados");
    assert(body.message.includes("Ignored non-product event"), "Mensaje debe indicar que el evento fue ignorado");
  }

  // CASO EXTRA: Ping de verificación WooCommerce
  console.log("\n🔹 Caso Extra: Ping de verificación WooCommerce");
  {
    const payload = JSON.stringify({ webhook_id: 12 });
    const signature = computeSignature(payload, TEST_SECRET);

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-wc-webhook-signature": signature,
        "x-wc-webhook-topic": "action.woocommerce_webhook_ping"
      },
      body: payload
    });

    const body = await res.json();
    assert(res.status === 200, `Status esperado 200, obtenido ${res.status}`);
    assert(body.event === "ping", "Evento debe ser ping");
  }

  // CASO EXTRA: GET rechazo 405
  console.log("\n🔹 Caso Extra: Método GET no permitido (405)");
  {
    const res = await fetch(ENDPOINT, { method: "GET" });
    assert(res.status === 405, `Status esperado 405, obtenido ${res.status}`);
  }

  console.log("\n=================================================");
  console.log(`📊 RESULTADO DE PRUEBAS: ${passed} pasadas, ${failed} fallidas`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Error fatal ejecutando pruebas:", err);
  process.exit(1);
});
