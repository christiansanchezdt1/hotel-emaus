import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import jwt from "jsonwebtoken"

// Middleware para verificar autenticación
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

export async function GET(request: NextRequest) {
  try {
    const { data: rooms, error } = await supabase.from("rooms").select("*").order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Error al obtener habitaciones" }, { status: 500 })
    }

    return NextResponse.json(rooms)
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const roomData = await request.json()

    const { data: room, error } = await supabase
      .from("rooms")
      .insert([
        {
          name: roomData.name,
          description: roomData.description,
          price: roomData.price,
          capacity: roomData.capacity,
          size: roomData.size,
          amenities: roomData.amenities,
          image_url: roomData.image_url || "/placeholder.svg?height=300&width=400",
          is_available: roomData.is_available,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Error al crear habitación" }, { status: 500 })
    }

    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
