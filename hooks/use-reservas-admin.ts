"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export interface ReservaAdmin {
  id: number
  habitacion_id: number
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string | null
  fecha_checkin: string
  fecha_checkout: string
  estado: string
  total: number
  created_at: string
  habitaciones: {
    numero: string
    tipo: string
    precio: number
  }
}

export interface ReservasResponse {
  reservas: ReservaAdmin[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ReservasFilters {
  estado: string
  tipo: string
  fecha: string
  search: string
  page: number
  limit: number
}

export function useReservasAdmin() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [data, setData] = useState<ReservasResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Obtener filtros de la URL
  const filters: ReservasFilters = {
    estado: searchParams.get("estado") || "todas",
    tipo: searchParams.get("tipo") || "todos",
    fecha: searchParams.get("fecha") || "",
    search: searchParams.get("search") || "",
    page: Number.parseInt(searchParams.get("page") || "1"),
    limit: Number.parseInt(searchParams.get("limit") || "10"),
  }

  const fetchReservas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        estado: filters.estado,
        tipo: filters.tipo,
        fecha: filters.fecha,
        search: filters.search,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      })

      const response = await fetch(`/api/admin/reservas?${params}`)

      if (!response.ok) {
        throw new Error("Error al cargar reservas")
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [filters.estado, filters.tipo, filters.fecha, filters.search, filters.page, filters.limit])

  useEffect(() => {
    fetchReservas()
  }, [fetchReservas])

  const updateFilters = useCallback(
    (newFilters: Partial<ReservasFilters>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "todas" && value !== "todos" && value !== "") {
          params.set(key, value.toString())
        } else {
          params.delete(key)
        }
      })

      // Si cambiamos filtros, volver a página 1
      if (newFilters.estado || newFilters.tipo || newFilters.fecha || newFilters.search) {
        params.delete("page")
      }

      router.push(`/admin/reservas?${params.toString()}`)
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
    refetch: fetchReservas,
  }
}
