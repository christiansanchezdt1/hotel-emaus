"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { useDeleteReserva } from "@/hooks/use-delete-reserva"

interface Reserva {
  id: number
  cliente_nombre: string
  cliente_documento: string
  tipo_documento: string
  fecha_checkin: string
  fecha_checkout: string
  estado: string
  total: number
  habitaciones?: {
    numero: string
    tipo: string
  }
}

interface DeleteReservaButtonProps {
  reserva: Reserva
  onDeleted?: () => void
}

export function DeleteReservaButton({ reserva, onDeleted }: DeleteReservaButtonProps) {
  const [showModal, setShowModal] = useState(false)

  const { deleteReserva, isDeleting } = useDeleteReserva({
    onSuccess: () => {
      console.log("Reserva eliminada, ejecutando callback...")
      if (onDeleted) {
        onDeleted()
      }
    },
  })

  const handleDelete = async () => {
    const result = await deleteReserva(reserva.id)

    if (result.success) {
      setShowModal(false)
    }
  }

  // No permitir eliminar reservas con checkout
  const canDelete = reserva.estado !== "checkout"
  const tooltipText = !canDelete ? "No se puede eliminar una reserva con checkout completado" : "Eliminar reserva"

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
        title="Eliminar Reserva"
        description={
          <div className="space-y-2">
            <p>¿Estás seguro de que deseas eliminar esta reserva?</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <p>
                <strong>Cliente:</strong> {reserva.cliente_nombre}
              </p>
              <p>
                <strong>Documento:</strong> {reserva.tipo_documento} {reserva.cliente_documento}
              </p>
              <p>
                <strong>Habitación:</strong> #{reserva.habitaciones?.numero} - {reserva.habitaciones?.tipo}
              </p>
              <p>
                <strong>Fechas:</strong> {new Date(reserva.fecha_checkin).toLocaleDateString()} -{" "}
                {new Date(reserva.fecha_checkout).toLocaleDateString()}
              </p>
              <p>
                <strong>Estado:</strong> {reserva.estado}
              </p>
              <p>
                <strong>Total:</strong> ${reserva.total}
              </p>
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
