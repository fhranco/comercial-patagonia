import fs from 'fs';
import path from 'path';

export function writeLog(message: string, error?: any) {
  if (typeof window !== 'undefined') return; // Server-side only
  
  try {
    const logDir = process.cwd();
    const logPath = path.join(logDir, 'patagonia_debug.log');
    const timestamp = new Date().toISOString();
    
    let logContent = `[${timestamp}] ${message}\n`;
    if (error) {
      if (error instanceof Error) {
        logContent += `  Error Name: ${error.name}\n  Error Message: ${error.message}\n  Stack: ${error.stack}\n`;
      } else if (typeof error === 'object') {
        logContent += `  Error Detail: ${JSON.stringify(error, null, 2)}\n`;
      } else {
        logContent += `  Error Detail: ${error}\n`;
      }
    }
    logContent += `--------------------------------------------------\n`;
    
    fs.appendFileSync(logPath, logContent, 'utf8');
  } catch (e) {
    console.error("Failed to write to log file:", e);
  }
}
