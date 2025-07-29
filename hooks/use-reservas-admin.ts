"use client"

import { useState, useEffect, useCallback } from "react"

interface Reserva {
  id: number
  cliente_nombre: string
  cliente_email: string | null
  cliente_telefono: string | null
  cliente_documento: string | null
  tipo_documento: string | null
  nacionalidad: string | null
  habitacion_id: number
  fecha_checkin: string
  fecha_checkout: string
  total: number
  estado: string
  notas: string | null
  created_at: string
  habitaciones?: {
    numero: string
    tipo: string
  }
}

interface ReservasData {
  reservas: Reserva[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

interface Filters {
  search: string
  estado: string
  fecha_desde: string
  fecha_hasta: string
  habitacion_tipo: string
}

export function useReservasAdmin() {
  const [data, setData] = useState<ReservasData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    search: "",
    estado: "",
    fecha_desde: "",
    fecha_hasta: "",
    habitacion_tipo: "",
  })

  const fetchReservas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Construir URL con parámetros
      const searchParams = new URLSearchParams()
      searchParams.append("page", currentPage.toString())
      searchParams.append("limit", "10")

      if (filters.search) searchParams.append("search", filters.search)
      if (filters.estado && filters.estado !== "all") searchParams.append("estado", filters.estado)
      if (filters.fecha_desde) searchParams.append("fecha_desde", filters.fecha_desde)
      if (filters.fecha_hasta) searchParams.append("fecha_hasta", filters.fecha_hasta)
      if (filters.habitacion_tipo && filters.habitacion_tipo !== "all") {
        searchParams.append("habitacion_tipo", filters.habitacion_tipo)
      }

      const url = `/api/admin/reservas?${searchParams.toString()}`
      console.log("Fetching reservas from:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("Reservas response:", result)

      // Validar estructura de datos
      if (!result.reservas || !Array.isArray(result.reservas)) {
        throw new Error("Formato de respuesta inválido: falta array de reservas")
      }

      // Validar que cada reserva tenga los campos necesarios
      const validReservas = result.reservas.filter((reserva: any) => {
        if (!reserva || typeof reserva !== "object") {
          console.warn("Reserva inválida (no es objeto):", reserva)
          return false
        }

        if (!reserva.id || !reserva.estado) {
          console.warn("Reserva sin ID o estado:", reserva)
          return false
        }

        return true
      })

      setData({
        reservas: validReservas,
        pagination: result.pagination || {
          page: currentPage,
          limit: 10,
          total: validReservas.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      })
    } catch (err) {
      console.error("Error fetching reservas:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters])

  useEffect(() => {
    fetchReservas()
  }, [fetchReservas])

  const updateFilters = useCallback((newFilters: Filters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  const changePage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const refetch = useCallback(() => {
    fetchReservas()
  }, [fetchReservas])

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    changePage,
    refetch,
  }
}
