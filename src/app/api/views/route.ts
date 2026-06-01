import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

// Simple SHA-256 hash helper using web crypto API (supported natively in Vercel Edge / Node.js)
async function hashIp(ip: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
  try {
    const { pathname } = await req.json();
    if (!pathname) {
      return NextResponse.json({ error: 'Ruta (pathname) no especificada' }, { status: 400 });
    }

    // 1. Obtener la IP del cliente
    const rawIp = 
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
      req.headers.get('x-real-ip') || 
      (req as any).ip || 
      '127.0.0.1';

    // 2. Anonimizar la IP (RGPD) — hash de IP + pathname + fecha
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const ipHash = await hashIp(`${rawIp}:${pathname}:${today}`);
    
    const visitorKey = `visitor:${pathname}:${ipHash}`;
    const viewsKey   = `views:${pathname}`;
    const dailyKey   = `views:${pathname}:${today}`; // Registro diario

    // 3. Verificar si el visitante ya contó hoy
    const hasVisitedToday = await redis.get<string>(visitorKey);
    let currentViews = (await redis.get<number>(viewsKey)) || 0;

    if (!hasVisitedToday) {
      await redis.set(visitorKey, '1', { ex: 86400 });         // expira en 24h
      currentViews = await redis.incr(viewsKey);               // total acumulado
      await redis.incr(dailyKey);                              // total del día
      await redis.expire(dailyKey, 60 * 60 * 24 * 90);        // guarda 90 días
    }

    const todayViews = (await redis.get<number>(dailyKey)) || 0;

    return NextResponse.json({ views: currentViews, today: todayViews });
  } catch (error: any) {
    console.error('Error al actualizar contador de visitas:', error);
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
  }
}

// GET /api/views?pathname=/&days=30
// Devuelve estadísticas históricas para el panel de reportes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pathname = searchParams.get('pathname') || '/';
    const days = Math.min(parseInt(searchParams.get('days') || '30'), 90);

    const total = (await redis.get<number>(`views:${pathname}`)) || 0;

    // Historial día a día
    const history: { date: string; visits: number }[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const count = (await redis.get<number>(`views:${pathname}:${dateStr}`)) || 0;
      history.push({ date: dateStr, visits: count });
    }

    const todayStr = today.toISOString().slice(0, 10);
    const todayViews = history.find(h => h.date === todayStr)?.visits || 0;

    return NextResponse.json({ pathname, total, today: todayViews, history });
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
  }
}
