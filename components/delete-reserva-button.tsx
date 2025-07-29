"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Loader2, AlertTriangle, User, Calendar, Bed } from "lucide-react"

interface DeleteReservaButtonProps {
  reserva?: {
    id: number
    cliente_nombre?: string
    fecha_checkin?: string
    fecha_checkout?: string
    estado?: string
    habitaciones?: {
      numero: string
      tipo: string
    }
  }
  reservaId?: number
  onSuccess?: () => void
  onDeleted?: () => void
}

export function DeleteReservaButton({ reserva, reservaId, onSuccess, onDeleted }: DeleteReservaButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const id = reserva?.id || reservaId
  if (!id) {
    console.error("DeleteReservaButton: No se proporcionó ID de reserva")
    return null
  }

  // No permitir eliminar reservas con checkout
  const canDelete = !reserva?.estado || reserva.estado !== "checkout"
  const tooltipText = !canDelete ? "No se puede eliminar una reserva con checkout completado" : "Eliminar reserva"

  const handleDelete = async () => {
    if (!id) return

    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/reservas/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      // Cerrar modal y ejecutar callbacks
      setIsOpen(false)
      onSuccess?.()
      onDeleted?.()
    } catch (err) {
      console.error("Error eliminando reserva:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!canDelete}
          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
          title={tooltipText}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {reserva && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-gray-900">Detalles de la reserva:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {reserva.cliente_nombre && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{reserva.cliente_nombre}</span>
                  </div>
                )}
                {reserva.fecha_checkin && reserva.fecha_checkout && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(reserva.fecha_checkin).toLocaleDateString("es-AR")} -{" "}
                      {new Date(reserva.fecha_checkout).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                )}
                {reserva.habitaciones && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4" />
                    <span>
                      Habitación {reserva.habitaciones.numero} ({reserva.habitaciones.tipo})
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
