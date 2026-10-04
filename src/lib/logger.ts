export function writeLog(message: string, error?: unknown) {
  if (typeof window !== 'undefined') return; // Server-side only

  // Safe console logging: only active when explicitly enabled via environment variable
  const isDebugEnabled = process.env.PATAGONIA_DEBUG === 'true' || process.env.DEBUG === 'true';
  if (!isDebugEnabled) return;

  const timestamp = new Date().toISOString();
  if (error) {
    if (error instanceof Error) {
      console.error(`[${timestamp}] [DEBUG] ${message}:`, error.message, error.stack);
    } else {
      console.error(`[${timestamp}] [DEBUG] ${message}:`, error);
    }
  } else {
    console.log(`[${timestamp}] [DEBUG] ${message}`);
  }
}
