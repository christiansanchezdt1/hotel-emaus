import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Users, Bed, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"

async function testDatabase() {
  const results = {
    connection: false,
    tables: {
      admin_users: { exists: false, count: 0, error: null },
      habitaciones: { exists: false, count: 0, error: null },
      reservas: { exists: false, count: 0, error: null },
    },
    sampleData: {
      admin: null,
      habitaciones: [],
      reservas: [],
    },
    errors: [],
  }

  try {
    // Test 1: Verificar tabla admin_users
    try {
      const {
        data: adminUsers,
        error: adminError,
        count: adminCount,
      } = await supabase.from("admin_users").select("*", { count: "exact" })

      if (adminError) {
        results.tables.admin_users.error = adminError.message
        results.errors.push(`admin_users: ${adminError.message}`)
      } else {
        results.tables.admin_users.exists = true
        results.tables.admin_users.count = adminCount || 0
        results.sampleData.admin = adminUsers?.[0] || null
      }
    } catch (error) {
      results.tables.admin_users.error = error instanceof Error ? error.message : "Error desconocido"
      results.errors.push(`admin_users: ${results.tables.admin_users.error}`)
    }

    // Test 2: Verificar tabla habitaciones
    try {
      const {
        data: habitaciones,
        error: habitacionesError,
        count: habitacionesCount,
      } = await supabase.from("habitaciones").select("*", { count: "exact" }).limit(3)

      if (habitacionesError) {
        results.tables.habitaciones.error = habitacionesError.message
        results.errors.push(`habitaciones: ${habitacionesError.message}`)
      } else {
        results.tables.habitaciones.exists = true
        results.tables.habitaciones.count = habitacionesCount || 0
        results.sampleData.habitaciones = habitaciones || []
      }
    } catch (error) {
      results.tables.habitaciones.error = error instanceof Error ? error.message : "Error desconocido"
      results.errors.push(`habitaciones: ${results.tables.habitaciones.error}`)
    }

    // Test 3: Verificar tabla reservas
    try {
      const {
        data: reservas,
        error: reservasError,
        count: reservasCount,
      } = await supabase.from("reservas").select("*", { count: "exact" }).limit(3)

      if (reservasError) {
        results.tables.reservas.error = reservasError.message
        results.errors.push(`reservas: ${reservasError.message}`)
      } else {
        results.tables.reservas.exists = true
        results.tables.reservas.count = reservasCount || 0
        results.sampleData.reservas = reservas || []
      }
    } catch (error) {
      results.tables.reservas.error = error instanceof Error ? error.message : "Error desconocido"
      results.errors.push(`reservas: ${results.tables.reservas.error}`)
    }

    // Si al menos una tabla existe, la conexión funciona
    results.connection = Object.values(results.tables).some((table) => table.exists)
  } catch (error) {
    results.errors.push(`Conexión general: ${error instanceof Error ? error.message : "Error desconocido"}`)
  }

  return results
}

export default async function AdminTest() {
  const testResults = await testDatabase()
  const allTablesExist = Object.values(testResults.tables).every((table) => table.exists)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnóstico de Base de Datos</h1>
          <p className="text-gray-600">Hotel Emaús - Estado del Sistema</p>
        </div>

        {/* Status General */}
        <Card className={`border-2 ${allTablesExist ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {allTablesExist ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-500" />
              )}
              <span>Estado General del Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allTablesExist ? (
              <div className="space-y-2">
                <p className="text-green-700 font-medium">✅ Sistema configurado correctamente</p>
                <div className="flex space-x-2">
                  <Button asChild>
                    <Link href="/admin/login">Ir al Login</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/dashboard">Dashboard</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-700 font-medium">❌ Sistema requiere configuración</p>
                <p className="text-sm text-red-600">
                  Ejecuta el script <code>complete-setup.sql</code> en tu base de datos Supabase
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estado de las Tablas */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Admin Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Usuarios Admin</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {testResults.tables.admin_users.exists ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <Badge className="bg-green-100 text-green-800">Tabla existe</Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <Badge className="bg-red-100 text-red-800">Tabla no existe</Badge>
                    </>
                  )}
                </div>

                {testResults.tables.admin_users.exists && (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Usuarios:</strong> {testResults.tables.admin_users.count}
                    </p>
                    {testResults.sampleData.admin && (
                      <div className="p-2 bg-gray-50 rounded text-xs">
                        <p>
                          <strong>Usuario:</strong> {testResults.sampleData.admin.username}
                        </p>
                        <p>
                          <strong>Email:</strong> {testResults.sampleData.admin.email}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {testResults.tables.admin_users.error && (
                  <p className="text-xs text-red-600">{testResults.tables.admin_users.error}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Habitaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bed className="w-5 h-5" />
                <span>Habitaciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {testResults.tables.habitaciones.exists ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <Badge className="bg-green-100 text-green-800">Tabla existe</Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <Badge className="bg-red-100 text-red-800">Tabla no existe</Badge>
                    </>
                  )}
                </div>

                {testResults.tables.habitaciones.exists && (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Total:</strong> {testResults.tables.habitaciones.count}
                    </p>
                    {testResults.sampleData.habitaciones.length > 0 && (
                      <div className="space-y-1">
                        {testResults.sampleData.habitaciones.slice(0, 2).map((hab: any) => (
                          <div key={hab.id} className="p-2 bg-gray-50 rounded text-xs">
                            <p>
                              <strong>#{hab.numero}</strong> - {hab.tipo}
                            </p>
                            <p>
                              ${hab.precio} - {hab.estado}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {testResults.tables.habitaciones.error && (
                  <p className="text-xs text-red-600">{testResults.tables.habitaciones.error}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reservas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Reservas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {testResults.tables.reservas.exists ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <Badge className="bg-green-100 text-green-800">Tabla existe</Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <Badge className="bg-red-100 text-red-800">Tabla no existe</Badge>
                    </>
                  )}
                </div>

                {testResults.tables.reservas.exists && (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Total:</strong> {testResults.tables.reservas.count}
                    </p>
                    {testResults.sampleData.reservas.length > 0 && (
                      <div className="space-y-1">
                        {testResults.sampleData.reservas.slice(0, 2).map((res: any) => (
                          <div key={res.id} className="p-2 bg-gray-50 rounded text-xs">
                            <p>
                              <strong>{res.cliente_nombre}</strong>
                            </p>
                            <p>
                              {res.fecha_checkin} - {res.estado}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {testResults.tables.reservas.error && (
                  <p className="text-xs text-red-600">{testResults.tables.reservas.error}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instrucciones */}
        {!allTablesExist && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Instrucciones de Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-yellow-700 font-medium">Para configurar la base de datos:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                  <li>Ve a tu panel de Supabase: https://nmdvilutbmkksaoxulvk.supabase.co</li>
                  <li>Abre el SQL Editor</li>
                  <li>
                    Ejecuta el script <code>complete-setup.sql</code>
                  </li>
                  <li>Recarga esta página para verificar</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>URL Supabase:</strong>
                  <br />
                  https://nmdvilutbmkksaoxulvk.supabase.co
                </div>
                <div>
                  <strong>Entorno:</strong> {process.env.NODE_ENV}
                </div>
              </div>

              {testResults.errors.length > 0 && (
                <div>
                  <strong className="text-red-600">Errores encontrados:</strong>
                  <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                    {testResults.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
