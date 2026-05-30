const https = require('https');
const fs = require('fs');
const path = require('path');

console.log("🏔️ INICIANDO DIAGNÓSTICO DE CONEXIÓN WOOCOMMERCE...");

// 1. Leer .env.local
let envUrl = '';
let envCk = '';
let envCs = '';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length === 2) {
      const key = parts[0].trim();
      const val = parts[1].trim().replace(/['"]/g, '');
      if (key === 'NEXT_PUBLIC_WOOCOMMERCE_URL') envUrl = val;
      if (key === 'WOOCOMMERCE_CK') envCk = val;
      if (key === 'WOOCOMMERCE_CS') envCs = val;
    }
  });
  console.log("✅ .env.local cargado correctamente.");
  console.log(`   - URL: ${envUrl}`);
  console.log(`   - CK: ${envCk ? envCk.substring(0, 8) + '...' : 'MISSING'}`);
  console.log(`   - CS: ${envCs ? envCs.substring(0, 8) + '...' : 'MISSING'}`);
} else {
  console.error("❌ Error: No se encontró el archivo .env.local");
  process.exit(1);
}

if (!envUrl || !envCk || !envCs) {
  console.error("❌ Error: Faltan variables clave en .env.local");
  process.exit(1);
}

// Parse url
const urlObj = new URL(envUrl);
const auth = Buffer.from(`${envCk}:${envCs}`).toString('base64');

const options = {
  hostname: urlObj.hostname,
  port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
  path: `${urlObj.pathname}/products?per_page=3&status=publish`,
  method: 'GET',
  headers: {
    'Authorization': `Basic ${auth}`,
    'User-Agent': 'Patagonia-Diagnostic/1.0',
    'Accept': 'application/json'
  }
};

console.log(`\n🚀 Conectando a ${options.hostname}${options.path}...`);

const req = https.request(options, (res) => {
  console.log(`📡 Respuesta recibida de WooCommerce.`);
  console.log(`   - Código de Estado HTTP: ${res.statusCode} ${res.statusMessage}`);
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const products = JSON.parse(data);
        console.log(`\n🟢 CONEXIÓN EXITOSA: Se recuperaron ${products.length} productos reales.`);
        products.forEach((p, idx) => {
          console.log(`\nProducto [${idx + 1}]: "${p.name}" (SKU: ${p.sku})`);
          if (p.images && p.images.length > 0) {
            console.log(`   - URL Original de Imagen: ${p.images[0].src}`);
            // Simular reescritura
            const rewritten = p.images[0].src
              .replace(/https?:\/\/productos\.comercialpatagonia\.cl/g, 'https://tienda.comercialpatagonia.cl')
              .replace(/https?:\/\/tiendacp\.boostpatagonia\.online/g, 'https://tienda.comercialpatagonia.cl')
              .replace(/https?:\/\/darkorange-bat-658298\.hostingersite\.com/g, 'https://tienda.comercialpatagonia.cl');
            console.log(`   - URL Reescrita (Producción): ${rewritten}`);
          } else {
            console.log(`   - ⚠️ Sin imágenes asociadas.`);
          }
        });
      } else {
        console.error(`\n❌ Error del Servidor WooCommerce (HTTP ${res.statusCode}):`);
        console.log(data.substring(0, 500));
      }
    } catch (e) {
      console.error("\n❌ Error al parsear respuesta JSON:", e.message);
      console.log("Respuesta cruda (primeros 300 caracteres):", data.substring(0, 300));
    }
  });
});

req.on('error', (e) => {
  console.error("\n❌ ERROR DE CONEXIÓN FÍSICA:");
  console.error(`   - Código: ${e.code}`);
  console.error(`   - Mensaje: ${e.message}`);
  
  if (e.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || e.code === 'CERT_HAS_EXPIRED' || e.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
    console.log("\n💡 Diagnóstico: Es un problema de certificado SSL en el servidor WooCommerce clonado.");
    console.log("   Sugerencia: Debemos configurar Node para omitir la validación SSL en desarrollo local.");
  } else if (e.code === 'ENOTFOUND') {
    console.log("\n💡 Diagnóstico: Problema de resolución DNS. Tu máquina local no puede resolver el host.");
  }
});

req.end();
