import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Bed, Users, Calendar, DollarSign, Plus, Settings, TestTube } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import Link from "next/link"

async function getStats() {
  const [habitacionesResult, reservasResult, reservasHoyResult] = await Promise.all([
    supabase.from("habitaciones").select("*"),
    supabase.from("reservas").select("*"),
    supabase
      .from("reservas")
      .select("*")
      .lte("fecha_checkin", new Date().toISOString().split("T")[0])
      .gte("fecha_checkout", new Date().toISOString().split("T")[0])
      .in("estado", ["confirmada", "checkin"]),
  ])

  const habitaciones = habitacionesResult.data || []
  const reservas = reservasResult.data || []
  const reservasHoy = reservasHoyResult.data || []

  const habitacionesDisponibles = habitaciones.filter((h) => h.estado === "disponible").length
  const habitacionesOcupadas = reservasHoy.length
  const ingresosMes = reservas
    .filter((r) => {
      const fecha = new Date(r.created_at)
      const ahora = new Date()
      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
    })
    .reduce((sum, r) => sum + r.total, 0)

  return {
    totalHabitaciones: habitaciones.length,
    habitacionesDisponibles,
    habitacionesOcupadas,
    totalReservas: reservas.length,
    reservasHoy: reservasHoy.length,
    ingresosMes,
  }
}

export default async function AdminDashboard() {
  const session = await getAdminSession()

  if (!session) {
    redirect("/admin/login")
  }

  const stats = await getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Bed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hotel Emaús</h1>
                <p className="text-sm text-gray-600">Panel de Administración</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bienvenido, {session.username}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Habitaciones</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHabitaciones}</div>
              <p className="text-xs text-muted-foreground">{stats.habitacionesDisponibles} disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupadas Hoy</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.habitacionesOcupadas}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.habitacionesOcupadas / stats.totalHabitaciones) * 100).toFixed(1)}% ocupación
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas Total</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReservas}</div>
              <p className="text-xs text-muted-foreground">{stats.reservasHoy} para hoy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.ingresosMes.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Habitaciones</CardTitle>
              <CardDescription>Administra las habitaciones del hotel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Habitaciones disponibles</span>
                <Badge variant="secondary">{stats.habitacionesDisponibles}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Habitaciones ocupadas</span>
                <Badge variant="destructive">{stats.habitacionesOcupadas}</Badge>
              </div>
              <div className="flex space-x-2">
                <Button asChild className="flex-1">
                  <Link href="/admin/habitaciones">
                    <Settings className="w-4 h-4 mr-2" />
                    Gestionar
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/habitaciones/nueva">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestión de Reservas</CardTitle>
              <CardDescription>Administra las reservas de los huéspedes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Reservas activas</span>
                <Badge variant="secondary">{stats.reservasHoy}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Total reservas</span>
                <Badge variant="outline">{stats.totalReservas}</Badge>
              </div>
              <div className="flex space-x-2">
                <Button asChild className="flex-1">
                  <Link href="/admin/reservas">
                    <Calendar className="w-4 h-4 mr-2" />
                    Gestionar
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/reservas/nueva">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enlaces rápidos */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Enlaces Rápidos</CardTitle>
            <CardDescription>Accesos directos a funciones importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                <Link href="/">
                  <Bed className="w-6 h-6" />
                  <span className="text-sm">Ver Sitio Web</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                <Link href="/admin/habitaciones">
                  <Settings className="w-6 h-6" />
                  <span className="text-sm">Habitaciones</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                <Link href="/admin/reservas">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Reservas</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                <Link href="/admin/test">
                  <DollarSign className="w-6 h-6" />
                  <span className="text-sm">Diagnóstico</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                <Link href="/admin/test-delete">
                  <TestTube className="w-6 h-6" />
                  <span className="text-sm">Prueba Modal</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
