"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Calendar, User, Mail, Phone, DollarSign } from "lucide-react"
import Link from "next/link"

interface Habitacion {
  id: number
  numero: string
  tipo: string
  precio: number
  capacidad: number
}

export default function NuevaReserva() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [formData, setFormData] = useState({
    habitacion_id: "",
    cliente_nombre: "",
    cliente_email: "",
    cliente_telefono: "",
    fecha_checkin: "",
    fecha_checkout: "",
    estado: "confirmada",
    total: 0,
  })

  // Cargar habitaciones disponibles
  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const response = await fetch("/api/habitaciones-disponibles")
        const data = await response.json()
        setHabitaciones(data.habitaciones || [])
      } catch (error) {
        console.error("Error loading habitaciones:", error)
      }
    }
    fetchHabitaciones()
  }, [])

  // Calcular total automáticamente
  useEffect(() => {
    if (formData.habitacion_id && formData.fecha_checkin && formData.fecha_checkout) {
      const habitacion = habitaciones.find((h) => h.id.toString() === formData.habitacion_id)
      if (habitacion) {
        const checkin = new Date(formData.fecha_checkin)
        const checkout = new Date(formData.fecha_checkout)
        const noches = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24))
        if (noches > 0) {
          setFormData((prev) => ({ ...prev, total: habitacion.precio * noches }))
        }
      }
    }
  }, [formData.habitacion_id, formData.fecha_checkin, formData.fecha_checkout, habitaciones])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          habitacion_id: Number.parseInt(formData.habitacion_id),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/admin/reservas")
      } else {
        setError(data.error || "Error al crear la reserva")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calcularNoches = () => {
    if (formData.fecha_checkin && formData.fecha_checkout) {
      const checkin = new Date(formData.fecha_checkin)
      const checkout = new Date(formData.fecha_checkout)
      const noches = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24))
      return noches > 0 ? noches : 0
    }
    return 0
  }

  const habitacionSeleccionada = habitaciones.find((h) => h.id.toString() === formData.habitacion_id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/reservas">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nueva Reserva</h1>
              <p className="text-sm text-gray-600">Crear una nueva reserva de habitación</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Información del Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Información del Cliente</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cliente_nombre">Nombre Completo *</Label>
                  <Input
                    id="cliente_nombre"
                    value={formData.cliente_nombre}
                    onChange={(e) => handleInputChange("cliente_nombre", e.target.value)}
                    placeholder="Nombre del huésped"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cliente_email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="cliente_email"
                      type="email"
                      value={formData.cliente_email}
                      onChange={(e) => handleInputChange("cliente_email", e.target.value)}
                      placeholder="email@ejemplo.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cliente_telefono">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="cliente_telefono"
                      value={formData.cliente_telefono}
                      onChange={(e) => handleInputChange("cliente_telefono", e.target.value)}
                      placeholder="+1234567890"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de la Reserva */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Detalles de la Reserva</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="habitacion_id">Habitación *</Label>
                  <Select
                    value={formData.habitacion_id}
                    onValueChange={(value) => handleInputChange("habitacion_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar habitación" />
                    </SelectTrigger>
                    <SelectContent>
                      {habitaciones.map((habitacion) => (
                        <SelectItem key={habitacion.id} value={habitacion.id.toString()}>
                          #{habitacion.numero} - {habitacion.tipo} (
                          {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(habitacion.precio)}
                          /noche)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha_checkin">Check-in *</Label>
                    <Input
                      id="fecha_checkin"
                      type="date"
                      value={formData.fecha_checkin}
                      onChange={(e) => handleInputChange("fecha_checkin", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fecha_checkout">Check-out *</Label>
                    <Input
                      id="fecha_checkout"
                      type="date"
                      value={formData.fecha_checkout}
                      onChange={(e) => handleInputChange("fecha_checkout", e.target.value)}
                      min={formData.fecha_checkin || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmada">Confirmada</SelectItem>
                      <SelectItem value="checkin">Check-in</SelectItem>
                      <SelectItem value="checkout">Check-out</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen */}
          {habitacionSeleccionada && formData.fecha_checkin && formData.fecha_checkout && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <DollarSign className="w-5 h-5" />
                  <span>Resumen de la Reserva</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Habitación:</p>
                    <p>
                      #{habitacionSeleccionada.numero} - {habitacionSeleccionada.tipo}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Duración:</p>
                    <p>{calcularNoches()} noches</p>
                  </div>
                  <div>
                    <p className="font-medium">Precio por noche:</p>
                    <p>
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(habitacionSeleccionada.precio)}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center text-lg font-bold text-green-800">
                    <span>Total:</span>
                    <span>
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(formData.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creando..." : "Crear Reserva"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/reservas">Cancelar</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
