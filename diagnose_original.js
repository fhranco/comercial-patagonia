const https = require('https');

console.log("🚀 Probando conexión directa a tienda.comercialpatagonia.cl...");

const options = {
  hostname: 'tienda.comercialpatagonia.cl',
  port: 443,
  path: '/wp-json/wc/v3/products?per_page=1',
  method: 'GET',
  headers: {
    'User-Agent': 'Node-Test'
  }
};

const req = https.request(options, (res) => {
  console.log(`📡 Respuesta recibida.`);
  console.log(`   - Código de Estado HTTP: ${res.statusCode} ${res.statusMessage}`);
});

req.on('error', (e) => {
  console.error("❌ Error de conexión:");
  console.error(`   - Código: ${e.code}`);
  console.error(`   - Mensaje: ${e.message}`);
});

req.end();
