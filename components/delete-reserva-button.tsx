"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { useDeleteReserva } from "@/hooks/use-delete-reserva"

interface DeleteReservaButtonProps {
  reserva: {
    id: number
    cliente_nombre: string
    cliente_email: string
    habitaciones: {
      numero: string
      tipo: string
    }
    fecha_checkin: string
    fecha_checkout: string
    estado: string
    total: number
  }
  size?: "default" | "sm" | "lg"
  variant?: "default" | "destructive" | "outline"
}

export function DeleteReservaButton({ reserva, size = "sm", variant = "destructive" }: DeleteReservaButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const { deleteReserva } = useDeleteReserva()

  const handleDelete = async () => {
    await deleteReserva(reserva.id)
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const calcularNoches = () => {
    const checkin = new Date(reserva.fecha_checkin)
    const checkout = new Date(reserva.fecha_checkout)
    const noches = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24))
    return noches > 0 ? noches : 0
  }

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "Confirmada"
      case "checkin":
        return "Check-in realizado"
      case "checkout":
        return "Check-out realizado"
      case "cancelada":
        return "Cancelada"
      default:
        return estado
    }
  }

  const canDelete = reserva.estado !== "checkout"
  const deleteReason = reserva.estado === "checkout" ? "No se pueden eliminar reservas ya finalizadas" : ""

  // Crear descripción detallada para el modal
  const modalDescription = `Esta acción eliminará permanentemente la reserva del sistema. 
    
Detalles de la reserva:
• Cliente: ${reserva.cliente_nombre}
• Email: ${reserva.cliente_email}
• Habitación: #${reserva.habitaciones?.numero} (${reserva.habitaciones?.tipo})
• Fechas: ${formatFecha(reserva.fecha_checkin)} - ${formatFecha(reserva.fecha_checkout)}
• Duración: ${calcularNoches()} noches
• Total: $${reserva.total}
• Estado: ${getEstadoText(reserva.estado)}`

  const itemName = `${reserva.cliente_nombre} - Habitación #${reserva.habitaciones?.numero}`

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
        title="Eliminar Reserva"
        description={modalDescription}
        itemName={itemName}
        destructiveAction="eliminar"
      />
    </>
  )
}
