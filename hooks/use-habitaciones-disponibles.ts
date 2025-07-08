"use client"

import { useState, useEffect } from "react"

export interface Habitacion {
  id: number
  numero: string
  tipo: string
  precio: number
  capacidad: number
  descripcion: string | null
  amenidades: string[] | null
  estado: string
  created_at: string
}

export interface HabitacionesResponse {
  habitaciones: Habitacion[]
  fecha: string
  total: number
}

export function useHabitacionesDisponibles(fecha?: string) {
  const [data, setData] = useState<HabitacionesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        setLoading(true)
        setError(null)

        const fechaParam = fecha || new Date().toISOString().split("T")[0]
        const response = await fetch(`/api/habitaciones-disponibles?fecha=${fechaParam}`)

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
    }

    fetchHabitaciones()
  }, [fecha])

  return { data, loading, error, refetch: () => setLoading(true) }
}
