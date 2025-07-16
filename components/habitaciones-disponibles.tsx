"use client"

import type React from "react"

import { useState } from "react"
import { useHabitacionesDisponibles } from "@/hooks/use-habitaciones-disponibles"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon, BedIcon, UsersIcon, StarIcon, PhoneIcon } from "lucide-react"

export function HabitacionesDisponibles() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("")
  const { habitaciones, isLoading, error, mensaje, warning, refetch } = useHabitacionesDisponibles(fechaSeleccionada)

  // Calcular fecha mínima (hoy)
  const hoy = new Date()
  const fechaMinima = hoy.toISOString().split("T")[0]

  // Manejar cambio de fecha
  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaSeleccionada(e.target.value)
  }

  // Formatear fecha para mensaje de WhatsApp
  const formatearFechaParaMensaje = (fecha: string) => {
    if (!fecha) return ""
    try {
      return new Date(fecha).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch (error) {
      return fecha
    }
  }

  // Generar mensaje de WhatsApp
  const generarMensajeWhatsApp = (habitacion: any) => {
    const fechaMsg = fechaSeleccionada ? `para el ${formatearFechaParaMensaje(fechaSeleccionada)}` : ""

    return encodeURIComponent(
      `Hola, me interesa reservar la habitación ${habitacion.numero} (${habitacion.tipo}) ${fechaMsg}. ¿Está disponible?`,
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-6">Habitaciones Disponibles</h2>

        {/* Filtro de fecha */}
        <div className="max-w-md mx-auto bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label htmlFor="fecha" className="block text-sm font-medium mb-1 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Consultar disponibilidad para fecha específica
              </label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                min={fechaMinima}
                value={fechaSeleccionada}
                onChange={handleFechaChange}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <Button
              onClick={() => setFechaSeleccionada("")}
              variant="outline"
              className="mt-0"
              disabled={!fechaSeleccionada}
            >
              Limpiar
            </Button>
          </div>
        </div>

        {/* Mensaje informativo */}
        {mensaje && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-blue-800">{mensaje}</p>
          </div>
        )}

        {/* Advertencia */}
        {warning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-yellow-800">{warning}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Sin habitaciones */}
      {!isLoading && habitaciones.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 mb-4">
            <BedIcon className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{mensaje || "No hay habitaciones disponibles"}</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {fechaSeleccionada
              ? "Prueba con otra fecha o contáctanos directamente para verificar disponibilidad."
              : "Por favor, intenta más tarde o contáctanos directamente."}
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={() =>
              window.open(
                `https://wa.me/5493875505939?text=${encodeURIComponent(
                  `Hola, quisiera consultar por disponibilidad de habitaciones${
                    fechaSeleccionada ? ` para el ${formatearFechaParaMensaje(fechaSeleccionada)}` : ""
                  }.`,
                )}`,
                "_blank",
              )
            }
            className="gap-2"
          >
            <PhoneIcon className="h-5 w-5" />
            Consultar por WhatsApp
          </Button>
        </div>
      )}

      {/* Lista de habitaciones */}
      {!isLoading && habitaciones.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {habitaciones.map((habitacion) => (
            <Card key={habitacion.id} className="overflow-hidden flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BedIcon className="h-5 w-5 text-blue-600" />
                      Habitación {habitacion.numero}
                    </CardTitle>
                    <CardDescription>{habitacion.tipo}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50">
                    ${habitacion.precio.toLocaleString("es-AR")}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <UsersIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Capacidad: {habitacion.capacidad} {habitacion.capacidad === 1 ? "persona" : "personas"}
                  </span>
                </div>

                {habitacion.descripcion && <p className="text-gray-600 mb-4 text-sm">{habitacion.descripcion}</p>}

                {habitacion.amenidades && habitacion.amenidades.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {habitacion.amenidades.map((amenidad, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100">
                        {amenidad}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-4 w-4 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                      fill={star <= 4 ? "currentColor" : "none"}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">4.0</span>
                </div>
              </CardContent>

              <CardFooter className="pt-2 mt-auto">
                <Button
                  className="w-full gap-2"
                  onClick={() =>
                    window.open(`https://wa.me/5493875505939?text=${generarMensajeWhatsApp(habitacion)}`, "_blank")
                  }
                >
                  <PhoneIcon className="h-4 w-4" />
                  Reservar por WhatsApp
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
