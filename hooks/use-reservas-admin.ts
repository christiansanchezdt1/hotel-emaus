"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface Reserva {
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
  busqueda?: string
}

export function useReservasAdmin(options: UseReservasAdminOptions = {}) {
  const { page = 1, limit = 10, estado, busqueda } = options

  const [data, setData] = useState<ReservasResponse>({
    reservas: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReservas = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔍 Fetching reservas con opciones:", { page, limit, estado, busqueda })

      // Construir query base
      let query = supabase
        .from("reservas")
        .select(
          `
          *,
          habitacion:habitaciones(numero, tipo)
        `,
          { count: "exact" },
        )
        .order("created_at", { ascending: false })

      // Aplicar filtros
      if (estado && estado !== "todos") {
        query = query.eq("estado", estado)
      }

      if (busqueda && busqueda.trim()) {
        query = query.or(
          `cliente_nombre.ilike.%${busqueda}%,cliente_email.ilike.%${busqueda}%,cliente_documento.ilike.%${busqueda}%`,
        )
      }

      // Aplicar paginación
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data: reservas, error: reservasError, count } = await query

      if (reservasError) {
        console.error("❌ Error obteniendo reservas:", reservasError)
        throw new Error("Error al obtener reservas: " + reservasError.message)
      }

      const totalPages = Math.ceil((count || 0) / limit)

      console.log("✅ Reservas obtenidas:", {
        reservas: reservas?.length || 0,
        total: count || 0,
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
      console.error("❌ Error en fetchReservas:", errorMessage)
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

  const deleteReserva = async (id: number) => {
    try {
      console.log("🗑️ Eliminando reserva:", id)

      const { error } = await supabase.from("reservas").delete().eq("id", id)

      if (error) {
        console.error("❌ Error eliminando reserva:", error)
        throw new Error("Error al eliminar reserva: " + error.message)
      }

      console.log("✅ Reserva eliminada correctamente")

      // Refrescar datos
      await fetchReservas()

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("❌ Error en deleteReserva:", errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateReservaEstado = async (id: number, nuevoEstado: string) => {
    try {
      console.log("📝 Actualizando estado de reserva:", { id, nuevoEstado })

      const { error } = await supabase.from("reservas").update({ estado: nuevoEstado }).eq("id", id)

      if (error) {
        console.error("❌ Error actualizando reserva:", error)
        throw new Error("Error al actualizar reserva: " + error.message)
      }

      console.log("✅ Estado de reserva actualizado correctamente")

      // Refrescar datos
      await fetchReservas()

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("❌ Error en updateReservaEstado:", errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchReservas()
  }, [page, limit, estado, busqueda])

  return {
    reservas: data.reservas,
    total: data.total,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    loading,
    error,
    refetch: fetchReservas,
    deleteReserva,
    updateReservaEstado,
  }
}
