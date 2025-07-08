import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAdminSession } from "@/lib/auth"

// GET - Obtener una reserva específica
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { data: reserva, error } = await supabase
      .from("reservas")
      .select(
        `
        *,
        habitaciones (
          numero,
          tipo,
          precio,
          capacidad
        )
      `,
      )
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching reserva:", error)
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ reserva })
  } catch (error) {
    console.error("Error in GET reserva:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Actualizar reserva
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verificar disponibilidad (excluyendo la reserva actual)
    const { data: conflictos, error: conflictError } = await supabase
      .from("reservas")
      .select("id")
      .eq("habitacion_id", habitacion_id)
      .neq("id", params.id)
      .in("estado", ["confirmada", "checkin"])
      .or(`fecha_checkin.lte.${fecha_checkout},fecha_checkout.gte.${fecha_checkin}`)

    if (conflictError) {
      console.error("Error checking conflicts:", conflictError)
      return NextResponse.json({ error: "Error al verificar disponibilidad" }, { status: 500 })
    }

    if (conflictos && conflictos.length > 0) {
      return NextResponse.json({ error: "La habitación no está disponible en esas fechas" }, { status: 400 })
    }

    // Actualizar la reserva
    const { data: reservaActualizada, error: updateError } = await supabase
      .from("reservas")
      .update({
        habitacion_id,
        cliente_nombre,
        cliente_email,
        cliente_telefono,
        fecha_checkin,
        fecha_checkout,
        estado,
        total,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating reserva:", updateError)
      return NextResponse.json({ error: "Error al actualizar la reserva" }, { status: 500 })
    }

    return NextResponse.json({ reserva: reservaActualizada })
  } catch (error) {
    console.error("Error in PUT reserva:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar reserva
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { error } = await supabase.from("reservas").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting reserva:", error)
      return NextResponse.json({ error: "Error al eliminar la reserva" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE reserva:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
