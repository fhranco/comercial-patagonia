import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Santiago' }); // YYYY-MM-DD en Chile
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
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ views: 1420, today: 32, isMock: true });
    }
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
  }
}

// GET /api/views?pathname=/&days=30
// Devuelve estadísticas históricas para el panel de reportes
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session')?.value;
    const adminPassword = process.env.ADMIN_PASSWORD || 'patagonia2026';

    if (adminSession !== adminPassword) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pathname = searchParams.get('pathname') || '/';
    const days = Math.min(parseInt(searchParams.get('days') || '30'), 90);

    const total = (await redis.get<number>(`views:${pathname}`)) || 0;

    // Historial día a día
    const history: { date: string; visits: number }[] = [];
    const todayChile = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' }));

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(todayChile);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const count = (await redis.get<number>(`views:${pathname}:${dateStr}`)) || 0;
      history.push({ date: dateStr, visits: count });
    }

    const todayStr = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Santiago' });
    const todayViews = history.find(h => h.date === todayStr)?.visits || 0;

    return NextResponse.json({ pathname, total, today: todayViews, history });
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    
    // Fallback de datos simulados (Mock Data) para desarrollo local si la conexión falla o está bloqueada
    if (process.env.NODE_ENV === 'development' || !process.env.KV_REST_API_URL) {
      console.warn("Retornando MOCK DATA para el panel de estadísticas local por fallo de conexión.");
      const mockHistory: { date: string; visits: number }[] = [];
      const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' }));
      const days = 30; // Valor por defecto para generar historial mock
      
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        // Simular visitas diarias realistas
        const visits = Math.floor(Math.sin(i / 3) * 15 + 25 + Math.random() * 10);
        mockHistory.push({ date: dateStr, visits: i === 0 ? 32 : visits });
      }

      const totalViews = mockHistory.reduce((acc, curr) => acc + curr.visits, 1420);
      const todayViews = mockHistory[mockHistory.length - 1].visits;

      return NextResponse.json({
        pathname,
        total: totalViews,
        today: todayViews,
        history: mockHistory,
        isMock: true
      });
    }
    
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
  }
}
