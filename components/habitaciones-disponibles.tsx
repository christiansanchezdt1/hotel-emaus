"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useHabitacionesDisponibles, type Habitacion } from "@/hooks/use-habitaciones-disponibles"
import { Bed, Star, Users, Wifi, Car, Coffee, Utensils, Shield, Clock } from "lucide-react"

const amenidadIcons: Record<string, any> = {
  wifi: Wifi,
  estacionamiento: Car,
  desayuno: Coffee,
  restaurante: Utensils,
  seguridad: Shield,
  recepcion_24h: Clock,
}

interface HabitacionesDisponiblesProps {
  fecha?: string
}

// Función para formatear precios en pesos argentinos
const formatearPrecioARS = (precio: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio)
}

export default function HabitacionesDisponibles({ fecha }: HabitacionesDisponiblesProps) {
  const { data, loading, error } = useHabitacionesDisponibles(fecha)

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <p className="text-lg font-semibold">Error al cargar habitaciones</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Intentar de nuevo
        </Button>
      </div>
    )
  }

  if (!data || data.habitaciones.length === 0) {
    return (
      <div className="text-center py-12">
        <Bed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay habitaciones disponibles</h3>
        <p className="text-gray-500">Para la fecha seleccionada: {data?.fecha || "hoy"}</p>
        <p className="text-sm text-gray-400 mt-2">Intenta con otra fecha o contacta con recepción</p>
      </div>
    )
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "individual":
      case "simple":
        return "from-blue-500 to-cyan-500"
      case "doble":
      case "matrimonial":
        return "from-purple-500 to-pink-500"
      case "suite":
      case "familiar":
        return "from-orange-500 to-red-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getMostPopular = (habitaciones: Habitacion[]) => {
    // Lógica simple: la habitación doble/matrimonial más barata
    const doblesOrdenadas = habitaciones
      .filter((h) => h.tipo.toLowerCase().includes("doble") || h.tipo.toLowerCase().includes("matrimonial"))
      .sort((a, b) => a.precio - b.precio)

    return doblesOrdenadas.length > 0 ? doblesOrdenadas[0].id : null
  }

  const mostPopularId = getMostPopular(data.habitaciones)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
          {data.total} habitaciones disponibles para {new Date(data.fecha).toLocaleDateString("es-ES")}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.habitaciones.map((habitacion) => {
          const isPopular = habitacion.id === mostPopularId
          const tipoColor = getTipoColor(habitacion.tipo)

          return (
            <Card
              key={habitacion.id}
              className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 ${
                isPopular ? "ring-2 ring-purple-500 scale-105" : ""
              }`}
            >
              {isPopular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Más Popular</Badge>
                </div>
              )}

              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                <div className="text-center space-y-2">
                  <Bed className="w-12 h-12 text-gray-500 mx-auto" />
                  <p className="text-gray-500 text-sm">Habitación {habitacion.numero}</p>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/80">
                    #{habitacion.numero}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">{habitacion.tipo}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{habitacion.capacidad} personas</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${tipoColor} bg-clip-text text-transparent`}>
                      {formatearPrecioARS(habitacion.precio)}
                    </div>
                    <div className="text-sm text-gray-500">por noche</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {habitacion.descripcion && (
                  <p className="text-gray-600 text-sm leading-relaxed">{habitacion.descripcion}</p>
                )}

                <div className="space-y-2">
                  {habitacion.amenidades && habitacion.amenidades.length > 0 ? (
                    habitacion.amenidades.map((amenidad, index) => {
                      const IconComponent = amenidadIcons[amenidad] || Bed
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 text-sm capitalize">{amenidad.replace("_", " ")}</span>
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                      <span className="text-gray-600">Amenidades básicas incluidas</span>
                    </div>
                  )}
                </div>

                <Button
                  className={`w-full ${
                    isPopular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      : `bg-gradient-to-r ${tipoColor} hover:opacity-90`
                  } text-white rounded-xl transition-all duration-300`}
                >
                  Reservar Habitación {habitacion.numero}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
