"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useReservasAdmin } from "@/hooks/use-reservas-admin"
import { ReservasFiltersComponent } from "@/components/reservas-filters"
import { Pagination } from "@/components/pagination"
import { DeleteReservaButton } from "@/components/delete-reserva-button"
import { LogoutButton } from "@/components/logout-button"
import { AdminQuickLinks } from "@/components/admin-quick-links"
import {
  Plus,
  Search,
  Calendar,
  Users,
  DollarSign,
  RefreshCw,
  Edit,
  Phone,
  Mail,
  User,
  CreditCard,
  MapPin,
  Clock,
  FileText,
} from "lucide-react"
import Link from "next/link"

const estadoColors = {
  pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmada: "bg-blue-100 text-blue-800 border-blue-200",
  checkin: "bg-green-100 text-green-800 border-green-200",
  checkout: "bg-gray-100 text-gray-800 border-gray-200",
  cancelada: "bg-red-100 text-red-800 border-red-200",
}

export default function AdminReservasPage() {
  const { data, loading, error, filters, updateFilters, changePage, refetch } = useReservasAdmin()

  const handleReservaDeleted = () => {
    console.log("Reserva eliminada, refrescando datos...")
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 flex items-center justify-center">
        <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full bg-amber-700 hover:bg-amber-800">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const reservas = data?.reservas || []
  const pagination = data?.pagination

  // Calcular estadísticas
  const stats = {
    total: pagination?.total || 0,
    confirmadas: reservas.filter((r) => r.estado === "confirmada").length,
    checkin: reservas.filter((r) => r.estado === "checkin").length,
    ingresos: reservas.filter((r) => r.estado !== "cancelada").reduce((sum, r) => sum + (r.total || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
      {/* Header */}
      <header className="bg-amber-900/95 backdrop-blur-sm shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Gestión de Reservas</h1>
                <p className="text-sm text-amber-100">Administra todas las reservas del hotel</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild className="bg-amber-700 hover:bg-amber-800">
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-amber-700" />
                <div>
                  <p className="text-sm text-amber-800">Total Reservas</p>
                  <p className="text-2xl font-bold text-amber-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-700" />
                <div>
                  <p className="text-sm text-amber-800">Confirmadas</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.confirmadas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-700" />
                <div>
                  <p className="text-sm text-amber-800">Check-in</p>
                  <p className="text-2xl font-bold text-green-600">{stats.checkin}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-amber-700" />
                <div>
                  <p className="text-sm text-amber-800">Ingresos</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.ingresos)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-900">
              <Search className="w-5 h-5" />
              <span>Filtros de Búsqueda</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReservasFiltersComponent filters={filters} onFiltersChange={updateFilters} />
          </CardContent>
        </Card>

        {/* Reservas List */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-amber-900">
              <span>Lista de Reservas</span>
              {loading && (
                <div className="flex items-center space-x-2 text-sm text-amber-700">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Cargando...</span>
                </div>
              )}
            </CardTitle>
            <CardDescription className="text-amber-800">
              {pagination && `Mostrando ${reservas.length} de ${pagination.total} reservas`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && reservas.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
                <p className="text-amber-700">Cargando reservas...</p>
              </div>
            ) : reservas.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 mx-auto mb-4 text-amber-600" />
                <p className="text-amber-700">No se encontraron reservas</p>
                <p className="text-sm text-amber-600">Intenta ajustar los filtros de búsqueda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservas.map((reserva) => (
                  <Card key={reserva.id} className="hover:shadow-lg transition-shadow bg-white/90 border-amber-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-amber-100 p-2 rounded-full">
                            <User className="w-5 h-5 text-amber-700" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-amber-900">{reserva.cliente_nombre}</h3>
                            <p className="text-sm text-amber-700">Reserva #{reserva.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              estadoColors[reserva.estado as keyof typeof estadoColors] || estadoColors.pendiente
                            }
                          >
                            {reserva.estado}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="border-amber-200 hover:bg-amber-50 text-amber-700 bg-transparent"
                            >
                              <Link href={`/admin/reservas/${reserva.id}/editar`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                            <DeleteReservaButton reserva={reserva} onDeleted={handleReservaDeleted} />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-amber-800">
                            <Mail className="w-4 h-4" />
                            <span>{reserva.cliente_email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-amber-800">
                            <Phone className="w-4 h-4" />
                            <span>{reserva.cliente_telefono}</span>
                          </div>
                          {reserva.cliente_documento && (
                            <div className="flex items-center space-x-2 text-amber-800">
                              <CreditCard className="w-4 h-4" />
                              <span>
                                {reserva.tipo_documento}: {reserva.cliente_documento}
                              </span>
                            </div>
                          )}
                          {reserva.nacionalidad && (
                            <div className="flex items-center space-x-2 text-amber-800">
                              <MapPin className="w-4 h-4" />
                              <span>{reserva.nacionalidad}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-amber-800">
                            <Calendar className="w-4 h-4" />
                            <span>Check-in: {formatDate(reserva.fecha_checkin)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-amber-800">
                            <Calendar className="w-4 h-4" />
                            <span>Check-out: {formatDate(reserva.fecha_checkout)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-amber-800">
                            <Clock className="w-4 h-4" />
                            <span>Creada: {formatDateTime(reserva.created_at)}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-amber-800">
                            <Users className="w-4 h-4" />
                            <span>
                              Habitación: {reserva.habitaciones?.numero} ({reserva.habitaciones?.tipo})
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-green-600 font-semibold">
                            <DollarSign className="w-4 h-4" />
                            <span>Total: {formatCurrency(reserva.total)}</span>
                          </div>
                          {reserva.notas && (
                            <div className="flex items-start space-x-2 text-amber-800">
                              <FileText className="w-4 h-4 mt-0.5" />
                              <span className="text-xs">{reserva.notas}</span>
                            </div>
                          )}
                        </div>
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
            <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={changePage} />
          </div>
        )}

        {/* Enlaces Rápidos */}
        <AdminQuickLinks currentPage="reservas" />
      </div>
    </div>
  )
}
