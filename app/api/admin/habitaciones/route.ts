import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAdminSession } from "@/lib/auth"

// GET - Obtener todas las habitaciones con paginación y filtros
export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const estado = searchParams.get("estado") || "todas"
    const tipo = searchParams.get("tipo") || "todos"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""

    console.log("Fetching habitaciones with filters:", { estado, tipo, page, limit, search })

    // Construir query base
    let query = supabase.from("habitaciones").select("*", { count: "exact" })

    // Aplicar filtros
    if (estado !== "todas") {
      if (estado === "ocupadas") {
        // Para habitaciones ocupadas, necesitamos hacer un join con reservas
        const { data: habitacionesOcupadas } = await supabase
          .from("reservas")
          .select("habitacion_id")
          .in("estado", ["confirmada", "checkin"])
          .lte("fecha_checkin", new Date().toISOString().split("T")[0])
          .gte("fecha_checkout", new Date().toISOString().split("T")[0])

        const idsOcupadas = habitacionesOcupadas?.map((r) => r.habitacion_id) || []

        if (idsOcupadas.length > 0) {
          query = query.in("id", idsOcupadas)
        } else {
          // Si no hay habitaciones ocupadas, devolver array vacío
          return NextResponse.json({
            habitaciones: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          })
        }
      } else {
        query = query.eq("estado", estado)
      }
    }

    if (tipo !== "todos") {
      query = query.eq("tipo", tipo)
    }

    if (search) {
      query = query.or(`numero.ilike.%${search}%,tipo.ilike.%${search}%,descripcion.ilike.%${search}%`)
    }

    const { data: habitaciones, error, count } = await query

    if (error) {
      console.error("Error fetching habitaciones:", error)
      return NextResponse.json({ error: "Error al obtener habitaciones" }, { status: 500 })
    }

    console.log("Habitaciones fetched:", habitaciones?.length || 0)

    // Ordenamiento numérico en JavaScript
    const habitacionesOrdenadas = (habitaciones || []).sort((a, b) => {
      const numA = Number.parseInt(a.numero) || 0
      const numB = Number.parseInt(b.numero) || 0
      return numA - numB
    })

    // Aplicar paginación después del ordenamiento
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const habitacionesPaginadas = habitacionesOrdenadas.slice(startIndex, endIndex)

    // Fecha de hoy para filtrar reservas
    const hoy = new Date().toISOString().split("T")[0]

    // Para cada habitación, obtener solo reservas desde hoy hacia el futuro
    const habitacionesConReservas = await Promise.all(
      habitacionesPaginadas.map(async (habitacion) => {
        // Obtener reservas activas (confirmada, checkin) desde hoy
        const { data: reservasActivas } = await supabase
          .from("reservas")
          .select("id, estado, cliente_nombre, cliente_email, fecha_checkin, fecha_checkout, total")
          .eq("habitacion_id", habitacion.id)
          .in("estado", ["confirmada", "checkin"])
          .gte("fecha_checkout", hoy) // Solo reservas que terminan hoy o después
          .order("fecha_checkin", { ascending: true })

        // Obtener reservas futuras (pendiente) desde hoy
        const { data: reservasFuturasData } = await supabase
          .from("reservas")
          .select("id, estado, cliente_nombre, cliente_email, fecha_checkin, fecha_checkout, total")
          .eq("habitacion_id", habitacion.id)
          .eq("estado", "pendiente")
          .gte("fecha_checkin", hoy) // Solo reservas que empiezan hoy o después
          .order("fecha_checkin", { ascending: true })

        // Combinar solo reservas futuras (desde hoy)
        const todasLasReservas = [...(reservasActivas || []), ...(reservasFuturasData || [])].sort(
          (a, b) => new Date(a.fecha_checkin).getTime() - new Date(b.fecha_checkin).getTime(),
        )

        return {
          ...habitacion,
          reservasActivas: reservasActivas || [],
          reservasFuturas: reservasFuturasData || [],
          todasLasReservas,
          puedeEliminar: (!reservasActivas || reservasActivas.length === 0) && habitacion.estado === "disponible",
          estadoReal: reservasActivas && reservasActivas.length > 0 ? "ocupada" : habitacion.estado,
        }
      }),
    )

    const totalPages = Math.ceil((habitacionesOrdenadas.length || 0) / limit)

    return NextResponse.json({
      habitaciones: habitacionesConReservas,
      pagination: {
        page,
        limit,
        total: habitacionesOrdenadas.length || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error in GET habitaciones:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nueva habitación
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { numero, tipo, precio, capacidad, descripcion, amenidades, estado } = body

    // Validaciones básicas
    if (!numero || !tipo || !precio || !capacidad) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    // Verificar que el número de habitación no exista
    const { data: existingRoom, error: checkError } = await supabase
      .from("habitaciones")
      .select("id")
      .eq("numero", numero)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing room:", checkError)
      return NextResponse.json({ error: "Error al verificar habitación existente" }, { status: 500 })
    }

    if (existingRoom) {
      return NextResponse.json({ error: "Ya existe una habitación con ese número" }, { status: 400 })
    }

    // Crear la habitación
    const { data: nuevaHabitacion, error: insertError } = await supabase
      .from("habitaciones")
      .insert({
        numero,
        tipo,
        precio: Number.parseFloat(precio),
        capacidad: Number.parseInt(capacidad),
        descripcion,
        amenidades: amenidades || [],
        estado: estado || "disponible",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating habitacion:", insertError)
      return NextResponse.json({ error: "Error al crear la habitación" }, { status: 500 })
    }

    return NextResponse.json({ habitacion: nuevaHabitacion }, { status: 201 })
  } catch (error) {
    console.error("Error in POST habitaciones:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
