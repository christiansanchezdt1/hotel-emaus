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
}

interface HabitacionesResponse {
  habitaciones: Habitacion[]
  fecha: string
  total: number
  warning?: string
  error?: string
  debug?: {
    fechaOriginal: string
    fechaFormateada: string
    totalHabitaciones: number
    reservasEncontradas: number
    habitacionesOcupadas: number[]
  }
}

export function useHabitacionesDisponibles(fecha?: string) {
  const [data, setData] = useState<HabitacionesResponse>({
    habitaciones: [],
    fecha: new Date().toISOString().split("T")[0],
    total: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHabitaciones = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔍 Hook: Iniciando fetch con fecha:", fecha)

      // Validar y formatear fecha en el frontend también
      let fechaParam = ""
      if (fecha) {
        try {
          const fechaObj = new Date(fecha + "T00:00:00.000Z")
          if (isNaN(fechaObj.getTime())) {
            throw new Error("Fecha inválida en el hook")
          }
          fechaParam = fechaObj.toISOString().split("T")[0]
          console.log("📅 Hook: Fecha formateada:", fechaParam)
        } catch (dateError) {
          console.error("❌ Hook: Error formateando fecha:", dateError)
          setError("Formato de fecha inválido")
          return
        }
      }

      let url = "/api/habitaciones-disponibles"
      if (fechaParam) {
        url += `?fecha=${encodeURIComponent(fechaParam)}`
      }

      console.log("📡 Hook: Llamando URL:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store",
      })

      console.log("📡 Hook: Response status:", response.status)
      console.log("📡 Hook: Response ok:", response.ok)

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
      }

      const text = await response.text()
      console.log("📡 Hook: Response text (primeros 200 chars):", text.substring(0, 200))

      let result: HabitacionesResponse
      try {
        result = JSON.parse(text)
      } catch (parseError) {
        console.error("❌ Hook: Error parsing JSON:", parseError)
        console.error("❌ Hook: Full response text:", text)
        throw new Error("La respuesta del servidor no es JSON válido")
      }

      console.log("📊 Hook: Resultado parseado:", {
        total: result.total,
        fecha: result.fecha,
        hasError: !!result.error,
        hasWarning: !!result.warning,
        debug: result.debug,
      })

      // Validar estructura de respuesta
      if (!result || typeof result !== "object") {
        throw new Error("Respuesta del servidor tiene formato inválido")
      }

      const habitacionesData: HabitacionesResponse = {
        habitaciones: Array.isArray(result.habitaciones) ? result.habitaciones : [],
        fecha: result.fecha || fechaParam || new Date().toISOString().split("T")[0],
        total: result.total || 0,
        warning: result.warning,
        error: result.error,
        debug: result.debug,
      }

      setData(habitacionesData)

      if (result.error) {
        setError(result.error)
      }

      console.log("✅ Hook: Datos establecidos correctamente:", {
        habitaciones: habitacionesData.habitaciones.length,
        total: habitacionesData.total,
        fecha: habitacionesData.fecha,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar habitaciones"
      console.error("❌ Hook: Error en fetchHabitaciones:", errorMessage)
      setError(errorMessage)

      setData({
        habitaciones: [],
        fecha: fecha || new Date().toISOString().split("T")[0],
        total: 0,
        error: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("🔄 Hook: useEffect disparado con fecha:", fecha)
    fetchHabitaciones()
  }, [fecha])

  return {
    habitaciones: data.habitaciones,
    loading,
    error: error || data.error || null,
    refetch: fetchHabitaciones,
    total: data.total,
    fecha: data.fecha,
    warning: data.warning,
    debug: data.debug,
  }
}
