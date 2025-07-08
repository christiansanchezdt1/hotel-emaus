import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, TestTube, Info, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { DeleteReservaButton } from "@/components/delete-reserva-button"

async function getTestReservas() {
  const { data: reservas, error } = await supabase
    .from("reservas")
    .select(
      `
      *,
      habitaciones (
        numero,
        tipo,
        precio
      )
    `,
    )
    .order("estado", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reservas:", error)
    return []
  }

  return reservas || []
}

export default async function TestDeleteModal() {
  const session = await getAdminSession()

  if (!session) {
    redirect("/admin/login")
  }

  const reservas = await getTestReservas()

  const getEstadoInfo = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: "📅",
          canDelete: true,
          description: "Reserva confirmada - Se puede eliminar",
        }
      case "checkin":
        return {
          color: "bg-green-100 text-green-800",
          icon: "🏨",
          canDelete: true,
          description: "Huésped en el hotel - Se puede eliminar",
        }
      case "checkout":
        return {
          color: "bg-gray-100 text-gray-800",
          icon: "✅",
          canDelete: false,
          description: "Reserva finalizada - NO se puede eliminar",
        }
      case "cancelada":
        return {
          color: "bg-red-100 text-red-800",
          icon: "❌",
          canDelete: true,
          description: "Reserva cancelada - Se puede eliminar",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: "❓",
          canDelete: false,
          description: "Estado desconocido",
        }
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

  // Agrupar reservas por estado para mejor visualización
  const reservasPorEstado = reservas.reduce(
    (acc, reserva) => {
      if (!acc[reserva.estado]) {
        acc[reserva.estado] = []
      }
      acc[reserva.estado].push(reserva)
      return acc
    },
    {} as Record<string, typeof reservas>,
  )

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
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Prueba de Modal de Eliminación</h1>
                  <p className="text-sm text-gray-600">Prueba el modal con diferentes tipos de reservas</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instrucciones */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Instrucciones de Prueba:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>Reservas Eliminables:</strong> Confirmadas, Check-in, Canceladas (botón rojo activo)
              </li>
              <li>
                <strong>Reservas NO Eliminables:</strong> Check-out (botón deshabilitado con tooltip)
              </li>
              <li>
                <strong>Modal de Confirmación:</strong> Aparece al hacer clic en eliminar con información detallada
              </li>
              <li>
                <strong>Seguridad:</strong> Requiere confirmación explícita antes de eliminar
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Estadísticas de Prueba */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">
                {reservas.filter((r) => getEstadoInfo(r.estado).canDelete).length}
              </div>
              <p className="text-sm text-gray-600">Eliminables</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">
                {reservas.filter((r) => !getEstadoInfo(r.estado).canDelete).length}
              </div>
              <p className="text-sm text-gray-600">Protegidas</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{Object.keys(reservasPorEstado).length}</div>
              <p className="text-sm text-gray-600">Estados</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-gray-900">{reservas.length}</div>
              <p className="text-sm text-gray-600">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Reservas por Estado */}
        {Object.entries(reservasPorEstado).map(([estado, reservasEstado]) => {
          const estadoInfo = getEstadoInfo(estado)
          return (
            <div key={estado} className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Badge className={estadoInfo.color}>
                  {estadoInfo.icon} {estado.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">({reservasEstado.length} reservas)</span>
                {estadoInfo.canDelete ? (
                  <CheckCircle className="w-5 h-5 text-green-500" title="Se puede eliminar" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" title="NO se puede eliminar" />
                )}
                <span className="text-sm text-gray-500">{estadoInfo.description}</span>
              </div>

              <div className="grid gap-4">
                {reservasEstado.map((reserva) => (
                  <Card
                    key={reserva.id}
                    className={`hover:shadow-md transition-shadow ${
                      !estadoInfo.canDelete ? "bg-gray-50 border-gray-200" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-lg">{reserva.cliente_nombre}</h3>
                            <Badge className={estadoInfo.color}>
                              {estadoInfo.icon} {reserva.estado}
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Habitación:</p>
                              <p className="font-medium">
                                #{reserva.habitaciones?.numero} - {reserva.habitaciones?.tipo}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Fechas:</p>
                              <p className="font-medium">
                                {formatFecha(reserva.fecha_checkin)} - {formatFecha(reserva.fecha_checkout)}
                              </p>
                              <p className="text-gray-500">
                                {calcularNoches(reserva.fecha_checkin, reserva.fecha_checkout)} noches
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total:</p>
                              <p className="font-bold text-green-600">${reserva.total}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!estadoInfo.canDelete && (
                            <Badge variant="outline" className="text-xs">
                              Protegida
                            </Badge>
                          )}
                          <DeleteReservaButton reserva={reserva} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}

        {reservas.length === 0 && (
          <div className="text-center py-12">
            <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay reservas de prueba</h3>
            <p className="text-gray-500 mb-4">Ejecuta el script de datos de prueba para comenzar</p>
            <Alert className="max-w-md mx-auto">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Ejecuta el script <code>test-reservas-data.sql</code> en tu base de datos para generar datos de prueba.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Información adicional */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Casos de Prueba Incluidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">✅ Casos Eliminables:</h4>
                <ul className="space-y-1 text-yellow-700">
                  <li>• Reserva confirmada futura</li>
                  <li>• Reserva con check-in activo</li>
                  <li>• Reserva cancelada</li>
                  <li>• Reserva con nombre largo</li>
                  <li>• Reserva sin teléfono</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">❌ Casos Protegidos:</h4>
                <ul className="space-y-1 text-yellow-700">
                  <li>• Reserva con check-out reciente</li>
                  <li>• Reserva con check-out antigua</li>
                  <li>• Reservas finalizadas (histórico)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
