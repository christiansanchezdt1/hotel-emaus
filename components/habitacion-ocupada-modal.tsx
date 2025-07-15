"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Calendar, User, Bed, Wifi, Car, Coffee, Tv, Wind, Bath, CheckCircle } from "lucide-react"

interface Reserva {
  id: number
  cliente_nombre: string
  fecha_checkin: string
  fecha_checkout: string
  estado: string
}

interface Habitacion {
  id: number
  numero: string
  tipo: string
  precio: number
  capacidad: number
  amenidades: string[]
  descripcion?: string
}

interface ConflictoData {
  habitacion: Habitacion
  reservas_conflicto: Reserva[]
  fechas_solicitadas: {
    fecha_checkin: string
    fecha_checkout: string
  }
}

interface HabitacionOcupadaModalProps {
  isOpen: boolean
  onClose: () => void
  conflicto: ConflictoData
  alternativas: Habitacion[]
  onSelectAlternativa: (habitacion: Habitacion) => void
}

const amenidadIcons: { [key: string]: any } = {
  WiFi: Wifi,
  Estacionamiento: Car,
  Desayuno: Coffee,
  TV: Tv,
  "Aire Acondicionado": Wind,
  "Baño Privado": Bath,
}

export function HabitacionOcupadaModal({
  isOpen,
  onClose,
  conflicto,
  alternativas,
  onSelectAlternativa,
}: HabitacionOcupadaModalProps) {
  const [seleccionando, setSeleccionando] = useState<number | null>(null)

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleSelectAlternativa = async (habitacion: Habitacion) => {
    setSeleccionando(habitacion.id)
    try {
      await onSelectAlternativa(habitacion)
    } finally {
      setSeleccionando(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <span>Habitación No Disponible</span>
          </DialogTitle>
          <DialogDescription>
            La habitación seleccionada no está disponible en las fechas solicitadas. Te mostramos alternativas similares
            disponibles.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Conflicto */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-800">
                <Bed className="w-5 h-5" />
                <span>Habitación Solicitada</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Habitación #{conflicto.habitacion.numero}</h4>
                  <p className="text-gray-600">{conflicto.habitacion.tipo}</p>
                  <p className="text-green-600 font-semibold">{formatCurrency(conflicto.habitacion.precio)}/noche</p>
                  <p className="text-sm text-gray-500">Capacidad: {conflicto.habitacion.capacidad} personas</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Fechas Solicitadas</h4>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatFecha(conflicto.fechas_solicitadas.fecha_checkin)} -{" "}
                      {formatFecha(conflicto.fechas_solicitadas.fecha_checkout)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reservas en Conflicto */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Reservas Existentes:</h4>
                <div className="space-y-2">
                  {conflicto.reservas_conflicto.map((reserva) => (
                    <div key={reserva.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium">{reserva.cliente_nombre}</p>
                          <p className="text-sm text-gray-500">
                            {formatFecha(reserva.fecha_checkin)} - {formatFecha(reserva.fecha_checkout)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={reserva.estado === "checkin" ? "default" : "secondary"}>{reserva.estado}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alternativas Disponibles */}
          {alternativas.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Habitaciones Alternativas Disponibles ({alternativas.length})
              </h3>
              <div className="grid gap-4">
                {alternativas.map((habitacion) => (
                  <Card key={habitacion.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="text-lg font-semibold">Habitación #{habitacion.numero}</h4>
                            <Badge variant="outline">{habitacion.tipo}</Badge>
                            {habitacion.precio === conflicto.habitacion.precio && (
                              <Badge className="bg-green-100 text-green-800">Mismo precio</Badge>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-2xl font-bold text-green-600 mb-1">
                                {formatCurrency(habitacion.precio)}/noche
                              </p>
                              <p className="text-sm text-gray-600">Capacidad: {habitacion.capacidad} personas</p>
                              {habitacion.descripcion && (
                                <p className="text-sm text-gray-600 mt-2">{habitacion.descripcion}</p>
                              )}
                            </div>

                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Amenidades:</h5>
                              <div className="flex flex-wrap gap-2">
                                {habitacion.amenidades?.map((amenidad) => {
                                  const IconComponent = amenidadIcons[amenidad] || CheckCircle
                                  return (
                                    <div
                                      key={amenidad}
                                      className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded"
                                    >
                                      <IconComponent className="w-3 h-3" />
                                      <span>{amenidad}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="lg:ml-6">
                          <Button
                            onClick={() => handleSelectAlternativa(habitacion)}
                            disabled={seleccionando === habitacion.id}
                            className="w-full lg:w-auto"
                          >
                            {seleccionando === habitacion.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Seleccionando...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Seleccionar Esta
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">No hay alternativas disponibles</h3>
                <p className="text-red-600">
                  No encontramos habitaciones del mismo tipo disponibles para las fechas seleccionadas. Por favor,
                  intenta con fechas diferentes.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Elegir Otras Fechas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
