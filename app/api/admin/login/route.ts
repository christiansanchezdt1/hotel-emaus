import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin, createAdminSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log("Login attempt:", { username, password: "***" }) // Para debug

    if (!username || !password) {
      return NextResponse.json({ error: "Usuario y contraseña requeridos" }, { status: 400 })
    }

    const user = await verifyAdmin(username, password)

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    await createAdminSession(user)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
