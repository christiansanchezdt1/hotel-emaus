"use client"

import { useState, useEffect } from "react"

interface Habitacion {
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

interface HabitacionesResponse {
  habitaciones: Habitacion[]
  total: number
  mensaje?: string
  error?: string
  warning?: string
}

export function useHabitacionesDisponibles(fecha?: string) {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchHabitaciones = async (fechaConsulta?: string) => {
    setIsLoading(true)
    setError(null)
    setWarning(null)

    try {
      console.log("🔍 Hook: Consultando habitaciones disponibles", { fecha: fechaConsulta })

      const url = fechaConsulta
        ? `/api/habitaciones-disponibles?fecha=${encodeURIComponent(fechaConsulta)}`
        : "/api/habitaciones-disponibles"

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: HabitacionesResponse = await response.json()
      console.log("✅ Hook: Respuesta recibida:", {
        habitaciones: data.habitaciones?.length || 0,
        mensaje: data.mensaje,
        error: data.error,
        warning: data.warning,
      })

      if (data.error) {
        setError(data.error)
        setHabitaciones([])
      } else {
        setHabitaciones(data.habitaciones || [])
        setTotal(data.total || 0)
        setMensaje(data.mensaje || null)
        setWarning(data.warning || null)
      }
    } catch (err) {
      console.error("❌ Hook: Error en fetchHabitaciones:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
      setHabitaciones([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHabitaciones(fecha)
  }, [fecha])

  return {
    habitaciones,
    isLoading,
    error,
    mensaje,
    warning,
    total,
    refetch: fetchHabitaciones,
  }
}
