import { cookies } from "next/headers"
import { supabase } from "./supabase"

export interface AdminUser {
  id: number
  username: string
  email: string
}

export async function verifyAdmin(username: string, password: string): Promise<AdminUser | null> {
  try {
    console.log("Verificando admin:", username) // Para debug

    const { data: user, error } = await supabase.from("admin_users").select("*").eq("username", username).single()

    console.log("Usuario encontrado:", user) // Para debug
    console.log("Error:", error) // Para debug

    if (error || !user) {
      console.log("Usuario no encontrado o error en consulta")
      return null
    }

    // Comparación simple de contraseña (sin hash por ahora)
    if (user.password === password) {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    }

    console.log("Contraseña incorrecta")
    return null
  } catch (error) {
    console.error("Error verifying admin:", error)
    return null
  }
}

export async function createAdminSession(user: AdminUser) {
  const cookieStore = await cookies()
  const sessionData = JSON.stringify(user)

  cookieStore.set("admin_session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 horas
    path: "/",
  })
}

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin_session")

    if (!session?.value) {
      return null
    }

    return JSON.parse(session.value)
  } catch (error) {
    console.error("Error getting admin session:", error)
    return null
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
}
