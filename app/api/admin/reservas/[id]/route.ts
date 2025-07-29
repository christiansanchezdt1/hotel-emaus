import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAdminSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    console.log("📋 GET /api/admin/reservas/[id] - ID:", id)

    const { data: reserva, error } = await supabase
      .from("reservas")
      .select(`
        *,
        habitaciones (
          id,
          numero,
          tipo,
          precio,
          capacidad,
          amenidades
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.log("❌ Error al obtener reserva:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })
      }
      return NextResponse.json({ error: "Error al obtener la reserva" }, { status: 500 })
    }

    console.log("✅ Reserva obtenida:", reserva.id)
    return NextResponse.json(reserva)
  } catch (error) {
    console.error("❌ Error general en GET /api/admin/reservas/[id]:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    console.log("📝 PUT /api/admin/reservas/[id] - ID:", id, "Datos:", body)

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
      estado,
      notas,
    } = body

    // Validaciones básicas
    if (!habitacion_id || !cliente_nombre || !cliente_email || !fecha_checkin || !fecha_checkout || !total) {
      console.log("❌ Faltan campos requeridos")
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Validar fechas
    const checkinDate = new Date(fecha_checkin)
    const checkoutDate = new Date(fecha_checkout)

    if (checkoutDate <= checkinDate) {
      console.log("❌ Fecha de check-out debe ser posterior al check-in")
      return NextResponse.json({ error: "La fecha de check-out debe ser posterior al check-in" }, { status: 400 })
    }

    // Validar formato del documento si se proporciona
    if (cliente_documento && tipo_documento) {
      if (tipo_documento === "DNI") {
        const dniRegex = /^\d{7,8}$/
        if (!dniRegex.test(cliente_documento)) {
          return NextResponse.json({ error: "El DNI debe tener 7 u 8 dígitos" }, { status: 400 })
        }
      } else if (tipo_documento === "PASAPORTE") {
        const pasaporteRegex = /^[A-Z0-9]{6,}$/i
        if (!pasaporteRegex.test(cliente_documento)) {
          return NextResponse.json(
            { error: "El pasaporte debe tener al menos 6 caracteres alfanuméricos" },
            { status: 400 },
          )
        }
      }
    }

    // Verificar disponibilidad (excluyendo la reserva actual)
    const { data: conflictos, error: conflictError } = await supabase
      .from("reservas")
      .select("id")
      .eq("habitacion_id", habitacion_id)
      .neq("id", id)
      .in("estado", ["confirmada", "checkin", "pendiente"])
      .lte("fecha_checkin", fecha_checkout)
      .gte("fecha_checkout", fecha_checkin)

    if (conflictError) {
      console.error("Error checking conflicts:", conflictError)
      return NextResponse.json({ error: "Error al verificar disponibilidad" }, { status: 500 })
    }

    if (conflictos && conflictos.length > 0) {
      return NextResponse.json(
        {
          error: "FECHAS_SOLAPADAS",
          message: "Las fechas seleccionadas se solapan con otra reserva existente para esta habitación",
        },
        { status: 409 },
      )
    }

    try {
      // Preparar datos para actualizar (solo campos que existen en la tabla)
      const updateData = {
        habitacion_id,
        cliente_nombre,
        cliente_email,
        cliente_telefono,
        cliente_documento: cliente_documento || null,
        tipo_documento: tipo_documento || "DNI",
        nacionalidad: nacionalidad || "Argentina",
        fecha_checkin,
        fecha_checkout,
        total,
        estado,
        // Solo incluir notas si se proporciona
        ...(notas !== undefined && { notas: notas || null }),
      }

      console.log("📝 Datos a actualizar:", updateData)

      // Actualizar la reserva (updated_at se actualiza automáticamente por el trigger)
      const { data: reservaActualizada, error: errorUpdate } = await supabase
        .from("reservas")
        .update(updateData)
        .eq("id", id)
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

      if (errorUpdate) {
        console.log("❌ Error al actualizar reserva:", errorUpdate)

        if (errorUpdate.code === "PGRST116") {
          return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })
        }

        if (errorUpdate.code === "PGRST204") {
          return NextResponse.json(
            {
              error: "Error de esquema de base de datos. Algunas columnas no existen. Contacte al administrador.",
            },
            { status: 500 },
          )
        }

        return NextResponse.json({ error: "Error al actualizar la reserva" }, { status: 500 })
      }

      console.log("✅ Reserva actualizada exitosamente:", reservaActualizada.id)

      return NextResponse.json({
        success: true,
        message: "Reserva actualizada exitosamente",
        reserva: reservaActualizada,
      })
    } catch (dbError: any) {
      console.log("❌ Error de base de datos:", dbError)
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Error general en PUT /api/admin/reservas/[id]:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    console.log("🗑️ DELETE /api/admin/reservas/[id] - ID:", id)

    // Verificar que la reserva existe y obtener su estado
    const { data: reservaExistente, error: errorCheck } = await supabase
      .from("reservas")
      .select("id, estado, cliente_nombre")
      .eq("id", id)
      .single()

    if (errorCheck) {
      console.log("❌ Error al verificar reserva:", errorCheck)
      if (errorCheck.code === "PGRST116") {
        return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })
      }
      return NextResponse.json({ error: "Error al verificar la reserva" }, { status: 500 })
    }

    // No permitir eliminar reservas con checkout completado
    if (reservaExistente.estado === "checkout") {
      console.log("❌ Intento de eliminar reserva con checkout completado")
      return NextResponse.json(
        {
          error: "No se puede eliminar una reserva con checkout completado",
        },
        { status: 400 },
      )
    }

    // Eliminar la reserva
    const { error: errorDelete } = await supabase.from("reservas").delete().eq("id", id)

    if (errorDelete) {
      console.log("❌ Error al eliminar reserva:", errorDelete)
      return NextResponse.json({ error: "Error al eliminar la reserva" }, { status: 500 })
    }

    console.log("✅ Reserva eliminada exitosamente:", id)

    return NextResponse.json({
      success: true,
      message: `Reserva de ${reservaExistente.cliente_nombre} eliminada exitosamente`,
    })
  } catch (error) {
    console.error("❌ Error general en DELETE /api/admin/reservas/[id]:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
