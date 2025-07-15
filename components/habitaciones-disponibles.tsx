"use client"

import { useState } from "react"
import { useHabitacionesDisponibles } from "@/hooks/use-habitaciones-disponibles"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  Users,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath,
  Wind,
  Star,
  MapPin,
  Phone,
  Loader2,
  AlertCircle,
  Search,
} from "lucide-react"

export function HabitacionesDisponibles() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("")
  const { habitaciones, loading, error, total, warning, debug } = useHabitacionesDisponibles(fechaSeleccionada)

  const today = new Date().toISOString().split("T")[0]

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const getAmenidadesIconos = (amenidades: string[] | null) => {
    if (!amenidades) return []

    const iconMap: { [key: string]: any } = {
      WiFi: Wifi,
      TV: Tv,
      "Baño privado": Bath,
      "Aire acondicionado": Wind,
      Estacionamiento: Car,
      Desayuno: Coffee,
    }

    return amenidades.map((amenidad) => ({
      nombre: amenidad,
      Icon: iconMap[amenidad] || Star,
    }))
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "simple":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "doble":
        return "bg-green-100 text-green-800 border-green-200"
      case "triple":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "suite":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const esHabitacionPopular = (habitacion: any) => {
    return habitacion.tipo.toLowerCase() === "doble" || habitacion.precio < 15000
  }

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Habitaciones Disponibles
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Descubre nuestras cómodas habitaciones diseñadas para tu descanso y bienestar
          </p>

          {/* Filtro de Fecha */}
          <Card className="max-w-md mx-auto mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                Consultar Disponibilidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fecha" className="text-sm font-medium text-gray-700">
                  Fecha de consulta
                </Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fechaSeleccionada}
                  onChange={(e) => setFechaSeleccionada(e.target.value)}
                  min={today}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setFechaSeleccionada(today)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Consultar Hoy
                </Button>
                {fechaSeleccionada && (
                  <Button variant="outline" onClick={() => setFechaSeleccionada("")} className="border-gray-300">
                    Limpiar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Info (solo en desarrollo) */}
        {process.env.NODE_ENV === "development" && debug && (
          <Card className="mb-8 bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-500">
              <pre>{JSON.stringify(debug, null, 2)}</pre>
            </CardContent>
          </Card>
        )}

        {/* Estados de Loading y Error */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando habitaciones disponibles...</p>
            </div>
          </div>
        )}

        {error && (
          <Card className="mb-8 bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Error al cargar habitaciones</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {warning && (
          <Card className="mb-8 bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Advertencia</h3>
                  <p className="text-yellow-600">{warning}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información de Consulta */}
        {!loading && (
          <div className="text-center mb-8">
            <p className="text-gray-600">
              {fechaSeleccionada ? (
                <>
                  Mostrando <span className="font-semibold text-blue-600">{total}</span> habitaciones disponibles para
                  el{" "}
                  <span className="font-semibold">
                    {new Date(fechaSeleccionada + "T00:00:00").toLocaleDateString("es-AR")}
                  </span>
                </>
              ) : (
                <>
                  Mostrando <span className="font-semibold text-blue-600">{total}</span> habitaciones disponibles
                </>
              )}
            </p>
          </div>
        )}

        {/* Grid de Habitaciones */}
        {!loading && habitaciones.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {habitaciones.map((habitacion) => (
              <Card
                key={habitacion.id}
                className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
              >
                {esHabitacionPopular(habitacion) && (
                  <Badge className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    ⭐ Más Popular
                  </Badge>
                )}

                <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-xl">{habitacion.numero}</span>
                    </div>
                    <p className="text-gray-600 font-medium">Habitación {habitacion.numero}</p>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`${getTipoColor(habitacion.tipo)} border`}>{habitacion.tipo}</Badge>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{habitacion.capacidad} personas</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Habitación {habitacion.tipo}</h3>

                  {habitacion.descripcion && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{habitacion.descripcion}</p>
                  )}

                  {/* Amenidades */}
                  {habitacion.amenidades && habitacion.amenidades.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Incluye:</h4>
                      <div className="flex flex-wrap gap-2">
                        {getAmenidadesIconos(habitacion.amenidades).map((amenidad, index) => (
                          <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                            <amenidad.Icon className="h-3 w-3 text-gray-600" />
                            <span className="text-xs text-gray-600">{amenidad.nombre}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Precio y Botón */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{formatearPrecio(habitacion.precio)}</div>
                      <div className="text-sm text-gray-500">por noche</div>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      onClick={() => window.open("https://wa.me/5493875505939", "_blank")}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Reservar
                    </Button>
                  </div>

                  {/* Calificación */}
                  <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">5.0 (Excelente)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Estado Vacío */}
        {!loading && habitaciones.length === 0 && !error && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {fechaSeleccionada ? "No hay habitaciones disponibles" : "Selecciona una fecha"}
              </h3>
              <p className="text-gray-600 mb-6">
                {fechaSeleccionada
                  ? "No encontramos habitaciones disponibles para la fecha seleccionada. Prueba con otra fecha."
                  : "Selecciona una fecha para ver las habitaciones disponibles."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setFechaSeleccionada("")}
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Ver Todas las Habitaciones
                </Button>
                <Button
                  onClick={() => window.open("https://wa.me/5493875505939", "_blank")}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contactar por WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información Adicional */}
        {!loading && habitaciones.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">¿Necesitas ayuda con tu reserva?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Nuestro equipo está disponible 24/7 para ayudarte a encontrar la habitación perfecta y resolver todas
                  tus dudas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => window.open("https://wa.me/5493875505939", "_blank")}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    WhatsApp: +54 387 550-5939
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.open("mailto:hotelcasadeemaus@gmail.com", "_blank")}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    hotelcasadeemaus@gmail.com
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default HabitacionesDisponibles
