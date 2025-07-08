import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get("fecha") || new Date().toISOString().split("T")[0]

    // Obtener todas las habitaciones activas
    const { data: habitaciones, error: habitacionesError } = await supabase
      .from("habitaciones")
      .select("*")
      .eq("estado", "disponible")

    if (habitacionesError) {
      console.error("Error al obtener habitaciones:", habitacionesError)
      return NextResponse.json({ error: "Error al obtener habitaciones" }, { status: 500 })
    }

    // Obtener reservas activas que se solapen con la fecha consultada
    const { data: reservasActivas, error: reservasError } = await supabase
      .from("reservas")
      .select("habitacion_id, fecha_checkin, fecha_checkout")
      .in("estado", ["confirmada", "checkin"])
      .lte("fecha_checkin", fecha)
      .gte("fecha_checkout", fecha)

    if (reservasError) {
      console.error("Error al obtener reservas:", reservasError)
      return NextResponse.json({ error: "Error al obtener reservas" }, { status: 500 })
    }

    // Filtrar habitaciones que no estén ocupadas
    const habitacionesOcupadas = new Set(reservasActivas?.map((r) => r.habitacion_id) || [])
    const habitacionesDisponibles = habitaciones?.filter((h) => !habitacionesOcupadas.has(h.id)) || []

    return NextResponse.json({
      habitaciones: habitacionesDisponibles,
      fecha: fecha,
      total: habitacionesDisponibles.length,
    })
  } catch (error) {
    console.error("Error en API habitaciones-disponibles:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
