import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    console.log("📝 Nueva solicitud de reserva recibida")

    const body = await request.json()
    console.log("📋 Datos recibidos:", body)

    const {
      habitacion_id,
      cliente_nombre,
      cliente_email,
      cliente_telefono,
      cliente_documento,
      tipo_documento,
      nacionalidad,
      fecha_checkin,
      fecha_checkout,
      total,
    } = body

    // Validaciones básicas
    if (!habitacion_id || !cliente_nombre || !cliente_email || !fecha_checkin || !fecha_checkout || !total) {
      console.log("❌ Faltan campos requeridos")
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Validar fechas
    const checkinDate = new Date(fecha_checkin)
    const checkoutDate = new Date(fecha_checkout)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkinDate < today) {
      console.log("❌ Fecha de check-in no puede ser en el pasado")
      return NextResponse.json({ error: "La fecha de check-in no puede ser en el pasado" }, { status: 400 })
    }

    if (checkoutDate <= checkinDate) {
      console.log("❌ Fecha de check-out debe ser posterior al check-in")
      return NextResponse.json({ error: "La fecha de check-out debe ser posterior al check-in" }, { status: 400 })
    }

    console.log("🔍 Verificando conflictos de fechas para habitación:", habitacion_id)
    console.log("📅 Rango solicitado:", { fecha_checkin, fecha_checkout })

    // Verificar si la habitación ya está reservada en esas fechas
    const { data: reservasConflicto, error: errorConflicto } = await supabase
      .from("reservas")
      .select(`
        id,
        cliente_nombre,
        fecha_checkin,
        fecha_checkout,
        estado,
        habitaciones (
          numero,
          tipo
        )
      `)
      .eq("habitacion_id", habitacion_id)
      .in("estado", ["confirmada", "checkin"])
      .or(`
        and(fecha_checkin.lte.${fecha_checkin},fecha_checkout.gt.${fecha_checkin}),
        and(fecha_checkin.lt.${fecha_checkout},fecha_checkout.gte.${fecha_checkout}),
        and(fecha_checkin.gte.${fecha_checkin},fecha_checkout.lte.${fecha_checkout})
      `)

    if (errorConflicto) {
      console.log("❌ Error al verificar conflictos:", errorConflicto)
      return NextResponse.json({ error: "Error al verificar disponibilidad" }, { status: 500 })
    }

    console.log("🔍 Reservas en conflicto encontradas:", reservasConflicto?.length || 0)

    if (reservasConflicto && reservasConflicto.length > 0) {
      console.log("⚠️ Habitación ocupada, buscando alternativas...")

      // Obtener información de la habitación solicitada
      const { data: habitacionSolicitada } = await supabase
        .from("habitaciones")
        .select("*")
        .eq("id", habitacion_id)
        .single()

      if (!habitacionSolicitada) {
        return NextResponse.json({ error: "Habitación no encontrada" }, { status: 404 })
      }

      // Buscar habitaciones alternativas del mismo tipo
      const { data: habitacionesDelMismoTipo } = await supabase
        .from("habitaciones")
        .select("*")
        .eq("tipo", habitacionSolicitada.tipo)
        .eq("disponible", true)
        .neq("id", habitacion_id)

      const alternativasDisponibles = []

      if (habitacionesDelMismoTipo) {
        for (const habitacion of habitacionesDelMismoTipo) {
          // Verificar si esta habitación alternativa está disponible
          const { data: conflictosAlternativa } = await supabase
            .from("reservas")
            .select("id")
            .eq("habitacion_id", habitacion.id)
            .in("estado", ["confirmada", "checkin"])
            .or(`
              and(fecha_checkin.lte.${fecha_checkin},fecha_checkout.gt.${fecha_checkin}),
              and(fecha_checkin.lt.${fecha_checkout},fecha_checkout.gte.${fecha_checkout}),
              and(fecha_checkin.gte.${fecha_checkin},fecha_checkout.lte.${fecha_checkout})
            `)

          if (!conflictosAlternativa || conflictosAlternativa.length === 0) {
            alternativasDisponibles.push(habitacion)
          }
        }
      }

      console.log("🔄 Alternativas encontradas:", alternativasDisponibles.length)

      return NextResponse.json(
        {
          error: "HABITACION_OCUPADA",
          message: "La habitación seleccionada no está disponible en las fechas solicitadas",
          conflicto: {
            habitacion: habitacionSolicitada,
            reservas_conflicto: reservasConflicto,
            fechas_solicitadas: { fecha_checkin, fecha_checkout },
          },
          alternativas: alternativasDisponibles,
        },
        { status: 409 },
      )
    }

    console.log("✅ Habitación disponible, creando reserva...")

    // Crear la reserva
    const { data: nuevaReserva, error: errorReserva } = await supabase
      .from("reservas")
      .insert({
        habitacion_id,
        cliente_nombre,
        cliente_email,
        cliente_telefono,
        cliente_documento,
        tipo_documento,
        nacionalidad,
        fecha_checkin,
        fecha_checkout,
        total,
        estado: "confirmada",
      })
      .select(`
        *,
        habitaciones (
          numero,
          tipo,
          precio,
          capacidad,
          amenidades
        )
      `)
      .single()

    if (errorReserva) {
      console.log("❌ Error al crear reserva:", errorReserva)
      return NextResponse.json({ error: "Error al crear la reserva" }, { status: 500 })
    }

    console.log("✅ Reserva creada exitosamente:", nuevaReserva.id)

    return NextResponse.json({
      success: true,
      message: "Reserva creada exitosamente",
      reserva: nuevaReserva,
    })
  } catch (error) {
    console.error("❌ Error general en POST /api/reservas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const estado = searchParams.get("estado") || ""
    const fecha = searchParams.get("fecha") || ""

    console.log("📋 GET /api/reservas - Parámetros:", { page, limit, search, estado, fecha })

    let query = supabase.from("reservas").select(
      `
        *,
        habitaciones (
          numero,
          tipo,
          precio,
          capacidad,
          amenidades
        )
      `,
      { count: "exact" },
    )

    // Aplicar filtros
    if (search) {
      query = query.or(
        `cliente_nombre.ilike.%${search}%,cliente_email.ilike.%${search}%,cliente_documento.ilike.%${search}%`,
      )
    }

    if (estado && estado !== "todas") {
      query = query.eq("estado", estado)
    }

    if (fecha) {
      query = query.gte("fecha_checkin", fecha)
    }

    // Ordenar por fecha de creación (más recientes primero)
    query = query.order("created_at", { ascending: false })

    // Paginación
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: reservas, error, count } = await query

    if (error) {
      console.log("❌ Error al obtener reservas:", error)
      return NextResponse.json({ error: "Error al obtener las reservas" }, { status: 500 })
    }

    const totalPages = Math.ceil((count || 0) / limit)

    console.log("✅ Reservas obtenidas:", reservas?.length || 0, "de", count || 0)

    return NextResponse.json({
      reservas: reservas || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
      },
    })
  } catch (error) {
    console.error("❌ Error general en GET /api/reservas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
