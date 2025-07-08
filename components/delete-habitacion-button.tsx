"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"

interface DeleteHabitacionButtonProps {
  habitacion: {
    id: number
    numero: string
    tipo: string
    precio: number
    capacidad: number
    descripcion?: string | null
    amenidades?: string[] | null
    estado: string
  }
  size?: "default" | "sm" | "lg"
  variant?: "default" | "destructive" | "outline"
}

export function DeleteHabitacionButton({
  habitacion,
  size = "sm",
  variant = "destructive",
}: DeleteHabitacionButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/habitaciones/${habitacion.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al eliminar la habitación")
      }

      // Recargar la página para mostrar los cambios
      router.refresh()
    } catch (error) {
      console.error("Error deleting habitacion:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const canDelete = habitacion.estado === "disponible"
  const deleteReason = !canDelete ? `No se pueden eliminar habitaciones en estado: ${habitacion.estado}` : ""

  // Crear descripción detallada para el modal
  const modalDescription = `Esta acción eliminará permanentemente la habitación del sistema.

Detalles de la habitación:
• Número: #${habitacion.numero}
• Tipo: ${habitacion.tipo}
• Precio: $${habitacion.precio} por noche
• Capacidad: ${habitacion.capacidad} personas
• Estado: ${habitacion.estado}
${habitacion.descripcion ? `• Descripción: ${habitacion.descripcion}` : ""}
${
  habitacion.amenidades && habitacion.amenidades.length > 0
    ? `• Amenidades: ${habitacion.amenidades.join(", ")}`
    : "• Sin amenidades especiales"
}`

  const itemName = `Habitación #${habitacion.numero} (${habitacion.tipo})`

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowModal(true)}
        disabled={!canDelete}
        title={deleteReason}
      >
        <Trash2 className="w-4 h-4" />
        {size !== "sm" && <span className="ml-2">Eliminar</span>}
      </Button>

      <DeleteConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Habitación"
        description={modalDescription}
        itemName={itemName}
        destructiveAction="eliminar"
      />
    </>
  )
}
