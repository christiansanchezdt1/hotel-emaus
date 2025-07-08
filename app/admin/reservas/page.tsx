"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Edit, Plus, ArrowLeft, Phone, Mail, Bed, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { DeleteReservaButton } from "@/components/delete-reserva-button"
import { ReservasFiltersComponent } from "@/components/reservas-filters"
import { Pagination } from "@/components/pagination"
import { useReservasAdmin } from "@/hooks/use-reservas-admin"

export default function AdminReservas() {
  const [session, setSession] = useState<any>(null)
  const [sessionLoading, setSessionLoading] = useState(true)

  const { data, loading, error, filters, updateFilters, changePage, refetch } = useReservasAdmin()

  // Verificar sesión
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/check-session")
        if (response.ok) {
          const sessionData = await response.json()
          setSession(sessionData)
        } else {
          window.location.href = "/admin/login"
        }
      } catch (error) {
        window.location.href = "/admin/login"
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
      case "confirmada":
        return "bg-blue-100 text-blue-800"
      case "checkin":
        return "bg-green-100 text-green-800"
      case "checkout":
        return "bg-gray-100 text-gray-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "📅"
      case "checkin":
        return "🏨"
      case "checkout":
        return "✅"
      case "cancelada":
        return "❌"
      default:
        return "❓"
    }
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const calcularNoches = (checkin: string, checkout: string) => {
    const inicio = new Date(checkin)
    const fin = new Date(checkout)
    const diferencia = fin.getTime() - inicio.getTime()
    return Math.ceil(diferencia / (1000 * 3600 * 24))
  }

  // Calcular estadísticas para los filtros
  const stats = data
    ? {
        total: data.pagination.total,
        confirmadas: data.reservas.filter((r) => r.estado === "confirmada").length,
        checkin: data.reservas.filter((r) => r.estado === "checkin").length,
        checkout: data.reservas.filter((r) => r.estado === "checkout").length,
        canceladas: data.reservas.filter((r) => r.estado === "cancelada").length,
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
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Reservas</h1>
                <p className="text-sm text-gray-600">
                  {data ? `${data.pagination.total} reservas registradas` : "Cargando..."}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link href="/admin/reservas/nueva">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Reserva
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
          <ReservasFiltersComponent filters={filters} onFiltersChange={updateFilters} stats={stats} />
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-4 w-16 mt-1" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-20" />
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
        ) : !data || data.reservas.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filters.estado !== "todas" || filters.tipo !== "todos" || filters.fecha !== "" || filters.search !== ""
                ? "No se encontraron reservas"
                : "No hay reservas registradas"}
            </h3>
            <p className="text-gray-500 mb-4">
              {filters.estado !== "todas" || filters.tipo !== "todos" || filters.fecha !== "" || filters.search !== ""
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza creando tu primera reserva"}
            </p>
            {filters.estado === "todas" && filters.tipo === "todos" && filters.fecha === "" && filters.search === "" ? (
              <Button asChild>
                <Link href="/admin/reservas/nueva">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Reserva
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => updateFilters({ estado: "todas", tipo: "todos", fecha: "", search: "" })}
              >
                Limpiar Filtros
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Lista de Reservas */}
            <div className="space-y-6 mb-8">
              {data.reservas.map((reserva) => (
                <Card key={reserva.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-xl">{reserva.cliente_nombre}</CardTitle>
                          <Badge className={getEstadoColor(reserva.estado)}>
                            {getEstadoIcon(reserva.estado)} {reserva.estado}
                          </Badge>
                          {reserva.estado === "checkout" && (
                            <Badge variant="outline" className="text-xs">
                              No se puede eliminar
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{reserva.cliente_email}</span>
                          </div>
                          {reserva.cliente_telefono && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{reserva.cliente_telefono}</span>
                            </div>
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
                          }).format(reserva.total)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {calcularNoches(reserva.fecha_checkin, reserva.fecha_checkout)} noches
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Habitación */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                          <Bed className="w-4 h-4" />
                          <span>Habitación</span>
                        </h4>
                        <div className="text-sm">
                          <p className="font-medium">#{reserva.habitaciones?.numero}</p>
                          <p className="text-gray-600">{reserva.habitaciones?.tipo}</p>
                          <p className="text-gray-600">
                            {new Intl.NumberFormat("es-AR", {
                              style: "currency",
                              currency: "ARS",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(reserva.habitaciones?.precio || 0)}
                            /noche
                          </p>
                        </div>
                      </div>

                      {/* Fechas */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Fechas</span>
                        </h4>
                        <div className="text-sm">
                          <p>
                            <strong>Check-in:</strong> {formatFecha(reserva.fecha_checkin)}
                          </p>
                          <p>
                            <strong>Check-out:</strong> {formatFecha(reserva.fecha_checkout)}
                          </p>
                          <p className="text-gray-600">
                            {calcularNoches(reserva.fecha_checkin, reserva.fecha_checkout)} noches
                          </p>
                        </div>
                      </div>

                      {/* Información adicional */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Detalles</h4>
                        <div className="text-sm">
                          <p>
                            <strong>ID:</strong> #{reserva.id}
                          </p>
                          <p>
                            <strong>Creada:</strong> {formatFecha(reserva.created_at)}
                          </p>
                          <p className="text-gray-600">Estado: {reserva.estado}</p>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex space-x-2 pt-4 border-t">
                      <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Link href={`/admin/reservas/${reserva.id}/editar`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Link>
                      </Button>
                      <DeleteReservaButton reserva={reserva} />
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
