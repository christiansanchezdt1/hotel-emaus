"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogoutButton } from "@/components/logout-button"
import { AdminQuickLinks } from "@/components/admin-quick-links"
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Bed,
  UserCheck,
  UserX,
  CalendarCheck,
  CalendarX,
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  habitaciones: {
    total: number
    disponibles: number
    ocupadas: number
    mantenimiento: number
    precioPromedio: number
    porcentajeOcupacion: number
  }
  reservas: {
    total: number
    confirmadas: number
    checkin: number
    checkout: number
    canceladas: number
    activas: number
  }
  ingresos: {
    mesActual: number
    mesAnterior: number
    año: number
    crecimiento: number
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError("")

      const response = await fetch("/api/admin/dashboard-stats")
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setStats(data.stats)
    } catch (err) {
      console.error("Error fetching dashboard stats:", err)
      setError(err instanceof Error ? err.message : "Error al cargar estadísticas")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 80) return "bg-red-500"
    if (percentage >= 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <div className="h-4 w-4" />
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">Dashboard Administrativo</h1>
              <p className="text-amber-700">Error al cargar las estadísticas</p>
            </div>
            <LogoutButton />
          </div>

          <Alert variant="destructive" className="bg-red-50/80 backdrop-blur-sm border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button onClick={() => fetchStats()} variant="outline" size="sm" className="ml-4 bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
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
            <h1 className="text-3xl font-bold text-amber-900">Dashboard Administrativo</h1>
            <p className="text-amber-700">Resumen general del Hotel Emaús</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => fetchStats(true)}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Actualizando..." : "Actualizar"}
            </Button>
            <LogoutButton />
          </div>
        </div>

        {/* Error Alert */}
        {error && stats && (
          <Alert variant="destructive" className="bg-red-50/80 backdrop-blur-sm border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Estadísticas de Habitaciones */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-amber-900 flex items-center gap-2">
            <Home className="h-6 w-6" />
            Habitaciones
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-white/80 backdrop-blur-sm border-amber-200">
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-24 mb-2 bg-amber-200/50" />
                    <Skeleton className="h-8 w-16 bg-amber-200/50" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Bed className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.habitaciones.total || 0}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Disponibles</p>
                      <p className="text-2xl font-bold text-green-600">{stats?.habitaciones.disponibles || 0}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Users className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ocupadas</p>
                      <p className="text-2xl font-bold text-red-600">{stats?.habitaciones.ocupadas || 0}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mantenimiento</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats?.habitaciones.mantenimiento || 0}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Barra de Ocupación */}
          {!loading && stats && (
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Ocupación Actual</span>
                  <span className="text-sm font-bold text-gray-900">{stats.habitaciones.porcentajeOcupacion}%</span>
                </div>
                <Progress value={stats.habitaciones.porcentajeOcupacion} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{stats.habitaciones.ocupadas} ocupadas</span>
                  <span>{stats.habitaciones.disponibles} disponibles</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Estadísticas de Reservas */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-amber-900 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Reservas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="bg-white/80 backdrop-blur-sm border-amber-200">
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-20 mb-2 bg-amber-200/50" />
                    <Skeleton className="h-8 w-12 bg-amber-200/50" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.reservas.total || 0}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Activas</p>
                      <p className="text-2xl font-bold text-blue-600">{stats?.reservas.activas || 0}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="text-2xl font-bold text-green-600">{stats?.reservas.checkin || 0}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <UserX className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="text-2xl font-bold text-gray-600">{stats?.reservas.checkout || 0}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <CalendarX className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Canceladas</p>
                      <p className="text-2xl font-bold text-red-600">{stats?.reservas.canceladas || 0}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Estadísticas de Ingresos */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-amber-900 flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Ingresos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-white/80 backdrop-blur-sm border-amber-200">
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-24 mb-2 bg-amber-200/50" />
                    <Skeleton className="h-8 w-32 bg-amber-200/50" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Mes Actual</p>
                      <div className="flex items-center gap-1">
                        {getGrowthIcon(stats?.ingresos.crecimiento || 0)}
                        <span
                          className={`text-xs font-medium ${
                            (stats?.ingresos.crecimiento || 0) > 0
                              ? "text-green-600"
                              : (stats?.ingresos.crecimiento || 0) < 0
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          {stats?.ingresos.crecimiento || 0}%
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(stats?.ingresos.mesActual || 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-2">Mes Anterior</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {formatCurrency(stats?.ingresos.mesAnterior || 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-2">Total Año</p>
                    <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats?.ingresos.año || 0)}</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Acciones Rápidas */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Acciones Rápidas</CardTitle>
            <CardDescription className="text-amber-700">
              Accede rápidamente a las funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white h-auto p-4">
                <Link href="/admin/reservas/nueva" className="flex flex-col items-center gap-2">
                  <Plus className="h-6 w-6" />
                  <span>Nueva Reserva</span>
                </Link>
              </Button>

              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white h-auto p-4">
                <Link href="/admin/habitaciones/nueva" className="flex flex-col items-center gap-2">
                  <Home className="h-6 w-6" />
                  <span>Nueva Habitación</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50 h-auto p-4 bg-transparent"
              >
                <Link href="/admin/reservas" className="flex flex-col items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>Ver Reservas</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50 h-auto p-4 bg-transparent"
              >
                <Link href="/admin/habitaciones" className="flex flex-col items-center gap-2">
                  <Bed className="h-6 w-6" />
                  <span>Ver Habitaciones</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enlaces Rápidos */}
        <AdminQuickLinks currentPage="dashboard" />
      </div>
    </div>
  )
}
