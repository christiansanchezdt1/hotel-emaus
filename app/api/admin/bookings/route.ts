import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        *,
        rooms (
          name,
          price
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Error al obtener reservas" }, { status: 500 })
    }

    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
