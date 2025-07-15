"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useReservasAdmin } from "@/hooks/use-reservas-admin"
import { ReservasFilters } from "@/components/reservas-filters"
import { Pagination } from "@/components/pagination"
import { DeleteReservaButton } from "@/components/delete-reserva-button"
import { LogoutButton } from "@/components/logout-button"
import {
  Plus,
  Search,
  Calendar,
  User,
  Bed,
  DollarSign,
  AlertCircle,
  RefreshCw,
  FileText,
  Phone,
  Mail,
} from "lucide-react"
import Link from "next/link"

interface Reserva {
  id: number
  cliente_nombre: string
  cliente_email: string | null
  cliente_telefono: string | null
  cliente_documento: string | null
  tipo_documento: string | null
  habitacion_id: number
  habitacion_numero: string
  habitacion_tipo: string
  fecha_checkin: string
  fecha_checkout: string
  precio_total: number
  estado: string
  notas: string | null
  created_at: string
}

interface ReservasData {
  reservas: Reserva[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function AdminReservasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    estado: "",
    fecha_desde: "",
    fecha_hasta: "",
    habitacion_tipo: "",
  })
  const [currentPage, setCurrentPage] = useState(1)

  const { data, loading, error, refetch } = useReservasAdmin({
    page: currentPage,
    search: searchTerm,
    ...filters,
  })

  // Asegurar que data tenga valores por defecto
  const reservas = data?.reservas || []
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    refetch()
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      pendiente: "secondary",
      confirmada: "default",
      checkin: "success",
      checkout: "outline",
      cancelada: "destructive",
    } as const

    return (
      <Badge variant={variants[estado as keyof typeof variants] || "secondary"}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR")
  }

  // Calcular estadísticas
  const stats = {
    total: reservas.length,
    confirmadas: reservas.filter((r) => r.estado === "confirmada").length,
    checkin: reservas.filter((r) => r.estado === "checkin").length,
    pendientes: reservas.filter((r) => r.estado === "pendiente").length,
    ingresoTotal: reservas.filter((r) => r.estado !== "cancelada").reduce((sum, r) => sum + r.precio_total, 0),
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Error al cargar reservas: {error}</span>
            <Button variant="outline" size="sm" onClick={refetch} className="ml-4 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Reservas</h1>
          <p className="text-muted-foreground">Administra todas las reservas del hostel</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/reservas/nueva">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Reserva
            </Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-in</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.checkin}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPrice(stats.ingresoTotal)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre, email, teléfono o documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </form>

            <ReservasFilters filters={filters} onFiltersChange={handleFilterChange} />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas ({pagination.total})</CardTitle>
          <CardDescription>
            Mostrando {reservas.length} de {pagination.total} reservas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reservas.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron reservas</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || Object.values(filters).some(Boolean)
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Aún no hay reservas registradas"}
              </p>
              <Button asChild>
                <Link href="/admin/reservas/nueva">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Reserva
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reservas.map((reserva) => (
                <div
                  key={reserva.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {reserva.cliente_nombre}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {reserva.cliente_email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {reserva.cliente_email}
                            </span>
                          )}
                          {reserva.cliente_telefono && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {reserva.cliente_telefono}
                            </span>
                          )}
                          {reserva.cliente_documento && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {reserva.tipo_documento}: {reserva.cliente_documento}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        Habitación {reserva.habitacion_numero} ({reserva.habitacion_tipo})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(reserva.fecha_checkin)} - {formatDate(reserva.fecha_checkout)}
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        {formatPrice(reserva.precio_total)}
                      </span>
                    </div>

                    {reserva.notas && (
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        <strong>Notas:</strong> {reserva.notas}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getEstadoBadge(reserva.estado)}
                    <DeleteReservaButton reservaId={reserva.id} onSuccess={refetch} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}
