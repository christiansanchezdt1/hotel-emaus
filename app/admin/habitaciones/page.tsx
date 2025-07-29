"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogoutButton } from "@/components/logout-button"
import { AdminQuickLinks } from "@/components/admin-quick-links"
import { DeleteHabitacionButton } from "@/components/delete-habitacion-button"
import { Pagination } from "@/components/pagination"
import { useHabitacionesAdmin } from "@/hooks/use-habitaciones-admin"
import {
  Bed,
  Users,
  DollarSign,
  Edit,
  Plus,
  Search,
  Filter,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Bath,
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
  TrendingUp,
  Calendar,
  User,
  Mail,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const amenidadIcons: Record<string, any> = {
  WiFi: Wifi,
  "WiFi gratuito": Wifi,
  Estacionamiento: Car,
  Desayuno: Coffee,
  TV: Tv,
  "Aire Acondicionado": Wind,
  "Baño Privado": Bath,
  "Baño privado": Bath,
  Calefacción: Wind,
  "Ventilador de techo": Wind,
  "Ropa de cama": Bed,
}

export default function HabitacionesAdminPage() {
  const [filters, setFilters] = useState({
    estado: "all",
    tipo: "all",
    search: "",
    page: 1,
  })

  const { habitaciones, loading, error, pagination, refetch } = useHabitacionesAdmin(filters)

  console.log("Component state:", { habitaciones: habitaciones.length, loading, error })

  // Estadísticas calculadas
  const stats = {
    total: habitaciones.length,
    disponibles: habitaciones.filter((h) => h.estadoReal === "disponible").length,
    ocupadas: habitaciones.filter((h) => h.estadoReal === "ocupada").length,
    mantenimiento: habitaciones.filter((h) => h.estado === "mantenimiento").length,
    precioPromedio:
      habitaciones.length > 0 ? habitaciones.reduce((sum, h) => sum + h.precio, 0) / habitaciones.length : 0,
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset page when filters change
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getEstadoBadge = (habitacion: any) => {
    const estado = habitacion.estadoReal || habitacion.estado

    switch (estado) {
      case "disponible":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disponible
          </Badge>
        )
      case "ocupada":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <Users className="w-3 h-3 mr-1" />
            Ocupada
          </Badge>
        )
      case "mantenimiento":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Mantenimiento
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const getEstadoReservaBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">Pendiente</Badge>
      case "confirmada":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Confirmada</Badge>
      case "checkin":
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Check-in</Badge>
      case "checkout":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">Check-out</Badge>
      case "cancelada":
        return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">Cancelada</Badge>
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {estado}
          </Badge>
        )
    }
  }

  const isReservaActual = (reserva: any) => {
    const hoy = new Date().toISOString().split("T")[0]
    return reserva.fecha_checkin <= hoy && reserva.fecha_checkout >= hoy
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
        <div className="container mx-auto p-6">
          <Alert variant="destructive" className="bg-red-50/80 backdrop-blur-sm border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={refetch} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Gestión de Habitaciones</h1>
            <p className="text-amber-700">Administra las habitaciones del hotel</p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white">
              <Link href="/admin/habitaciones/nueva">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Habitación
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">{stats.disponibles}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ocupadas</p>
                <p className="text-2xl font-bold text-red-600">{stats.ocupadas}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mantenimiento</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.mantenimiento}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Precio Promedio</p>
                <p className="text-lg font-bold text-amber-600">{formatPrice(stats.precioPromedio)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Número, tipo, descripción..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-10 bg-white border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <Select value={filters.estado} onValueChange={(value) => handleFilterChange("estado", value)}>
                  <SelectTrigger className="bg-white border-amber-200 focus:border-amber-400">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="ocupada">Ocupada</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipo</label>
                <Select value={filters.tipo} onValueChange={(value) => handleFilterChange("tipo", value)}>
                  <SelectTrigger className="bg-white border-amber-200 focus:border-amber-400">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="Simple">Simple</SelectItem>
                    <SelectItem value="Doble">Doble</SelectItem>
                    <SelectItem value="Triple">Triple</SelectItem>
                    <SelectItem value="Cuádruple">Cuádruple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => setFilters({ estado: "all", tipo: "all", search: "", page: 1 })}
                  variant="outline"
                  className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Habitaciones */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Habitaciones ({pagination?.total || 0})
            </CardTitle>
            <CardDescription className="text-amber-700">
              Lista de todas las habitaciones del hotel - Mostrando solo reservas desde hoy hacia el futuro
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="border-amber-200">
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-6 w-24 bg-amber-200/50" />
                      <Skeleton className="h-4 w-full bg-amber-200/50" />
                      <Skeleton className="h-4 w-3/4 bg-amber-200/50" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-16 bg-amber-200/50" />
                        <Skeleton className="h-8 w-16 bg-amber-200/50" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : habitaciones.length === 0 ? (
              <div className="text-center py-12">
                <Bed className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron habitaciones</h3>
                <p className="text-gray-600 mb-4">
                  {filters.search || filters.estado !== "all" || filters.tipo !== "all"
                    ? "No hay habitaciones que coincidan con los filtros aplicados."
                    : "Aún no hay habitaciones registradas en el sistema."}
                </p>
                <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white">
                  <Link href="/admin/habitaciones/nueva">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Primera Habitación
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {habitaciones.map((habitacion) => (
                  <Card key={habitacion.id} className="border-amber-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bed className="h-5 w-5 text-amber-600" />
                          <span className="font-semibold text-lg text-gray-900">Habitación {habitacion.numero}</span>
                        </div>
                        {getEstadoBadge(habitacion)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>
                            {habitacion.tipo} - {habitacion.capacidad} personas
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium text-green-600">{formatPrice(habitacion.precio)}/noche</span>
                        </div>

                        {habitacion.descripcion && (
                          <p className="text-sm text-gray-600 line-clamp-2">{habitacion.descripcion}</p>
                        )}

                        {habitacion.amenidades && habitacion.amenidades.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {habitacion.amenidades.slice(0, 3).map((amenidad: string) => {
                              const IconComponent = amenidadIcons[amenidad]
                              return (
                                <Badge key={amenidad} variant="outline" className="text-xs border-amber-200">
                                  {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
                                  {amenidad}
                                </Badge>
                              )
                            })}
                            {habitacion.amenidades.length > 3 && (
                              <Badge variant="outline" className="text-xs border-amber-200">
                                +{habitacion.amenidades.length - 3} más
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Mostrar solo reservas desde hoy hacia el futuro */}
                        {habitacion.todasLasReservas && habitacion.todasLasReservas.length > 0 && (
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-700">
                                    {habitacion.todasLasReservas.length} reserva
                                    {habitacion.todasLasReservas.length !== 1 ? "s" : ""} futura
                                    {habitacion.todasLasReservas.length !== 1 ? "s" : ""}
                                  </span>
                                </div>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-2 mt-2">
                              {habitacion.todasLasReservas.map((reserva) => (
                                <div key={reserva.id} className="bg-gray-50 p-3 rounded-lg border">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <User className="h-3 w-3 text-gray-500" />
                                      <span className="text-sm font-medium text-gray-900">
                                        {reserva.cliente_nombre}
                                      </span>
                                      {isReservaActual(reserva) && (
                                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                          Actual
                                        </Badge>
                                      )}
                                    </div>
                                    {getEstadoReservaBadge(reserva.estado)}
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                      <Mail className="h-3 w-3" />
                                      <span>{reserva.cliente_email}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                      <Calendar className="h-3 w-3" />
                                      <span>
                                        {formatDate(reserva.fecha_checkin)} - {formatDate(reserva.fecha_checkout)}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                      <DollarSign className="h-3 w-3" />
                                      <span className="font-medium text-green-600">{formatPrice(reserva.total)}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button asChild size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                          <Link href={`/admin/habitaciones/${habitacion.id}/editar`}>
                            <Edit className="mr-1 h-3 w-3" />
                            Editar
                          </Link>
                        </Button>

                        <DeleteHabitacionButton
                          habitacionId={habitacion.id}
                          habitacionNumero={habitacion.numero}
                          puedeEliminar={habitacion.puedeEliminar}
                          onSuccess={refetch}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Paginación */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enlaces Rápidos */}
        <AdminQuickLinks currentPage="habitaciones" />
      </div>
    </div>
  )
}
