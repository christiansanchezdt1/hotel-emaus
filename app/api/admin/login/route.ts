import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin, createAdminSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username y password son requeridos" }, { status: 400 })
    }

    console.log("Login attempt:", { username, password: "***" })

    const user = await verifyAdmin(username, password)

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    await createAdminSession(user)

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
