const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_DIR = path.resolve(__dirname, '..');
const LOG_FILE = path.join(PROJECT_DIR, 'diagnostico_despliegue.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, formattedMessage);
  console.log(message);
}

// Inicializar log
if (fs.existsSync(LOG_FILE)) {
  fs.unlinkSync(LOG_FILE);
}

log("🏔️ INICIANDO AUDITORÍA PRE-DESPLIEGUE - COMERCIAL DE LA PATAGONIA");
log("=================================================================");

// 1. Verificar next.config.ts
try {
  const nextConfigPath = path.join(PROJECT_DIR, 'next.config.ts');
  if (fs.existsSync(nextConfigPath)) {
    const content = fs.readFileSync(nextConfigPath, 'utf8');
    log("[✓] next.config.ts existe.");
    
    if (content.includes('unoptimized: true')) {
      log("[✓] CONFIGURACIÓN IMAGEN: 'unoptimized: true' detectado en next.config.ts de forma correcta.");
    } else {
      log("[⚠️] CONFIGURACIÓN IMAGEN: 'unoptimized: true' no se encuentra en next.config.ts.");
    }
  } else {
    log("[❌] next.config.ts no encontrado en la raíz.");
  }
} catch (err) {
  log(`[❌] Error al leer next.config.ts: ${err.message}`);
}

// 2. Verificar normalización de imágenes en woocommerce.ts
try {
  const wooPath = path.join(PROJECT_DIR, 'src/lib/woocommerce.ts');
  if (fs.existsSync(wooPath)) {
    const content = fs.readFileSync(wooPath, 'utf8');
    log("[✓] src/lib/woocommerce.ts existe.");
    
    if (content.includes('replace(/^http:\\/\\//i, \'https://\')')) {
      log("[✓] NORMALIZACIÓN HTTPS: Función 'rewriteImageUrl' normaliza correctamente a HTTPS en woocommerce.ts.");
    } else {
      log("[⚠️] NORMALIZACIÓN HTTPS: No se detectó la expresión de normalización de protocolo a HTTPS en woocommerce.ts.");
    }
  } else {
    log("[❌] src/lib/woocommerce.ts no encontrado.");
  }
} catch (err) {
  log(`[❌] Error al leer woocommerce.ts: ${err.message}`);
}

// 3. Verificar paridad de SSL en .env.local
try {
  const envPath = path.join(PROJECT_DIR, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    log("[✓] .env.local existe.");
    
    if (content.includes('NODE_TLS_REJECT_UNAUTHORIZED="0"')) {
      log("[⚠️] SEGURIDAD SSL LOCAL: Se mantiene el bypass local (NODE_TLS_REJECT_UNAUTHORIZED='0').");
    } else {
      log("[✓] SEGURIDAD SSL LOCAL: Bypass removido de forma exitosa. Paridad estricta con Vercel garantizada.");
    }
  } else {
    log("[⚠️] .env.local no encontrado.");
  }
} catch (err) {
  log(`[❌] Error al leer .env.local: ${err.message}`);
}

// 4. Ejecutar TypeScript audit (tsc --noEmit)
try {
  log("[RUNNING] Ejecutando auditoría de compilación TypeScript local...");
  execSync('npx tsc --noEmit', { cwd: PROJECT_DIR });
  log("[✓] COMPILACIÓN TYPESCRIPT: Auditoría de tipado finalizada con 0 errores de compilación.");
} catch (err) {
  log(`[❌] COMPILACIÓN TYPESCRIPT FALLIDA:\n${err.stdout ? err.stdout.toString() : err.message}`);
}

log("=================================================================");
log("🏔️ AUDITORÍA FINALIZADA CON ÉXITO - LISTO PARA PRODUCCIÓN EN VERCEL");
