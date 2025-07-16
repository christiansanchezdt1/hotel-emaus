"use client"

import { useState, useEffect } from "react"
import { supabaseAdmin } from "@/lib/supabase"

interface Reserva {
  id: number
  habitacion_id: number
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string | null
  cliente_documento: string | null
  tipo_documento: string | null
  nacionalidad: string | null
  fecha_checkin: string
  fecha_checkout: string
  estado: string
  total: number
  created_at: string
  habitacion?: {
    numero: string
    tipo: string
  }
}

interface ReservasResponse {
  reservas: Reserva[]
  total: number
  totalPages: number
  currentPage: number
}

interface UseReservasAdminOptions {
  page?: number
  limit?: number
  estado?: string
  search?: string
}

export function useReservasAdmin(options: UseReservasAdminOptions = {}) {
  const { page = 1, limit = 10, estado, search } = options

  const [data, setData] = useState<ReservasResponse>({
    reservas: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservas = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔍 Hook: Fetching reservas con opciones:", { page, limit, estado, search })

      let query = supabaseAdmin
        .from("reservas")
        .select(
          `
          *,
          habitacion:habitaciones(numero, tipo)
        `,
          { count: "exact" },
        )
        .order("created_at", { ascending: false })

      // Filtrar por estado si se especifica
      if (estado && estado !== "todos") {
        query = query.eq("estado", estado)
      }

      // Filtrar por búsqueda si se especifica
      if (search && search.trim()) {
        query = query.or(
          `cliente_nombre.ilike.%${search}%,cliente_email.ilike.%${search}%,cliente_documento.ilike.%${search}%`,
        )
      }

      // Paginación
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data: reservas, error: reservasError, count } = await query

      if (reservasError) {
        console.error("❌ Hook: Error al obtener reservas:", reservasError)
        throw new Error("Error al obtener reservas: " + reservasError.message)
      }

      const totalPages = Math.ceil((count || 0) / limit)

      console.log("✅ Hook: Reservas obtenidas:", {
        reservasCount: reservas?.length || 0,
        total: count,
        totalPages,
        currentPage: page,
      })

      setData({
        reservas: reservas || [],
        total: count || 0,
        totalPages,
        currentPage: page,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("❌ Hook: Error en fetchReservas:", errorMessage)
      setError(errorMessage)
      setData({
        reservas: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      })
    } finally {
      setLoading(false)
    }
  }

  const eliminarReserva = async (id: number) => {
    try {
      console.log("🗑️ Hook: Eliminando reserva:", id)

      const { error } = await supabaseAdmin.from("reservas").delete().eq("id", id)

      if (error) {
        console.error("❌ Hook: Error al eliminar reserva:", error)
        throw new Error("Error al eliminar reserva: " + error.message)
      }

      console.log("✅ Hook: Reserva eliminada exitosamente")
      await fetchReservas() // Refrescar la lista
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("❌ Hook: Error en eliminarReserva:", errorMessage)
      throw new Error(errorMessage)
    }
  }

  const actualizarEstadoReserva = async (id: number, nuevoEstado: string) => {
    try {
      console.log("📝 Hook: Actualizando estado de reserva:", { id, nuevoEstado })

      const { error } = await supabaseAdmin.from("reservas").update({ estado: nuevoEstado }).eq("id", id)

      if (error) {
        console.error("❌ Hook: Error al actualizar estado:", error)
        throw new Error("Error al actualizar estado: " + error.message)
      }

      console.log("✅ Hook: Estado actualizado exitosamente")
      await fetchReservas() // Refrescar la lista
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("❌ Hook: Error en actualizarEstadoReserva:", errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchReservas()
  }, [page, limit, estado, search])

  return {
    reservas: data.reservas,
    total: data.total,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    loading,
    error,
    refetch: fetchReservas,
    eliminarReserva,
    actualizarEstadoReserva,
  }
}
