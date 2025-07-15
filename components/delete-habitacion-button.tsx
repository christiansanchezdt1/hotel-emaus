"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { useDeleteHabitacion } from "@/hooks/use-delete-habitacion"

interface Habitacion {
  id: number
  numero: string
  tipo: string
  precio: number
  capacidad: number
  estado: string
  descripcion?: string
  amenidades?: string[]
}

interface DeleteHabitacionButtonProps {
  habitacion: Habitacion
  onDeleted?: () => void
}

export function DeleteHabitacionButton({ habitacion, onDeleted }: DeleteHabitacionButtonProps) {
  const [showModal, setShowModal] = useState(false)

  const { deleteHabitacion, isDeleting } = useDeleteHabitacion({
    onSuccess: () => {
      console.log("Habitación eliminada, ejecutando callback...")
      if (onDeleted) {
        onDeleted()
      }
    },
  })

  const handleDelete = async () => {
    const result = await deleteHabitacion(habitacion.id)

    if (result.success) {
      setShowModal(false)
    }
  }

  // Solo permitir eliminar habitaciones disponibles
  const canDelete = habitacion.estado === "disponible"
  const tooltipText = !canDelete
    ? "No se puede eliminar una habitación ocupada o en mantenimiento"
    : "Eliminar habitación"

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowModal(true)}
        disabled={!canDelete || isDeleting}
        title={tooltipText}
        className={!canDelete ? "opacity-50 cursor-not-allowed" : ""}
      >
        <Trash2 className="w-4 h-4" />
        {isDeleting ? "Eliminando..." : "Eliminar"}
      </Button>

      <DeleteConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Habitación"
        description={
          <div className="space-y-2">
            <p>¿Estás seguro de que deseas eliminar esta habitación?</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <p>
                <strong>Número:</strong> #{habitacion.numero}
              </p>
              <p>
                <strong>Tipo:</strong> {habitacion.tipo}
              </p>
              <p>
                <strong>Precio:</strong> ${habitacion.precio}/noche
              </p>
              <p>
                <strong>Capacidad:</strong> {habitacion.capacidad} personas
              </p>
              <p>
                <strong>Estado:</strong> {habitacion.estado}
              </p>
              {habitacion.descripcion && (
                <p>
                  <strong>Descripción:</strong> {habitacion.descripcion}
                </p>
              )}
            </div>
            <p className="text-red-600 font-medium">Esta acción no se puede deshacer.</p>
          </div>
        }
        confirmText="Sí, eliminar"
        isLoading={isDeleting}
      />
    </>
  )
}
