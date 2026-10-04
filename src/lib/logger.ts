const DEBUG_WOOCOMMERCE = process.env.WOOCOMMERCE_DEBUG === "1";

export function writeLog(message: string, error?: unknown) {
  if (!DEBUG_WOOCOMMERCE) return;

  if (error) {
    console.error(`[WooCommerce] ${message}`, error);
    return;
  }

  console.info(`[WooCommerce] ${message}`);
}
