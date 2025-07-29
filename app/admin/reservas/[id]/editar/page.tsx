"use client"

import type React from "react"

import { use, useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

interface Habitacion {
  id: number
  numero: string
  tipo: string
  precio: number
  capacidad: number
  amenidades: string[]
}

interface Reserva {
  id: number
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string
  cliente_documento?: string
  tipo_documento: string
  nacionalidad: string
  fecha_checkin: string
  fecha_checkout: string
  estado: string
  total: number
  notas?: string
  habitacion_id: number
}

interface FormData {
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string
  cliente_documento: string
  tipo_documento: string
  nacionalidad: string
  habitacion_id: string
  fecha_checkin: string
  fecha_checkout: string
  estado: string
  notas: string
}

export default function EditarReservaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    cliente_nombre: "",
    cliente_email: "",
    cliente_telefono: "",
    cliente_documento: "",
    tipo_documento: "DNI",
    nacionalidad: "Argentina",
    habitacion_id: "",
    fecha_checkin: "",
    fecha_checkout: "",
    estado: "pendiente",
    notas: "",
  })

  // Cargar datos de la reserva
  useEffect(() => {
    const cargarReserva = async () => {
      try {
        console.log("🔄 Cargando reserva ID:", resolvedParams.id)

        const response = await fetch(`/api/admin/reservas/${resolvedParams.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        console.log("📥 Respuesta recibida:", {
          status: response.status,
          statusText: response.statusText,
        })

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("✅ Datos de reserva recibidos:", data)

        // La respuesta puede venir directamente o dentro de una propiedad 'reserva'
        const reservaData = data.reserva || data

        if (!reservaData || !reservaData.id) {
          throw new Error("Datos de reserva incompletos")
        }

        setReserva(reservaData)

        // Inicializar formulario con datos de la reserva
        setFormData({
          cliente_nombre: reservaData.cliente_nombre || "",
          cliente_email: reservaData.cliente_email || "",
          cliente_telefono: reservaData.cliente_telefono || "",
          cliente_documento: reservaData.cliente_documento || "",
          tipo_documento: reservaData.tipo_documento || "DNI",
          nacionalidad: reservaData.nacionalidad || "Argentina",
          habitacion_id: reservaData.habitacion_id?.toString() || "",
          fecha_checkin: reservaData.fecha_checkin || "",
          fecha_checkout: reservaData.fecha_checkout || "",
          estado: reservaData.estado || "pendiente",
          notas: reservaData.notas || "",
        })

        console.log("✅ Formulario inicializado con:", {
          cliente_nombre: reservaData.cliente_nombre,
          habitacion_id: reservaData.habitacion_id,
          estado: reservaData.estado,
        })
      } catch (error) {
        console.error("❌ Error al cargar reserva:", error)
        setError(error instanceof Error ? error.message : "Error al cargar la reserva")
      } finally {
        setLoading(false)
      }
    }

    cargarReserva()
  }, [resolvedParams.id])

  // Cargar habitaciones disponibles
  useEffect(() => {
    const cargarHabitaciones = async () => {
      try {
        const response = await fetch("/api/admin/habitaciones", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setHabitaciones(data.habitaciones || [])
        }
      } catch (error) {
        console.error("Error al cargar habitaciones:", error)
      }
    }

    cargarHabitaciones()
  }, [])

  // Calcular total usando useMemo para evitar bucles infinitos
  const totalCalculado = useMemo(() => {
    if (formData.fecha_checkin && formData.fecha_checkout && formData.habitacion_id && habitaciones.length > 0) {
      const habitacion = habitaciones.find((h) => h.id.toString() === formData.habitacion_id)
      if (habitacion) {
        const checkin = new Date(formData.fecha_checkin)
        const checkout = new Date(formData.fecha_checkout)
        const nights = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24))
        return nights * habitacion.precio
      }
    }
    return reserva?.total || 0
  }, [formData.fecha_checkin, formData.fecha_checkout, formData.habitacion_id, habitaciones])

  // Actualizar el total en el estado de reserva cuando cambie
  useEffect(() => {
    if (reserva && totalCalculado !== reserva.total) {
      setReserva((prev) => (prev ? { ...prev, total: totalCalculado } : null))
    }
  }, [totalCalculado, reserva])

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Validaciones básicas
      if (!formData.cliente_nombre || !formData.cliente_email || !formData.fecha_checkin || !formData.fecha_checkout) {
        throw new Error("Por favor completa todos los campos requeridos")
      }

      if (new Date(formData.fecha_checkout) <= new Date(formData.fecha_checkin)) {
        throw new Error("La fecha de check-out debe ser posterior al check-in")
      }

      const habitacion = habitaciones.find((h) => h.id.toString() === formData.habitacion_id)
      if (!habitacion) {
        throw new Error("Por favor selecciona una habitación válida")
      }

      const requestData = {
        ...formData,
        habitacion_id: Number.parseInt(formData.habitacion_id),
        total: totalCalculado,
      }

      console.log("📤 Enviando datos:", requestData)

      const response = await fetch(`/api/admin/reservas/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      })

      console.log("📥 Respuesta recibida:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      })

      if (!response.ok) {
        let errorMessage = "Error al actualizar la reserva"

        // Obtener el contenido de la respuesta como texto primero
        const responseText = await response.text()
        console.log("📄 Contenido de respuesta de error:", responseText)

        if (responseText) {
          try {
            // Intentar parsear como JSON solo si hay contenido
            const errorData = JSON.parse(responseText)
            console.log("📋 Error data parseado:", errorData)

            if (errorData.error === "FECHAS_SOLAPADAS") {
              errorMessage = "Las fechas seleccionadas se solapan con otra reserva existente para esta habitación"
            } else if (errorData.error) {
              errorMessage = errorData.error
            } else if (errorData.message) {
              errorMessage = errorData.message
            }
          } catch (parseError) {
            // Si no se puede parsear como JSON, usar el texto directamente
            console.log("⚠️ No se pudo parsear como JSON, usando texto directo")
            errorMessage = responseText.length > 200 ? responseText.substring(0, 200) + "..." : responseText
          }
        } else {
          // Si no hay contenido, usar información del status
          errorMessage = `Error ${response.status}: ${response.statusText || "Error desconocido"}`
        }

        throw new Error(errorMessage)
      }

      // Manejar respuesta exitosa
      const responseText = await response.text()
      console.log("📄 Contenido de respuesta exitosa:", responseText)

      let result = { success: true }
      if (responseText) {
        try {
          result = JSON.parse(responseText)
          console.log("✅ Reserva actualizada:", result)
        } catch (parseError) {
          console.log("⚠️ Respuesta exitosa no es JSON válido, pero operación completada")
        }
      }

      // Redirigir a la lista de reservas
      router.push("/admin/reservas")
    } catch (error) {
      console.error("❌ Error al actualizar reserva:", error)
      setError(error instanceof Error ? error.message : "Error al actualizar la reserva")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <span className="ml-2 text-amber-700">Cargando reserva...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !reserva) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error al cargar la reserva</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => router.push("/admin/reservas")} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Reservas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/admin/reservas")}
              variant="outline"
              className="border-amber-200 hover:bg-amber-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-amber-900">Editar Reserva #{resolvedParams.id}</h1>
              <p className="text-amber-700">
                {reserva?.cliente_nombre ? `Reserva de ${reserva.cliente_nombre}` : "Modifica los datos de la reserva"}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Información de la Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del Cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cliente_nombre" className="text-amber-800">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="cliente_nombre"
                    value={formData.cliente_nombre}
                    onChange={(e) => handleInputChange("cliente_nombre", e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cliente_email" className="text-amber-800">
                    Email *
                  </Label>
                  <Input
                    id="cliente_email"
                    type="email"
                    value={formData.cliente_email}
                    onChange={(e) => handleInputChange("cliente_email", e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cliente_telefono" className="text-amber-800">
                    Teléfono
                  </Label>
                  <Input
                    id="cliente_telefono"
                    value={formData.cliente_telefono}
                    onChange={(e) => handleInputChange("cliente_telefono", e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>

                <div>
                  <Label htmlFor="nacionalidad" className="text-amber-800">
                    Nacionalidad
                  </Label>
                  <Input
                    id="nacionalidad"
                    value={formData.nacionalidad}
                    onChange={(e) => handleInputChange("nacionalidad", e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>

                <div>
                  <Label htmlFor="tipo_documento" className="text-amber-800">
                    Tipo de Documento
                  </Label>
                  <Select
                    value={formData.tipo_documento}
                    onValueChange={(value) => handleInputChange("tipo_documento", value)}
                  >
                    <SelectTrigger className="border-amber-200 focus:border-amber-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cliente_documento" className="text-amber-800">
                    Número de Documento
                  </Label>
                  <Input
                    id="cliente_documento"
                    value={formData.cliente_documento}
                    onChange={(e) => handleInputChange("cliente_documento", e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Información de la Reserva */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="habitacion_id" className="text-amber-800">
                    Habitación *
                  </Label>
                  <Select
                    value={formData.habitacion_id}
                    onValueChange={(value) => handleInputChange("habitacion_id", value)}
                  >
                    <SelectTrigger className="border-amber-200 focus:border-amber-400">
                      <SelectValue placeholder="Selecciona una habitación" />
                    </SelectTrigger>
                    <SelectContent>
                      {habitaciones.map((habitacion) => (
                        <SelectItem key={habitacion.id} value={habitacion.id.toString()}>
                          Habitación {habitacion.numero} - {habitacion.tipo} (${habitacion.precio.toLocaleString()}
                          /noche)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="estado" className="text-amber-800">
                    Estado
                  </Label>
                  <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                    <SelectTrigger className="border-amber-200 focus:border-amber-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="confirmada">Confirmada</SelectItem>
                      <SelectItem value="checkin">Check-in</SelectItem>
                      <SelectItem value="checkout">Check-out</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fecha_checkin" className="text-amber-800">
                    Fecha de Check-in *
                  </Label>
                  <Input
                    id="fecha_checkin"
                    type="date"
                    value={formData.fecha_checkin}
                    onChange={(e) => handleInputChange("fecha_checkin", e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fecha_checkout" className="text-amber-800">
                    Fecha de Check-out *
                  </Label>
                  <Input
                    id="fecha_checkout"
                    type="date"
                    value={formData.fecha_checkout}
                    onChange={(e) => handleInputChange("fecha_checkout", e.target.value)}
                    className="border-amber-200 focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              {/* Notas */}
              <div>
                <Label htmlFor="notas" className="text-amber-800">
                  Notas Adicionales
                </Label>
                <Textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => handleInputChange("notas", e.target.value)}
                  className="border-amber-200 focus:border-amber-400"
                  rows={3}
                  placeholder="Notas adicionales sobre la reserva..."
                />
              </div>

              {/* Total */}
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-amber-900">Total:</span>
                  <span className="text-2xl font-bold text-amber-900">${totalCalculado.toLocaleString()}</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/reservas")}
                  className="border-amber-200 hover:bg-amber-50"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
