"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

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
  reservasActivas: Array<{
    id: number
    estado: string
    cliente_nombre: string
    fecha_checkin: string
    fecha_checkout: string
  }>
  reservasHistoricas: Array<{ id: number }>
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
  estado: string
  tipo: string
  search: string
  page: number
  limit: number
}

export function useHabitacionesAdmin() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [data, setData] = useState<HabitacionesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Obtener filtros de la URL
  const filters: HabitacionesFilters = {
    estado: searchParams.get("estado") || "todas",
    tipo: searchParams.get("tipo") || "todos",
    search: searchParams.get("search") || "",
    page: Number.parseInt(searchParams.get("page") || "1"),
    limit: Number.parseInt(searchParams.get("limit") || "12"),
  }

  const fetchHabitaciones = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        estado: filters.estado,
        tipo: filters.tipo,
        search: filters.search,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      })

      const response = await fetch(`/api/admin/habitaciones?${params}`)

      if (!response.ok) {
        throw new Error("Error al cargar habitaciones")
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [filters.estado, filters.tipo, filters.search, filters.page, filters.limit])

  useEffect(() => {
    fetchHabitaciones()
  }, [fetchHabitaciones])

  const updateFilters = useCallback(
    (newFilters: Partial<HabitacionesFilters>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "todas" && value !== "todos" && value !== "") {
          params.set(key, value.toString())
        } else {
          params.delete(key)
        }
      })

      // Si cambiamos filtros, volver a página 1
      if (newFilters.estado || newFilters.tipo || newFilters.search) {
        params.delete("page")
      }

      router.push(`/admin/habitaciones?${params.toString()}`)
    },
    [router, searchParams],
  )

  const changePage = useCallback(
    (page: number) => {
      updateFilters({ page })
    },
    [updateFilters],
  )

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    changePage,
    refetch: fetchHabitaciones,
  }
}
