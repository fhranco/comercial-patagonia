"use server";

import { cookies } from "next/headers";

export interface LoginResult {
  success: boolean;
  error?: string;
}

export async function handleLogin(prevState: any, formData: FormData): Promise<LoginResult> {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD || "patagonia2026";

  if (!password) {
    return { success: false, error: "La contraseña no puede estar vacía" };
  }

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "admin_session",
      value: adminPassword,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días de duración
    });
    return { success: true };
  }

  return { success: false, error: "Contraseña incorrecta. Por favor, intente de nuevo." };
}
