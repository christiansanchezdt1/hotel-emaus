import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fechaParam = searchParams.get("fecha")

    console.log("🔍 API: Iniciando consulta de habitaciones disponibles", { fechaParam })

    // Validar y formatear fecha si se proporciona
    let fechaFormateada: string | null = null
    if (fechaParam) {
      try {
        // Asegurar formato YYYY-MM-DD
        const fechaObj = new Date(fechaParam)
        if (isNaN(fechaObj.getTime())) {
          throw new Error("Fecha inválida")
        }
        // Formatear como YYYY-MM-DD en UTC para evitar problemas de zona horaria
        fechaFormateada = fechaObj.toISOString().split("T")[0]
        console.log("📅 API: Fecha formateada:", fechaFormateada)
      } catch (error) {
        console.error("❌ API: Error al formatear fecha:", error)
        return NextResponse.json({
          habitaciones: [],
          total: 0,
          error: "Formato de fecha inválido. Use formato YYYY-MM-DD",
        })
      }
    }

    if (fechaFormateada) {
      // Consulta con filtro de fecha - verificar disponibilidad
      console.log("📅 API: Consultando disponibilidad para fecha específica:", fechaFormateada)

      // Primero obtener todas las habitaciones disponibles
      const { data: todasHabitaciones, error: errorHabitaciones } = await supabaseAdmin
        .from("habitaciones")
        .select("*")
        .eq("estado", "disponible")
        .order("numero")

      if (errorHabitaciones) {
        console.error("❌ API: Error al obtener habitaciones:", errorHabitaciones)
        return NextResponse.json({
          habitaciones: [],
          total: 0,
          error: "Error al consultar habitaciones en la base de datos",
        })
      }

      console.log("🏨 API: Habitaciones encontradas:", todasHabitaciones?.length || 0)

      if (!todasHabitaciones || todasHabitaciones.length === 0) {
        return NextResponse.json({
          habitaciones: [],
          total: 0,
          mensaje: "No hay habitaciones registradas en el sistema",
        })
      }

      // Verificar cuáles están reservadas para la fecha específica
      // Buscar reservas que se superpongan con la fecha consultada
      const { data: reservas, error: errorReservas } = await supabaseAdmin
        .from("reservas")
        .select("habitacion_id, fecha_checkin, fecha_checkout, estado")
        .lte("fecha_checkin", fechaFormateada)
        .gte("fecha_checkout", fechaFormateada)
        .in("estado", ["confirmada", "checkin"])

      if (errorReservas) {
        console.error("❌ API: Error al consultar reservas:", errorReservas)
        // Si hay error en reservas, mostrar todas las habitaciones con advertencia
        return NextResponse.json({
          habitaciones: todasHabitaciones,
          total: todasHabitaciones.length,
          warning: "No se pudo verificar disponibilidad completa debido a un error en las reservas",
        })
      }

      console.log("📋 API: Reservas encontradas para la fecha:", reservas?.length || 0)

      // IDs de habitaciones reservadas
      const habitacionesReservadas = new Set(reservas?.map((r) => r.habitacion_id) || [])

      // Filtrar habitaciones disponibles
      const habitacionesDisponibles = todasHabitaciones.filter(
        (habitacion) => !habitacionesReservadas.has(habitacion.id),
      )

      console.log("✅ API: Habitaciones disponibles para la fecha:", habitacionesDisponibles.length)

      // Formatear fecha para mostrar
      const fechaFormateadaDisplay = new Date(fechaFormateada + "T12:00:00").toLocaleDateString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      if (habitacionesDisponibles.length === 0) {
        return NextResponse.json({
          habitaciones: [],
          total: todasHabitaciones.length,
          mensaje: `Todas las habitaciones están reservadas para ${fechaFormateadaDisplay}`,
        })
      }

      return NextResponse.json({
        habitaciones: habitacionesDisponibles,
        total: todasHabitaciones.length,
        mensaje: `${habitacionesDisponibles.length} habitación${
          habitacionesDisponibles.length !== 1 ? "es" : ""
        } disponible${habitacionesDisponibles.length !== 1 ? "s" : ""} para ${fechaFormateadaDisplay}`,
      })
    } else {
      // Consulta sin filtro de fecha - mostrar todas las habitaciones disponibles
      console.log("🏨 API: Consultando todas las habitaciones disponibles")

      const { data: habitaciones, error } = await supabaseAdmin
        .from("habitaciones")
        .select("*")
        .eq("estado", "disponible")
        .order("numero")

      if (error) {
        console.error("❌ API: Error al obtener habitaciones:", error)
        return NextResponse.json({
          habitaciones: [],
          total: 0,
          error: "Error al consultar habitaciones en la base de datos",
        })
      }

      console.log("✅ API: Habitaciones disponibles encontradas:", habitaciones?.length || 0)

      if (!habitaciones || habitaciones.length === 0) {
        return NextResponse.json({
          habitaciones: [],
          total: 0,
          mensaje: "No hay habitaciones registradas en el sistema",
        })
      }

      return NextResponse.json({
        habitaciones,
        total: habitaciones.length,
        mensaje: `${habitaciones.length} habitación${habitaciones.length !== 1 ? "es" : ""} disponible${
          habitaciones.length !== 1 ? "s" : ""
        }`,
      })
    }
  } catch (error) {
    console.error("❌ API: Error general:", error)
    return NextResponse.json({
      habitaciones: [],
      total: 0,
      error: "Error interno del servidor",
    })
  }
}
