import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAdminSession } from "@/lib/auth"

// GET - Obtener todas las reservas con paginación y filtros
export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const estado = searchParams.get("estado") || "todas"
    const tipo = searchParams.get("tipo") || "todos"
    const fecha = searchParams.get("fecha") || ""
    const search = searchParams.get("search") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Calcular offset para paginación
    const offset = (page - 1) * limit

    // Construir query base con join a habitaciones
    let query = supabase
      .from("reservas")
      .select(
        `
        *,
        habitaciones (
          numero,
          tipo,
          precio
        )
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })

    // Aplicar filtros
    if (estado !== "todas") {
      query = query.eq("estado", estado)
    }

    // Filtro por tipo de habitación
    if (tipo !== "todos") {
      // Primero obtenemos los IDs de habitaciones del tipo seleccionado
      const { data: habitacionesTipo } = await supabase.from("habitaciones").select("id").eq("tipo", tipo)

      const idsHabitaciones = habitacionesTipo?.map((h) => h.id) || []

      if (idsHabitaciones.length > 0) {
        query = query.in("habitacion_id", idsHabitaciones)
      } else {
        // Si no hay habitaciones de ese tipo, devolver array vacío
        return NextResponse.json({
          reservas: [],
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
    }

    // Filtro por fecha (reservas que incluyan esta fecha)
    if (fecha) {
      query = query.lte("fecha_checkin", fecha).gte("fecha_checkout", fecha)
    }

    // Filtro de búsqueda por nombre, email o número de habitación
    if (search) {
      query = query.or(
        `cliente_nombre.ilike.%${search}%,cliente_email.ilike.%${search}%,habitaciones.numero.ilike.%${search}%`,
      )
    }

    // Aplicar paginación
    query = query.range(offset, offset + limit - 1)

    const { data: reservas, error, count } = await query

    if (error) {
      console.error("Error fetching reservas:", error)
      return NextResponse.json({ error: "Error al obtener reservas" }, { status: 500 })
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      reservas: reservas || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error in GET reservas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nueva reserva
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const {
      habitacion_id,
      cliente_nombre,
      cliente_email,
      cliente_telefono,
      fecha_checkin,
      fecha_checkout,
      estado,
      total,
    } = body

    // Validaciones básicas
    if (!habitacion_id || !cliente_nombre || !cliente_email || !fecha_checkin || !fecha_checkout || !total) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    // Validar fechas
    const checkin = new Date(fecha_checkin)
    const checkout = new Date(fecha_checkout)
    if (checkout <= checkin) {
      return NextResponse.json({ error: "La fecha de checkout debe ser posterior al checkin" }, { status: 400 })
    }

    // Verificar disponibilidad de la habitación
    const { data: conflictos, error: conflictError } = await supabase
      .from("reservas")
      .select("id")
      .eq("habitacion_id", habitacion_id)
      .in("estado", ["confirmada", "checkin"])
      .or(`fecha_checkin.lte.${fecha_checkout},fecha_checkout.gte.${fecha_checkin}`)

    if (conflictError) {
      console.error("Error checking conflicts:", conflictError)
      return NextResponse.json({ error: "Error al verificar disponibilidad" }, { status: 500 })
    }

    if (conflictos && conflictos.length > 0) {
      return NextResponse.json({ error: "La habitación no está disponible en esas fechas" }, { status: 400 })
    }

    // Crear la reserva
    const { data: nuevaReserva, error: insertError } = await supabase
      .from("reservas")
      .insert({
        habitacion_id,
        cliente_nombre,
        cliente_email,
        cliente_telefono,
        fecha_checkin,
        fecha_checkout,
        estado: estado || "confirmada",
        total,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating reserva:", insertError)
      return NextResponse.json({ error: "Error al crear la reserva" }, { status: 500 })
    }

    return NextResponse.json({ reserva: nuevaReserva }, { status: 201 })
  } catch (error) {
    console.error("Error in POST reservas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
