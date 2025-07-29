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
import { ArrowLeft, Calendar, User, Mail, Phone, DollarSign, CreditCard, Loader2 } from "lucide-react"
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
  const [loadingHabitaciones, setLoadingHabitaciones] = useState(false)
  const [error, setError] = useState("")
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [formData, setFormData] = useState({
    habitacion_id: "",
    cliente_nombre: "",
    cliente_email: "",
    cliente_telefono: "",
    cliente_documento: "",
    tipo_documento: "DNI",
    nacionalidad: "Argentina",
    fecha_checkin: "",
    fecha_checkout: "",
    estado: "confirmada",
    total: 0,
  })

  // Lista de países
  const paises = [
    "Argentina",
    "Brasil",
    "Chile",
    "Uruguay",
    "Paraguay",
    "Bolivia",
    "Perú",
    "Colombia",
    "Ecuador",
    "Venezuela",
    "México",
    "Estados Unidos",
    "Canadá",
    "España",
    "Francia",
    "Italia",
    "Alemania",
    "Reino Unido",
    "Portugal",
    "Otro",
  ]

  // Detectar automáticamente el tipo de documento según la nacionalidad
  useEffect(() => {
    if (formData.nacionalidad === "Argentina") {
      setFormData((prev) => ({ ...prev, tipo_documento: "DNI" }))
    } else {
      setFormData((prev) => ({ ...prev, tipo_documento: "PASAPORTE" }))
    }
  }, [formData.nacionalidad])

  // Validar formato del documento
  const validarDocumento = (documento: string, tipo: string) => {
    if (!documento) return { valido: false, mensaje: "" }

    if (tipo === "DNI") {
      const dniRegex = /^\d{7,8}$/
      if (!dniRegex.test(documento)) {
        return { valido: false, mensaje: "El DNI debe tener 7 u 8 dígitos" }
      }
    } else {
      const pasaporteRegex = /^[A-Z0-9]{6,}$/i
      if (!pasaporteRegex.test(documento)) {
        return { valido: false, mensaje: "El pasaporte debe tener al menos 6 caracteres alfanuméricos" }
      }
    }

    return { valido: true, mensaje: "" }
  }

  const documentoValidacion = validarDocumento(formData.cliente_documento, formData.tipo_documento)

  // Cargar habitaciones disponibles cuando cambien las fechas
  useEffect(() => {
    const fetchHabitacionesDisponibles = async () => {
      // Solo buscar si ambas fechas están seleccionadas
      if (!formData.fecha_checkin || !formData.fecha_checkout) {
        setHabitaciones([])
        setFormData((prev) => ({ ...prev, habitacion_id: "", total: 0 }))
        return
      }

      // Validar que checkout sea después de checkin
      if (formData.fecha_checkout <= formData.fecha_checkin) {
        setHabitaciones([])
        setFormData((prev) => ({ ...prev, habitacion_id: "", total: 0 }))
        return
      }

      try {
        setLoadingHabitaciones(true)
        setError("")

        const params = new URLSearchParams({
          checkin: formData.fecha_checkin,
          checkout: formData.fecha_checkout,
        })

        console.log("🔍 Buscando habitaciones disponibles para:", {
          checkin: formData.fecha_checkin,
          checkout: formData.fecha_checkout,
        })

        const response = await fetch(`/api/habitaciones-disponibles?${params}`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("✅ Habitaciones disponibles encontradas:", data)

        // Asegurar que habitaciones sea un array
        const habitacionesArray = Array.isArray(data.habitaciones) ? data.habitaciones : data || []
        setHabitaciones(habitacionesArray)

        // Limpiar habitación seleccionada si ya no está disponible
        if (formData.habitacion_id && habitacionesArray.length > 0) {
          const habitacionDisponible = habitacionesArray.find(
            (h: Habitacion) => h.id.toString() === formData.habitacion_id,
          )
          if (!habitacionDisponible) {
            setFormData((prev) => ({ ...prev, habitacion_id: "", total: 0 }))
          }
        }
      } catch (error) {
        console.error("❌ Error loading habitaciones:", error)
        setError("Error al cargar habitaciones disponibles")
        setHabitaciones([])
      } finally {
        setLoadingHabitaciones(false)
      }
    }

    fetchHabitacionesDisponibles()
  }, [formData.fecha_checkin, formData.fecha_checkout])

  // Calcular total automáticamente - CORREGIDO: Verificar que habitaciones sea un array
  useEffect(() => {
    if (formData.habitacion_id && formData.fecha_checkin && formData.fecha_checkout && Array.isArray(habitaciones)) {
      const habitacion = habitaciones.find((h) => h.id.toString() === formData.habitacion_id)
      if (habitacion) {
        const checkin = new Date(formData.fecha_checkin)
        const checkout = new Date(formData.fecha_checkout)
        const noches = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24))
        if (noches > 0) {
          setFormData((prev) => ({ ...prev, total: habitacion.precio * noches }))
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, total: 0 }))
    }
  }, [formData.habitacion_id, formData.fecha_checkin, formData.fecha_checkout, habitaciones])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validar documento antes de enviar
    if (!documentoValidacion.valido) {
      setError(documentoValidacion.mensaje)
      setLoading(false)
      return
    }

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
      const noches = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24))
      return noches > 0 ? noches : 0
    }
    return 0
  }

  // CORREGIDO: Verificar que habitaciones sea un array antes de usar find
  const habitacionSeleccionada = Array.isArray(habitaciones)
    ? habitaciones.find((h) => h.id.toString() === formData.habitacion_id)
    : undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
      {/* Header */}
      <header className="bg-amber-900/95 backdrop-blur-sm shadow-sm border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4">
            <Button asChild variant="outline" size="sm" className="border-amber-200 hover:bg-amber-100 bg-transparent">
              <Link href="/admin/reservas">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Nueva Reserva</h1>
              <p className="text-sm text-amber-100">Crear una nueva reserva de habitación</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Información del Cliente */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-900">
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
                    className="border-amber-200 focus:border-amber-400"
                  />
                </div>

                <div>
                  <Label htmlFor="nacionalidad">Nacionalidad *</Label>
                  <Select
                    value={formData.nacionalidad}
                    onValueChange={(value) => handleInputChange("nacionalidad", value)}
                  >
                    <SelectTrigger className="border-amber-200 focus:border-amber-400">
                      <SelectValue placeholder="Selecciona nacionalidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {paises.map((pais) => (
                        <SelectItem key={pais} value={pais}>
                          {pais === "Argentina"
                            ? "🇦🇷 Argentina"
                            : pais === "Brasil"
                              ? "🇧🇷 Brasil"
                              : pais === "Chile"
                                ? "🇨🇱 Chile"
                                : pais === "Uruguay"
                                  ? "🇺🇾 Uruguay"
                                  : pais === "Estados Unidos"
                                    ? "🇺🇸 Estados Unidos"
                                    : pais === "España"
                                      ? "🇪🇸 España"
                                      : `🌍 ${pais}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="tipo_documento">Documento *</Label>
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
                  <div className="col-span-2">
                    <Label htmlFor="cliente_documento">Número de {formData.tipo_documento} *</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="cliente_documento"
                        value={formData.cliente_documento}
                        onChange={(e) => handleInputChange("cliente_documento", e.target.value.toUpperCase())}
                        placeholder={formData.tipo_documento === "DNI" ? "12345678" : "ABC123456"}
                        className={`pl-10 border-amber-200 focus:border-amber-400 ${
                          formData.cliente_documento && !documentoValidacion.valido
                            ? "border-red-300 focus:border-red-400"
                            : ""
                        }`}
                        required
                      />
                    </div>
                    {formData.cliente_documento && !documentoValidacion.valido && (
                      <p className="text-sm text-red-600 mt-1">{documentoValidacion.mensaje}</p>
                    )}
                  </div>
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
                      className="pl-10 border-amber-200 focus:border-amber-400"
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
                      className="pl-10 border-amber-200 focus:border-amber-400"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de la Reserva */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-900">
                  <Calendar className="w-5 h-5" />
                  <span>Detalles de la Reserva</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha_checkin">Check-in *</Label>
                    <Input
                      id="fecha_checkin"
                      type="date"
                      value={formData.fecha_checkin}
                      onChange={(e) => handleInputChange("fecha_checkin", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="border-amber-200 focus:border-amber-400"
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
                      className="border-amber-200 focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="habitacion_id">Habitación *</Label>
                  <Select
                    value={formData.habitacion_id}
                    onValueChange={(value) => handleInputChange("habitacion_id", value)}
                    disabled={!formData.fecha_checkin || !formData.fecha_checkout || loadingHabitaciones}
                  >
                    <SelectTrigger className="border-amber-200 focus:border-amber-400">
                      <SelectValue
                        placeholder={
                          !formData.fecha_checkin || !formData.fecha_checkout
                            ? "Primero selecciona las fechas"
                            : loadingHabitaciones
                              ? "Buscando habitaciones..."
                              : !Array.isArray(habitaciones) || habitaciones.length === 0
                                ? "No hay habitaciones disponibles"
                                : "Seleccionar habitación"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingHabitaciones ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Buscando habitaciones...</span>
                          </div>
                        </SelectItem>
                      ) : !Array.isArray(habitaciones) || habitaciones.length === 0 ? (
                        <SelectItem value="no-rooms" disabled>
                          No hay habitaciones disponibles para estas fechas
                        </SelectItem>
                      ) : (
                        habitaciones.map((habitacion) => (
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
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {formData.fecha_checkin &&
                    formData.fecha_checkout &&
                    !loadingHabitaciones &&
                    Array.isArray(habitaciones) && (
                      <p className="text-sm text-amber-700 mt-1">
                        {habitaciones.length} habitación{habitaciones.length !== 1 ? "es" : ""} disponible
                        {habitaciones.length !== 1 ? "s" : ""} para estas fechas
                      </p>
                    )}
                </div>

                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                    <SelectTrigger className="border-amber-200 focus:border-amber-400">
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
            <Card className="border-green-200 bg-green-50/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <DollarSign className="w-5 h-5" />
                  <span>Resumen de la Reserva</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Cliente:</p>
                    <p>{formData.cliente_nombre || "Nombre"}</p>
                    <p className="text-gray-600">{formData.nacionalidad}</p>
                    <p className="text-gray-600">
                      {formData.tipo_documento}: {formData.cliente_documento || "N°"}
                    </p>
                  </div>
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
            <Button
              type="submit"
              disabled={loading || !documentoValidacion.valido || !formData.habitacion_id}
              className="flex-1 bg-amber-700 hover:bg-amber-800"
            >
              {loading ? "Creando..." : "Crear Reserva"}
            </Button>
            <Button
              type="button"
              variant="outline"
              asChild
              className="border-amber-200 hover:bg-amber-100 bg-transparent"
            >
              <Link href="/admin/reservas">Cancelar</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
