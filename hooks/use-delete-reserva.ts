"use client"

import { useState } from "react"

interface DeleteReservaOptions {
  onSuccess?: () => void
}

export function useDeleteReserva(options: DeleteReservaOptions = {}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteReserva = async (reservaId: number) => {
    setIsDeleting(true)
    setError(null)

    try {
      console.log(`Eliminando reserva ${reservaId}...`)

      const response = await fetch(`/api/admin/reservas/${reservaId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar la reserva")
      }

      console.log(`Reserva ${reservaId} eliminada exitosamente`)

      // Llamar callback de éxito si existe
      if (options.onSuccess) {
        options.onSuccess()
      }

      return { success: true, message: data.message }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("Error eliminando reserva:", errorMessage)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteReserva,
    isDeleting,
    error,
  }
}
