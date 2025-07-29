"use client"

import { useState, useEffect, useCallback } from "react"

export interface ReservaHabitacion {
  id: number
  estado: string
  cliente_nombre: string
  cliente_email: string
  fecha_checkin: string
  fecha_checkout: string
  total: number
}

export interface HabitacionAdmin {
  id: number
  numero: string
  tipo: string
  precio: number
  capacidad: number
  descripcion: string | null
  amenidades: string[] | null
  estado: string
  estadoReal: string
  created_at: string
  reservasActivas: ReservaHabitacion[]
  reservasFuturas: ReservaHabitacion[]
  todasLasReservas: ReservaHabitacion[]
  puedeEliminar: boolean
}

export interface HabitacionesResponse {
  habitaciones: HabitacionAdmin[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface HabitacionesFilters {
  estado?: string
  tipo?: string
  search?: string
  page?: number
  limit?: number
  capacidad?: number
  precio_min?: number
  precio_max?: number
}

export function useHabitacionesAdmin(filters: HabitacionesFilters = {}) {
  const [habitaciones, setHabitaciones] = useState<HabitacionAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<HabitacionesResponse["pagination"] | null>(null)

  const fetchHabitaciones = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      // Aplicar filtros
      if (filters.estado && filters.estado !== "all" && filters.estado !== "todas") {
        params.set("estado", filters.estado)
      }
      if (filters.tipo && filters.tipo !== "all" && filters.tipo !== "todos") {
        params.set("tipo", filters.tipo)
      }
      if (filters.search && filters.search.trim()) {
        params.set("search", filters.search.trim())
      }
      if (filters.page && filters.page > 0) {
        params.set("page", filters.page.toString())
      }
      if (filters.limit && filters.limit > 0) {
        params.set("limit", filters.limit.toString())
      }

      const url = `/api/admin/habitaciones${params.toString() ? `?${params.toString()}` : ""}`
      console.log("Fetching habitaciones from:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }))
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
      }

      const data: HabitacionesResponse = await response.json()
      console.log("Data received:", data)

      // Validar que la respuesta tenga la estructura esperada
      if (!data || typeof data !== "object") {
        throw new Error("Respuesta inválida del servidor")
      }

      const habitacionesArray = Array.isArray(data.habitaciones) ? data.habitaciones : []
      const paginationData = data.pagination || {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      }

      console.log("Setting habitaciones:", habitacionesArray.length)
      setHabitaciones(habitacionesArray)
      setPagination(paginationData)
    } catch (err) {
      console.error("Error fetching habitaciones:", err)
      const errorMessage = err instanceof Error ? err.message : "Error al cargar habitaciones"
      setError(errorMessage)
      setHabitaciones([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [
    filters.estado,
    filters.tipo,
    filters.search,
    filters.page,
    filters.limit,
    filters.capacidad,
    filters.precio_min,
    filters.precio_max,
  ])

  useEffect(() => {
    fetchHabitaciones()
  }, [fetchHabitaciones])

  const refetch = useCallback(() => {
    fetchHabitaciones()
  }, [fetchHabitaciones])

  return {
    habitaciones,
    loading,
    error,
    pagination,
    refetch,
  }
}
