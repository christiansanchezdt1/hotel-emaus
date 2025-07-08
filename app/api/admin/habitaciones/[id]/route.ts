import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAdminSession } from "@/lib/auth"

// GET - Obtener una habitación específica
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { data: habitacion, error } = await supabase.from("habitaciones").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching habitacion:", error)
      return NextResponse.json({ error: "Habitación no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ habitacion })
  } catch (error) {
    console.error("Error in GET habitacion:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Actualizar habitación
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verificar que el número de habitación no exista en otra habitación
    const { data: existingRoom, error: checkError } = await supabase
      .from("habitaciones")
      .select("id")
      .eq("numero", numero)
      .neq("id", params.id)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing room:", checkError)
      return NextResponse.json({ error: "Error al verificar habitación existente" }, { status: 500 })
    }

    if (existingRoom) {
      return NextResponse.json({ error: "Ya existe otra habitación con ese número" }, { status: 400 })
    }

    // Actualizar la habitación
    const { data: habitacionActualizada, error: updateError } = await supabase
      .from("habitaciones")
      .update({
        numero,
        tipo,
        precio: Number.parseFloat(precio),
        capacidad: Number.parseInt(capacidad),
        descripcion,
        amenidades: amenidades || [],
        estado,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating habitacion:", updateError)
      return NextResponse.json({ error: "Error al actualizar la habitación" }, { status: 500 })
    }

    return NextResponse.json({ habitacion: habitacionActualizada })
  } catch (error) {
    console.error("Error in PUT habitacion:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar habitación
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    console.log(`Intentando eliminar habitación con ID: ${params.id}`)

    // Verificar si la habitación existe
    const { data: habitacion, error: habitacionError } = await supabase
      .from("habitaciones")
      .select("*")
      .eq("id", params.id)
      .single()

    if (habitacionError) {
      console.error("Error fetching habitacion:", habitacionError)
      return NextResponse.json({ error: "Habitación no encontrada" }, { status: 404 })
    }

    console.log(`Habitación encontrada: ${habitacion.numero} - Estado: ${habitacion.estado}`)

    // Verificar si la habitación tiene reservas activas o futuras
    const { data: reservasActivas, error: reservasError } = await supabase
      .from("reservas")
      .select("id, estado, fecha_checkin, fecha_checkout, cliente_nombre")
      .eq("habitacion_id", params.id)
      .in("estado", ["confirmada", "checkin"])

    if (reservasError) {
      console.error("Error checking reservas:", reservasError)
      return NextResponse.json({ error: "Error al verificar reservas" }, { status: 500 })
    }

    console.log(`Reservas activas encontradas: ${reservasActivas?.length || 0}`)

    if (reservasActivas && reservasActivas.length > 0) {
      const reservasInfo = reservasActivas
        .map((r) => `${r.cliente_nombre} (${r.estado}) - ${r.fecha_checkin} a ${r.fecha_checkout}`)
        .join(", ")

      return NextResponse.json(
        {
          error: `No se puede eliminar la habitación. Tiene ${reservasActivas.length} reserva(s) activa(s): ${reservasInfo}`,
        },
        { status: 400 },
      )
    }

    // Verificar si hay reservas históricas (checkout)
    const { data: reservasHistoricas, error: historicoError } = await supabase
      .from("reservas")
      .select("id")
      .eq("habitacion_id", params.id)
      .eq("estado", "checkout")

    if (historicoError) {
      console.error("Error checking historical reservas:", historicoError)
      // No bloqueamos por esto, solo advertimos
    }

    const tieneHistorial = reservasHistoricas && reservasHistoricas.length > 0

    if (tieneHistorial) {
      console.log(`Habitación tiene ${reservasHistoricas.length} reservas históricas, pero se puede eliminar`)
    }

    // Eliminar la habitación
    const { error: deleteError } = await supabase.from("habitaciones").delete().eq("id", params.id)

    if (deleteError) {
      console.error("Error deleting habitacion:", deleteError)
      return NextResponse.json({ error: "Error al eliminar la habitación" }, { status: 500 })
    }

    console.log(`Habitación ${habitacion.numero} eliminada exitosamente`)

    return NextResponse.json({
      success: true,
      message: `Habitación ${habitacion.numero} eliminada exitosamente`,
      hadHistory: tieneHistorial,
    })
  } catch (error) {
    console.error("Error in DELETE habitacion:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
