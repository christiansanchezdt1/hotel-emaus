"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, AlertTriangle } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title: string
  description: string
  itemName: string
  destructiveAction?: string
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  destructiveAction = "eliminar",
}: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleConfirm = async () => {
    setLoading(true)
    setError("")

    try {
      await onConfirm()
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al eliminar")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setError("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">{title}</DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Esta acción no se puede deshacer
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Información detallada */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Información del elemento:</h4>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-white p-3 rounded border">
              {description}
            </pre>
          </div>

          {/* Advertencia principal */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Trash2 className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">¿Estás completamente seguro?</p>
                <p className="text-sm text-red-700 mt-1">
                  Estás a punto de {destructiveAction} permanentemente este elemento. Esta acción eliminará todos los
                  datos asociados y no se puede recuperar.
                </p>
                <div className="mt-2 p-2 bg-red-100 rounded border border-red-200">
                  <p className="text-sm font-medium text-red-800">Elemento a eliminar:</p>
                  <p className="text-sm text-red-700 font-mono">{itemName}</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex space-x-3">
          <Button variant="outline" onClick={handleClose} disabled={loading} className="flex-1 bg-transparent">
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading} className="flex-1">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {destructiveAction.charAt(0).toUpperCase() + destructiveAction.slice(1)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
