import { NextResponse } from "next/server"
import { clearAdminSession } from "@/lib/auth"

export async function POST() {
  try {
    await clearAdminSession()

    // Crear respuesta de éxito
    const response = NextResponse.json({ success: true })

    // También limpiar la cookie desde la respuesta por si acaso
    response.cookies.set("admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error en logout:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
