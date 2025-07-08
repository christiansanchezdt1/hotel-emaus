"use client"

import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bed, Edit, Plus, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { DeleteHabitacionButton } from "@/components/delete-habitacion-button"
import { HabitacionesFiltersComponent } from "@/components/habitaciones-filters"
import { Pagination } from "@/components/pagination"
import { useHabitacionesAdmin } from "@/hooks/use-habitaciones-admin"

export default function AdminHabitaciones() {
  const [session, setSession] = useState<any>(null)
  const [sessionLoading, setSessionLoading] = useState(true)

  const { data, loading, error, filters, updateFilters, changePage, refetch } = useHabitacionesAdmin()

  // Verificar sesión
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/check-session")
        if (response.ok) {
          const sessionData = await response.json()
          setSession(sessionData)
        } else {
          redirect("/admin/login")
        }
      } catch (error) {
        redirect("/admin/login")
      } finally {
        setSessionLoading(false)
      }
    }
    checkSession()
  }, [])

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "bg-green-100 text-green-800"
      case "ocupada":
        return "bg-red-100 text-red-800"
      case "mantenimiento":
        return "bg-yellow-100 text-yellow-800"
      case "fuera_servicio":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "individual":
        return "bg-blue-100 text-blue-800"
      case "doble":
        return "bg-purple-100 text-purple-800"
      case "suite familiar":
        return "bg-orange-100 text-orange-800"
      case "suite premium":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calcular estadísticas para los filtros
  const stats = data
    ? {
        total: data.pagination.total,
        disponibles: data.habitaciones.filter((h) => h.estadoReal === "disponible").length,
        ocupadas: data.habitaciones.filter((h) => h.estadoReal === "ocupada").length,
        mantenimiento: data.habitaciones.filter((h) => h.estado === "mantenimiento").length,
        fuera_servicio: data.habitaciones.filter((h) => h.estado === "fuera_servicio").length,
      }
    : undefined

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Habitaciones</h1>
                <p className="text-sm text-gray-600">
                  {data ? `${data.pagination.total} habitaciones registradas` : "Cargando..."}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link href="/admin/habitaciones/nueva">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Habitación
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="mb-6">
          <HabitacionesFiltersComponent filters={filters} onFiltersChange={updateFilters} stats={stats} />
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="outline" size="sm" onClick={refetch} className="ml-4 bg-transparent">
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        ) : !data || data.habitaciones.length === 0 ? (
          <div className="text-center py-12">
            <Bed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filters.estado !== "todas" || filters.tipo !== "todos" || filters.search
                ? "No se encontraron habitaciones"
                : "No hay habitaciones registradas"}
            </h3>
            <p className="text-gray-500 mb-4">
              {filters.estado !== "todas" || filters.tipo !== "todos" || filters.search
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agregando tu primera habitación"}
            </p>
            {filters.estado === "todas" && filters.tipo === "todos" && !filters.search ? (
              <Button asChild>
                <Link href="/admin/habitaciones/nueva">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Habitación
                </Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={() => updateFilters({ estado: "todas", tipo: "todos", search: "" })}>
                Limpiar Filtros
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Grid de habitaciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.habitaciones.map((habitacion) => (
                <Card key={habitacion.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Bed className="w-5 h-5" />
                          <span>Habitación {habitacion.numero}</span>
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className={getTipoColor(habitacion.tipo)}>{habitacion.tipo}</Badge>
                          <Badge className={getEstadoColor(habitacion.estadoReal)}>{habitacion.estadoReal}</Badge>
                          {habitacion.reservasActivas.length > 0 && (
                            <Badge variant="destructive">
                              {habitacion.reservasActivas.length} reserva(s) activa(s)
                            </Badge>
                          )}
                          {habitacion.reservasHistoricas.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {habitacion.reservasHistoricas.length} histórica(s)
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(habitacion.precio)}
                        </div>
                        <div className="text-sm text-gray-500">por noche</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Capacidad:</span>
                        <span className="text-sm font-medium">{habitacion.capacidad} personas</span>
                      </div>
                      {habitacion.descripcion && (
                        <div>
                          <span className="text-sm text-gray-600">Descripción:</span>
                          <p className="text-sm mt-1 line-clamp-2">{habitacion.descripcion}</p>
                        </div>
                      )}
                      {habitacion.amenidades && habitacion.amenidades.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-600">Amenidades:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {habitacion.amenidades.slice(0, 3).map((amenidad, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {amenidad}
                              </Badge>
                            ))}
                            {habitacion.amenidades.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{habitacion.amenidades.length - 3} más
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Mostrar reservas activas si las hay */}
                      {habitacion.reservasActivas.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-red-800">Reservas Activas:</span>
                          </div>
                          {habitacion.reservasActivas.slice(0, 2).map((reserva, index) => (
                            <div key={index} className="text-xs text-red-700">
                              • {reserva.cliente_nombre} ({reserva.estado}) - {reserva.fecha_checkin} a{" "}
                              {reserva.fecha_checkout}
                            </div>
                          ))}
                          {habitacion.reservasActivas.length > 2 && (
                            <div className="text-xs text-red-600 font-medium">
                              +{habitacion.reservasActivas.length - 2} reserva(s) más
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Link href={`/admin/habitaciones/${habitacion.id}/editar`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Link>
                      </Button>
                      <DeleteHabitacionButton habitacion={habitacion} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Paginación */}
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              totalItems={data.pagination.total}
              itemsPerPage={data.pagination.limit}
              onPageChange={changePage}
              onItemsPerPageChange={(limit) => updateFilters({ limit })}
            />
          </>
        )}
      </div>
    </div>
  )
}
