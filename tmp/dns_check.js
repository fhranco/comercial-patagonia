const dns = require('dns');

console.log("🔍 DIAGNÓSTICO DE RESOLUCIÓN DNS...");

const domains = [
  'google.com',
  'tienda.comercialpatagonia.cl',
  'tiendacp.boostpatagonia.online'
];

domains.forEach(domain => {
  dns.lookup(domain, (err, address, family) => {
    if (err) {
      console.error(`❌ ${domain}: ERROR - ${err.message}`);
    } else {
      console.log(`✅ ${domain}: RESOLVED - IP ${address} (Family: v${family})`);
    }
  });
});
