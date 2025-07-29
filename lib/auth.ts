import { supabase } from "./supabase"
import { cookies } from "next/headers"

export interface AdminUser {
  id: number
  username: string
  email: string
}

export async function verifyAdmin(username: string, password: string): Promise<AdminUser | null> {
  try {
    console.log("Verificando admin:", username)

    const { data: user, error } = await supabase.from("admin_users").select("*").eq("username", username).single()

    if (error || !user) {
      console.log("Usuario no encontrado o error en consulta")
      return null
    }

    // Comparación simple de contraseña
    if (user.password === password) {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    }

    return null
  } catch (error) {
    console.error("Error verifying admin:", error)
    return null
  }
}

export async function createAdminSession(user: AdminUser) {
  const cookieStore = cookies()

  // Crear cookie de sesión
  cookieStore.set("admin_session", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 horas
  })
}

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("admin_session")

    if (!sessionCookie) {
      return null
    }

    const user = JSON.parse(sessionCookie.value)
    return user
  } catch (error) {
    console.error("Error getting admin session:", error)
    return null
  }
}

export async function clearAdminSession() {
  const cookieStore = cookies()
  cookieStore.delete("admin_session")
}
