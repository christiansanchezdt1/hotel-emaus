import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Iniciando consulta de habitaciones disponibles...")

    const searchParams = request.nextUrl.searchParams
    const fechaInicio = searchParams.get("fechaInicio")
    const fechaFin = searchParams.get("fechaFin")
    const tipo = searchParams.get("tipo")
    const capacidad = searchParams.get("capacidad")

    console.log("📅 Parámetros recibidos:", { fechaInicio, fechaFin, tipo, capacidad })

    // Crear timeout para la consulta
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timeout: La consulta tardó demasiado")), 10000)
    })

    // Construir consulta base - CORREGIDO: usar "amenidades" en lugar de "servicios"
    let query = supabase
      .from("habitaciones")
      .select("id, numero, tipo, capacidad, precio, descripcion, amenidades, estado")
      .eq("estado", "disponible")

    // Aplicar filtros opcionales
    if (tipo && tipo !== "todos") {
      query = query.eq("tipo", tipo)
    }

    if (capacidad && capacidad !== "todas") {
      const capacidadNum = Number.parseInt(capacidad)
      if (!isNaN(capacidadNum)) {
        query = query.gte("capacidad", capacidadNum)
      }
    }

    // Ejecutar consulta con timeout
    const queryPromise = query.order("numero", { ascending: true })

    console.log("⏳ Ejecutando consulta a Supabase...")
    const { data: habitaciones, error } = (await Promise.race([queryPromise, timeoutPromise])) as any

    if (error) {
      console.error("❌ Error en consulta Supabase:", error)
      return NextResponse.json(
        {
          error: "Error al consultar habitaciones",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      )
    }

    console.log(`✅ Consulta exitosa. Encontradas ${habitaciones?.length || 0} habitaciones`)

    // Si hay fechas, filtrar por disponibilidad
    let habitacionesDisponibles = habitaciones || []

    if (fechaInicio && fechaFin) {
      console.log("🔍 Filtrando por disponibilidad de fechas...")

      const { data: reservas, error: reservasError } = await supabase
        .from("reservas")
        .select("habitacion_id")
        .or(`and(fecha_checkin.lte.${fechaFin},fecha_checkout.gte.${fechaInicio})`)
        .in("estado", ["confirmada", "pendiente"])

      if (reservasError) {
        console.error("❌ Error al consultar reservas:", reservasError)
      } else {
        const habitacionesOcupadas = reservas?.map((r) => r.habitacion_id) || []
        habitacionesDisponibles = habitaciones.filter((h) => !habitacionesOcupadas.includes(h.id))
        console.log(`📊 Después del filtro de fechas: ${habitacionesDisponibles.length} habitaciones disponibles`)
      }
    }

    // Procesar datos para el frontend
    const habitacionesProcesadas = habitacionesDisponibles.map((habitacion) => {
      // Procesar amenidades - puede venir como array JSON o string
      let amenidadesProcesadas = []
      if (habitacion.amenidades) {
        if (Array.isArray(habitacion.amenidades)) {
          amenidadesProcesadas = habitacion.amenidades
        } else if (typeof habitacion.amenidades === "string") {
          try {
            amenidadesProcesadas = JSON.parse(habitacion.amenidades)
          } catch {
            // Si no se puede parsear, dividir por comas
            amenidadesProcesadas = habitacion.amenidades.split(",").map((a: string) => a.trim())
          }
        }
      }

      // Mapear imagen por tipo
      const tipoImagenes: Record<string, string> = {
        simple: "/images/habitaciones/habitacion-simple-1.jpg",
        doble: "/images/habitaciones/habitacion-doble-1.jpg",
        triple: "/images/habitaciones/habitacion-doble-2.jpg",
        suite: "/images/habitaciones/habitacion-doble-3.jpg",
      }

      return {
        ...habitacion,
        amenidades: amenidadesProcesadas,
        precio: habitacion.precio || 0,
        imagen_url: tipoImagenes[habitacion.tipo.toLowerCase()] || "/images/habitaciones/habitacion-simple-1.jpg",
      }
    })

    console.log("✅ Respuesta preparada exitosamente")

    return NextResponse.json({
      habitaciones: habitacionesProcesadas,
      total: habitacionesProcesadas.length,
      filtros: { fechaInicio, fechaFin, tipo, capacidad },
    })
  } catch (error: any) {
    console.error("💥 Error general en API:", error)

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: error.message || "Error desconocido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
