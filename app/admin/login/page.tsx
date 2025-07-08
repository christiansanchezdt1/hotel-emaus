"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Bed, Lock, User, AlertCircle, CheckCircle } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [adminCheck, setAdminCheck] = useState<any>(null)
  const router = useRouter()

  // Verificar si el admin existe al cargar la página
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/admin/check")
        const data = await response.json()
        setAdminCheck(data)
      } catch (error) {
        console.error("Error checking admin:", error)
      }
    }
    checkAdmin()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Enviando login request...") // Para debug

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      console.log("Response:", response.status, data) // Para debug

      if (response.ok) {
        console.log("Login exitoso, redirigiendo...")
        router.push("/admin/dashboard")
        router.refresh()
      } else {
        setError(data.error || "Error al iniciar sesión")
      }
    } catch (error) {
      console.error("Error en login:", error)
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Status del Admin */}
        {adminCheck && (
          <Card className="border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                {adminCheck.count > 0 ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-700">
                      Admin configurado correctamente ({adminCheck.count} usuarios)
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700">No hay usuarios admin configurados</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bed className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Hotel Emaús</CardTitle>
            <CardDescription>Panel de Administración</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <strong>Credenciales por defecto:</strong>
                <br />
                <Badge variant="outline" className="mr-2">
                  admin
                </Badge>
                <Badge variant="outline">admin123</Badge>
              </p>
              {adminCheck && adminCheck.users && adminCheck.users.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  <p>Usuarios disponibles:</p>
                  {adminCheck.users.map((user: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{user.username}</span>
                      <span>{user.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
