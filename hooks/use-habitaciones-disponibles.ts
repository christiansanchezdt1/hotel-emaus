"use client"

import { useState, useEffect } from "react"

export interface Habitacion {
  id: number
  numero: string
  tipo: string
  capacidad: number
  precio: number
  descripcion: string
  amenidades: string[]
  imagen_url: string
  estado: string
}

export interface HabitacionesResponse {
  habitaciones: Habitacion[]
  total: number
  filtros: {
    fechaInicio: string | null
    fechaFin: string | null
    tipo: string | null
    capacidad: string | null
  }
}

export interface UseHabitacionesDisponiblesOptions {
  fechaInicio?: string
  fechaFin?: string
  tipo?: string
  capacidad?: string
  autoFetch?: boolean
}

export function useHabitacionesDisponibles(options: UseHabitacionesDisponiblesOptions = {}) {
  const [data, setData] = useState<HabitacionesResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHabitaciones = async (params?: UseHabitacionesDisponiblesOptions) => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()

      const finalParams = { ...options, ...params }

      if (finalParams.fechaInicio) searchParams.set("fechaInicio", finalParams.fechaInicio)
      if (finalParams.fechaFin) searchParams.set("fechaFin", finalParams.fechaFin)
      if (finalParams.tipo) searchParams.set("tipo", finalParams.tipo)
      if (finalParams.capacidad) searchParams.set("capacidad", finalParams.capacidad)

      console.log("🔍 Fetching habitaciones con parámetros:", finalParams)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout

      const response = await fetch(`/api/habitaciones-disponibles?${searchParams.toString()}`, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          // Si no se puede parsear el JSON, usar el mensaje por defecto
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("✅ Habitaciones obtenidas:", result)

      setData(result)
      return result
    } catch (err: any) {
      const errorMessage =
        err.name === "AbortError" ? "La consulta tardó demasiado tiempo" : err.message || "Error al cargar habitaciones"

      console.error("❌ Error en useHabitacionesDisponibles:", errorMessage)
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch en mount si está habilitado
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchHabitaciones()
    }
  }, []) // Solo en mount

  return {
    data,
    loading,
    error,
    refetch: fetchHabitaciones,
    habitaciones: data?.habitaciones || [],
    total: data?.total || 0,
  }
}

export default useHabitacionesDisponibles
