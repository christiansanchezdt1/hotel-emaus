import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAdminSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener todas las habitaciones
    const { data: habitaciones, error: habitacionesError } = await supabase.from("habitaciones").select("*")

    if (habitacionesError) {
      console.error("Error fetching habitaciones:", habitacionesError)
      return NextResponse.json({ error: "Error al obtener habitaciones" }, { status: 500 })
    }

    // Obtener reservas activas para determinar ocupación real
    const { data: reservasActivas, error: reservasActivasError } = await supabase
      .from("reservas")
      .select("habitacion_id, estado, fecha_checkin, fecha_checkout")
      .in("estado", ["confirmada", "checkin"])

    if (reservasActivasError) {
      console.error("Error fetching reservas activas:", reservasActivasError)
      return NextResponse.json({ error: "Error al obtener reservas activas" }, { status: 500 })
    }

    // Obtener todas las reservas para estadísticas generales
    const { data: todasReservas, error: reservasError } = await supabase.from("reservas").select("*")

    if (reservasError) {
      console.error("Error fetching reservas:", reservasError)
      return NextResponse.json({ error: "Error al obtener reservas" }, { status: 500 })
    }

    // Calcular estadísticas de habitaciones
    const totalHabitaciones = habitaciones?.length || 0
    const habitacionesOcupadas = new Set(reservasActivas?.map((r) => r.habitacion_id) || []).size
    const habitacionesDisponibles = totalHabitaciones - habitacionesOcupadas
    const habitacionesMantenimiento = habitaciones?.filter((h) => h.estado === "mantenimiento").length || 0

    // Calcular estadísticas de reservas
    const totalReservas = todasReservas?.length || 0
    const reservasConfirmadas = todasReservas?.filter((r) => r.estado === "confirmada").length || 0
    const reservasCheckin = todasReservas?.filter((r) => r.estado === "checkin").length || 0
    const reservasCheckout = todasReservas?.filter((r) => r.estado === "checkout").length || 0
    const reservasCanceladas = todasReservas?.filter((r) => r.estado === "cancelada").length || 0

    // Calcular ingresos
    const fechaActual = new Date()
    const mesActual = fechaActual.getMonth() + 1
    const añoActual = fechaActual.getFullYear()
    const mesAnterior = mesActual === 1 ? 12 : mesActual - 1
    const añoMesAnterior = mesActual === 1 ? añoActual - 1 : añoActual

    const reservasCompletadas = todasReservas?.filter((r) => r.estado === "checkout") || []

    const ingresosMesActual = reservasCompletadas
      .filter((r) => {
        const fechaCheckout = new Date(r.fecha_checkout)
        return fechaCheckout.getMonth() + 1 === mesActual && fechaCheckout.getFullYear() === añoActual
      })
      .reduce((sum, r) => sum + (r.precio_total || 0), 0)

    const ingresosMesAnterior = reservasCompletadas
      .filter((r) => {
        const fechaCheckout = new Date(r.fecha_checkout)
        return fechaCheckout.getMonth() + 1 === mesAnterior && fechaCheckout.getFullYear() === añoMesAnterior
      })
      .reduce((sum, r) => sum + (r.precio_total || 0), 0)

    const ingresosAño = reservasCompletadas
      .filter((r) => {
        const fechaCheckout = new Date(r.fecha_checkout)
        return fechaCheckout.getFullYear() === añoActual
      })
      .reduce((sum, r) => sum + (r.precio_total || 0), 0)

    // Calcular precio promedio de habitaciones
    const precioPromedio =
      habitaciones && habitaciones.length > 0
        ? habitaciones.reduce((sum, h) => sum + (h.precio || 0), 0) / habitaciones.length
        : 0

    // Calcular porcentaje de ocupación
    const porcentajeOcupacion = totalHabitaciones > 0 ? (habitacionesOcupadas / totalHabitaciones) * 100 : 0

    const stats = {
      habitaciones: {
        total: totalHabitaciones,
        disponibles: habitacionesDisponibles,
        ocupadas: habitacionesOcupadas,
        mantenimiento: habitacionesMantenimiento,
        precioPromedio: Math.round(precioPromedio),
        porcentajeOcupacion: Math.round(porcentajeOcupacion * 100) / 100,
      },
      reservas: {
        total: totalReservas,
        confirmadas: reservasConfirmadas,
        checkin: reservasCheckin,
        checkout: reservasCheckout,
        canceladas: reservasCanceladas,
        activas: reservasConfirmadas + reservasCheckin,
      },
      ingresos: {
        mesActual: Math.round(ingresosMesActual),
        mesAnterior: Math.round(ingresosMesAnterior),
        año: Math.round(ingresosAño),
        crecimiento:
          ingresosMesAnterior > 0
            ? Math.round(((ingresosMesActual - ingresosMesAnterior) / ingresosMesAnterior) * 100)
            : 0,
      },
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error in dashboard stats:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
