import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si no es un path de administración o es la página de login, continuar
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "patagonia2026";
  const session = request.cookies.get("admin_session")?.value;

  // Si la cookie no existe o no coincide con la contraseña configurada, redirigir a login
  if (session !== adminPassword) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configurar el matcher para aplicar a todas las rutas bajo /admin
export const config = {
  matcher: "/admin/:path*",
};
