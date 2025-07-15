"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Bed, DollarSign, Users, Filter, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useHabitacionesAdmin } from "@/hooks/use-habitaciones-admin"
import { HabitacionesFilters } from "@/components/habitaciones-filters"
import { Pagination } from "@/components/pagination"
import { DeleteHabitacionButton } from "@/components/delete-habitacion-button"

const estadoColors = {
  disponible: "bg-green-100 text-green-800 border-green-200",
  ocupada: "bg-red-100 text-red-800 border-red-200",
  mantenimiento: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

export default function AdminHabitacionesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: "",
    tipo: "",
    estado: "",
    precio_min: "",
    precio_max: "",
  })

  const { habitaciones, loading, error, pagination, refetch } = useHabitacionesAdmin({
    page: currentPage,
    limit: 12,
    ...filters,
  })

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleHabitacionDeleted = () => {
    console.log("Habitación eliminada, refrescando datos...")
    refetch()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
                  Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Habitaciones</h1>
                <p className="text-sm text-gray-600">Administra todas las habitaciones del hotel</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/admin/habitaciones/nueva">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Habitación
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtros de Búsqueda</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HabitacionesFilters filters={filters} onFiltersChange={handleFilterChange} />
          </CardContent>
        </Card>

        {/* Stats */}
        {pagination && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Bed className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Habitaciones</p>
                    <p className="text-2xl font-bold">{pagination.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Resultados</p>
                    <p className="text-2xl font-bold">{habitaciones.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Página Actual</p>
                    <p className="text-2xl font-bold">{pagination.page}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Páginas</p>
                    <p className="text-2xl font-bold">{pagination.totalPages}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Habitaciones Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Habitaciones</span>
              {loading && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Cargando...</span>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              {pagination && `Mostrando ${habitaciones.length} de ${pagination.total} habitaciones`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && habitaciones.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Cargando habitaciones...</p>
              </div>
            ) : habitaciones.length === 0 ? (
              <div className="text-center py-8">
                <Search className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No se encontraron habitaciones</p>
                <p className="text-sm text-gray-400">Intenta ajustar los filtros de búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habitaciones.map((habitacion) => (
                  <Card key={habitacion.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">#{habitacion.numero}</CardTitle>
                        <Badge className={estadoColors[habitacion.estado as keyof typeof estadoColors]}>
                          {habitacion.estado}
                        </Badge>
                      </div>
                      <CardDescription className="text-base font-medium">{habitacion.tipo}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">
                            {formatCurrency(habitacion.precio)}/noche
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>{habitacion.capacidad} personas</span>
                        </div>
                      </div>

                      {habitacion.descripcion && (
                        <p className="text-sm text-gray-600 line-clamp-2">{habitacion.descripcion}</p>
                      )}

                      {habitacion.amenidades && habitacion.amenidades.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {habitacion.amenidades.slice(0, 3).map((amenidad, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenidad}
                            </Badge>
                          ))}
                          {habitacion.amenidades.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{habitacion.amenidades.length - 3} más
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Link href={`/admin/habitaciones/${habitacion.id}`}>Ver Detalles</Link>
                        </Button>
                        <DeleteHabitacionButton habitacion={habitacion} onDeleted={handleHabitacionDeleted} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6">
            <Pagination currentPage={currentPage} totalPages={pagination.totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>
    </div>
  )
}
