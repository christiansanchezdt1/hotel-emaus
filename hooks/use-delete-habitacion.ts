"use client"

import { useState } from "react"

interface DeleteHabitacionOptions {
  onSuccess?: () => void
}

export function useDeleteHabitacion(options: DeleteHabitacionOptions = {}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteHabitacion = async (habitacionId: number) => {
    setIsDeleting(true)
    setError(null)

    try {
      console.log(`Eliminando habitación ${habitacionId}...`)

      const response = await fetch(`/api/admin/habitaciones/${habitacionId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar la habitación")
      }

      console.log(`Habitación ${habitacionId} eliminada exitosamente`)

      // Llamar callback de éxito si existe
      if (options.onSuccess) {
        options.onSuccess()
      }

      return { success: true, message: data.message }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("Error eliminando habitación:", errorMessage)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteHabitacion,
    isDeleting,
    error,
  }
}
