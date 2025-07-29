"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wifi, Car, Coffee, Shield, Users, MessageCircle, RefreshCw, AlertCircle, MapPin } from "lucide-react"
import Image from "next/image"
import { useHabitacionesDisponibles } from "@/hooks/use-habitaciones-disponibles"
import HabitacionesFiltros from "@/components/habitaciones-filters"

const amenidadesIcons: Record<string, any> = {
  "WiFi gratuito": Wifi,
  "Baño privado": Shield,
  "Ventilador de techo": Car,
  Calefacción: Coffee,
  "Ropa de cama": Shield,
  wifi: Wifi,
  baño: Shield,
  ventilador: Car,
  calefacción: Coffee,
  ropa: Shield,
}

const tipoColors: Record<string, string> = {
  simple: "bg-blue-100 text-blue-800",
  doble: "bg-green-100 text-green-800",
  triple: "bg-purple-100 text-purple-800",
  suite: "bg-amber-100 text-amber-800",
}

export default function HabitacionesDisponibles() {
  const [filtros, setFiltros] = useState({})
  const { habitaciones, loading, error, refetch, total } = useHabitacionesDisponibles({
    autoFetch: true,
  })

  const handleFiltrosChange = (nuevosFiltros: any) => {
    console.log("🔄 Actualizando filtros:", nuevosFiltros)
    setFiltros(nuevosFiltros)
    refetch(nuevosFiltros)
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const generarMensajeWhatsApp = (habitacion: any) => {
    const mensaje = `Hola! Me interesa la habitación ${habitacion.numero} (${habitacion.tipo}) por ${formatearPrecio(habitacion.precio)} por noche. ¿Está disponible?`
    return `https://wa.me/5493814123456?text=${encodeURIComponent(mensaje)}`
  }

  const getIconForAmenidad = (amenidad: string) => {
    const amenidadLower = amenidad.toLowerCase()
    for (const [key, icon] of Object.entries(amenidadesIcons)) {
      if (amenidadLower.includes(key.toLowerCase())) {
        return icon
      }
    }
    return Shield // Icono por defecto
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-6">
        <HabitacionesFiltros onFiltrosChange={handleFiltrosChange} />

        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-4 bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Habitaciones Disponibles</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Encuentra la habitación perfecta para tu estadía. Todas nuestras habitaciones incluyen amenidades de calidad y
          un servicio excepcional.
        </p>
      </div>

      {/* Filtros */}
      <HabitacionesFiltros onFiltrosChange={handleFiltrosChange} loading={loading} />

      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          {loading ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            `${total} habitación${total !== 1 ? "es" : ""} disponible${total !== 1 ? "s" : ""}`
          )}
        </div>

        {!loading && total > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch(filtros)}
            className="text-amber-600 hover:text-amber-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && habitaciones.length === 0 && (
        <Card className="p-12 text-center bg-gray-50">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No hay habitaciones disponibles</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No encontramos habitaciones que coincidan con sus criterios de búsqueda. Intente modificar las fechas o
              los filtros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => handleFiltrosChange({})}
                className="border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                Ver todas las habitaciones
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    "https://wa.me/5493814123456?text=" +
                      encodeURIComponent("Hola! Me gustaría consultar sobre disponibilidad de habitaciones."),
                    "_blank",
                  )
                }
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Consultar por WhatsApp
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de habitaciones */}
      {!loading && habitaciones.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habitaciones.map((habitacion) => (
            <Card
              key={habitacion.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={habitacion.imagen_url || "/placeholder.svg"}
                  alt={`Habitación ${habitacion.numero}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`${tipoColors[habitacion.tipo.toLowerCase()] || "bg-gray-100 text-gray-800"}`}>
                    {habitacion.tipo.charAt(0).toUpperCase() + habitacion.tipo.slice(1)}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    <Users className="w-3 h-3 mr-1" />
                    {habitacion.capacidad}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800 font-semibold">
                    #{habitacion.numero}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Habitación {habitacion.tipo.charAt(0).toUpperCase() + habitacion.tipo.slice(1)}
                    </h3>
                    {habitacion.descripcion && (
                      <p className="text-gray-600 text-sm line-clamp-2">{habitacion.descripcion}</p>
                    )}
                  </div>

                  {/* Amenidades */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Amenidades incluidas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {habitacion.amenidades.slice(0, 4).map((amenidad, index) => {
                        const IconComponent = getIconForAmenidad(amenidad)
                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                          >
                            <IconComponent className="w-3 h-3" />
                            <span>{amenidad}</span>
                          </div>
                        )
                      })}
                      {habitacion.amenidades.length > 4 && (
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          +{habitacion.amenidades.length - 4} más
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Precio y botón */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-2xl font-bold text-amber-600">{formatearPrecio(habitacion.precio)}</div>
                      <div className="text-sm text-gray-500">por noche</div>
                    </div>

                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                      onClick={() => window.open(generarMensajeWhatsApp(habitacion), "_blank")}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Reservar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
