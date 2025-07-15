import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  console.log("🔍 API: Iniciando GET /api/habitaciones-disponibles")

  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get("fecha")

    console.log("📅 API: Fecha recibida:", fecha)

    // Validar y formatear fecha si existe
    let fechaFormateada: string | null = null
    if (fecha) {
      try {
        // Asegurar que la fecha esté en formato YYYY-MM-DD
        const fechaObj = new Date(fecha + "T00:00:00.000Z")
        if (isNaN(fechaObj.getTime())) {
          throw new Error("Fecha inválida")
        }
        fechaFormateada = fechaObj.toISOString().split("T")[0]
        console.log("📅 API: Fecha formateada:", fechaFormateada)
      } catch (error) {
        console.error("❌ API: Error formateando fecha:", error)
        return NextResponse.json({
          habitaciones: [],
          fecha: new Date().toISOString().split("T")[0],
          total: 0,
          error: "Formato de fecha inválido",
        })
      }
    }

    // Obtener todas las habitaciones disponibles
    console.log("📊 API: Consultando habitaciones...")
    const { data: habitaciones, error: habitacionesError } = await supabase
      .from("habitaciones")
      .select("*")
      .eq("estado", "disponible")
      .order("numero")

    if (habitacionesError) {
      console.error("❌ API: Error habitaciones:", habitacionesError)
      return NextResponse.json({
        habitaciones: [],
        fecha: fechaFormateada || new Date().toISOString().split("T")[0],
        total: 0,
        error: "Error al obtener habitaciones de la base de datos",
      })
    }

    console.log("✅ API: Habitaciones obtenidas:", habitaciones?.length || 0)

    if (!habitaciones || habitaciones.length === 0) {
      return NextResponse.json({
        habitaciones: [],
        fecha: fechaFormateada || new Date().toISOString().split("T")[0],
        total: 0,
      })
    }

    // Si no hay fecha, devolver todas las habitaciones
    if (!fechaFormateada) {
      console.log("📋 API: Sin filtro de fecha, devolviendo todas")
      return NextResponse.json({
        habitaciones,
        fecha: new Date().toISOString().split("T")[0],
        total: habitaciones.length,
      })
    }

    // Buscar reservas que ocupen habitaciones en la fecha solicitada
    console.log("🔍 API: Buscando reservas para fecha:", fechaFormateada)

    const { data: reservasOcupadas, error: reservasError } = await supabase
      .from("reservas")
      .select("habitacion_id, fecha_checkin, fecha_checkout, estado")
      .in("estado", ["confirmada", "checkin"])
      .lte("fecha_checkin", fechaFormateada)
      .gt("fecha_checkout", fechaFormateada)

    if (reservasError) {
      console.error("❌ API: Error consultando reservas:", reservasError)
      // En caso de error, devolver todas las habitaciones con advertencia
      return NextResponse.json({
        habitaciones,
        fecha: fechaFormateada,
        total: habitaciones.length,
        warning: "No se pudo verificar disponibilidad completa debido a un error en las reservas",
      })
    }

    console.log("📊 API: Reservas ocupadas encontradas:", reservasOcupadas?.length || 0)

    // Filtrar habitaciones ocupadas
    const habitacionesOcupadasIds = new Set(reservasOcupadas?.map((r) => r.habitacion_id) || [])
    const habitacionesDisponibles = habitaciones.filter((h) => !habitacionesOcupadasIds.has(h.id))

    console.log("✅ API: Habitaciones disponibles después del filtro:", habitacionesDisponibles.length)
    console.log("🚫 API: IDs de habitaciones ocupadas:", Array.from(habitacionesOcupadasIds))

    return NextResponse.json({
      habitaciones: habitacionesDisponibles,
      fecha: fechaFormateada,
      total: habitacionesDisponibles.length,
      debug: {
        fechaOriginal: fecha,
        fechaFormateada: fechaFormateada,
        totalHabitaciones: habitaciones.length,
        reservasEncontradas: reservasOcupadas?.length || 0,
        habitacionesOcupadas: Array.from(habitacionesOcupadasIds),
      },
    })
  } catch (error) {
    console.error("❌ API: Error crítico:", error)
    return NextResponse.json({
      habitaciones: [],
      fecha: new Date().toISOString().split("T")[0],
      total: 0,
      error: "Error interno del servidor: " + (error instanceof Error ? error.message : "Error desconocido"),
    })
  }
}
