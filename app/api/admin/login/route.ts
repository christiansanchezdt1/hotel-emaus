import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Buscar admin en la base de datos
    const { data: admin, error } = await supabase.from("admins").select("*").eq("email", email).single()

    if (error || !admin) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Verificar contraseña (por ahora usamos comparación simple, en producción usar bcrypt)
    const isValidPassword = password === "admin123" // Temporal para desarrollo

    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Crear token JWT
    const token = jwt.sign({ adminId: admin.id, email: admin.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "24h",
    })

    return NextResponse.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
