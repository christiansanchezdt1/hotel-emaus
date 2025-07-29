"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { useDeleteHabitacion } from "@/hooks/use-delete-habitacion"

interface DeleteHabitacionButtonProps {
  habitacionId: number
  habitacionNumero: string
  puedeEliminar?: boolean
  onSuccess?: () => void
}

export function DeleteHabitacionButton({
  habitacionId,
  habitacionNumero,
  puedeEliminar = true,
  onSuccess,
}: DeleteHabitacionButtonProps) {
  const [showModal, setShowModal] = useState(false)

  const { deleteHabitacion, isDeleting, error } = useDeleteHabitacion({
    onSuccess: () => {
      setShowModal(false)
      if (onSuccess) {
        onSuccess()
      }
    },
  })

  const handleDelete = async () => {
    await deleteHabitacion(habitacionId)
  }

  const tooltipText = !puedeEliminar
    ? "No se puede eliminar una habitación con reservas activas"
    : "Eliminar habitación"

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowModal(true)}
        disabled={!puedeEliminar || isDeleting}
        title={tooltipText}
        className={!puedeEliminar ? "opacity-50 cursor-not-allowed" : ""}
      >
        <Trash2 className="w-3 h-3 mr-1" />
        {isDeleting ? "Eliminando..." : "Eliminar"}
      </Button>

      <DeleteConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Habitación"
        description={
          <div className="space-y-3">
            <p>¿Estás seguro de que deseas eliminar esta habitación?</p>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <p className="font-medium text-amber-900">Habitación #{habitacionNumero}</p>
              <p className="text-sm text-amber-700 mt-1">
                Esta acción no se puede deshacer y eliminará permanentemente la habitación del sistema.
              </p>
            </div>
            {error && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <p className="text-red-600 font-medium text-sm">⚠️ Esta acción es irreversible</p>
          </div>
        }
        confirmText="Sí, eliminar habitación"
        isLoading={isDeleting}
      />
    </>
  )
}
