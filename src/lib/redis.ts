import { Redis } from '@upstash/redis';

// Variables de entorno tal como las genera Vercel al conectar Upstash/KV
const redisUrl = 
  process.env.KV_REST_API_URL ||
  process.env.STORAGE_URL || 
  process.env.UPSTASH_REDIS_REST_URL;

const redisToken = 
  process.env.KV_REST_API_TOKEN ||
  process.env.STORAGE_TOKEN || 
  process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  console.warn("Advertencia: Faltan credenciales de Upstash Redis en las variables de entorno.");
}

export const redis = new Redis({
  url: redisUrl || '',
  token: redisToken || '',
});
