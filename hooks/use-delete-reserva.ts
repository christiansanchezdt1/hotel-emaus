"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function useDeleteReserva() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const deleteReserva = async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/reservas/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al eliminar la reserva")
      }

      // Refrescar la página para mostrar los cambios
      router.refresh()
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    deleteReserva,
    loading,
    error,
  }
}
