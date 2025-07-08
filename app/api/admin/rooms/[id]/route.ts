import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import jwt from "jsonwebtoken"

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
  } catch {
    return null
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const updates = await request.json()
    const { id } = params

    const { data: room, error } = await supabase
      .from("rooms")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Error al actualizar habitación" }, { status: 500 })
    }

    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { id } = params

    const { error } = await supabase.from("rooms").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: "Error al eliminar habitación" }, { status: 500 })
    }

    return NextResponse.json({ message: "Habitación eliminada correctamente" })
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
