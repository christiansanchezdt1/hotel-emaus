"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  DollarSign,
  Bed,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  MapPin,
  Clock,
  Users,
  Star,
  Sparkles,
  Heart,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { HabitacionOcupadaModal } from "@/components/habitacion-ocupada-modal"

interface Habitacion {
  id: number
  numero: string
  tipo: string
  precio: number
  capacidad: number
  descripcion: string | null
  amenidades: string[] | null
}

interface ConflictoReserva {
  habitacion: {
    id: number
    numero: string
    tipo: string
    precio: number
  }
  reservas_existentes: Array<{
    fecha_checkin: string
    fecha_checkout: string
    cliente_nombre: string
  }>
  fechas_solicitadas: {
    checkin: string
    checkout: string
  }
}

export default function ReservarPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [showConflictoModal, setShowConflictoModal] = useState(false)
  const [conflictoData, setConflictoData] = useState<{
    conflicto: ConflictoReserva
    alternativas: Habitacion[]
  } | null>(null)
  const [reservaCreada, setReservaCreada] = useState<any>(null)

  const [formData, setFormData] = useState({
    habitacion_id: "",
    cliente_nombre: "",
    cliente_email: "",
    cliente_telefono: "",
    cliente_documento: "",
    tipo_documento: "DNI", // DNI o PASAPORTE
    nacionalidad: "Argentina",
    fecha_checkin: "",
    fecha_checkout: "",
    total: 0,
  })

  // Lista de países para el selector de nacionalidad
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
      // DNI argentino: 7-8 dígitos
      const dniRegex = /^\d{7,8}$/
      if (!dniRegex.test(documento)) {
        return { valido: false, mensaje: "El DNI debe tener 7 u 8 dígitos" }
      }
    } else {
      // Pasaporte: al menos 6 caracteres alfanuméricos
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
    const fetchHabitaciones = async () => {
      try {
        let url = "/api/habitaciones-disponibles"
        const params = new URLSearchParams()

        if (formData.fecha_checkin) {
          params.append("fecha", formData.fecha_checkin)
        }
        if (formData.fecha_checkout) {
          params.append("fecha_checkout", formData.fecha_checkout)
        }

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await fetch(url)
        const data = await response.json()
        setHabitaciones(data.habitaciones || [])

        // Si la habitación seleccionada ya no está disponible, limpiar selección
        if (
          formData.habitacion_id &&
          !data.habitaciones?.find((h: Habitacion) => h.id.toString() === formData.habitacion_id)
        ) {
          setFormData((prev) => ({ ...prev, habitacion_id: "", total: 0 }))
        }
      } catch (error) {
        console.error("Error loading habitaciones:", error)
      }
    }

    if (formData.fecha_checkin && formData.fecha_checkout) {
      fetchHabitaciones()
    } else {
      // Cargar todas las habitaciones si no hay fechas
      fetchHabitaciones()
    }
  }, [formData.fecha_checkin, formData.fecha_checkout])

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

    // Validar documento antes de enviar
    if (!documentoValidacion.valido) {
      setError(documentoValidacion.mensaje)
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setReservaCreada(data.reserva)
        setFormData({
          habitacion_id: "",
          cliente_nombre: "",
          cliente_email: "",
          cliente_telefono: "",
          cliente_documento: "",
          tipo_documento: "DNI",
          nacionalidad: "Argentina",
          fecha_checkin: "",
          fecha_checkout: "",
          total: 0,
        })
      } else if (data.error === "HABITACION_OCUPADA") {
        // Mostrar modal con alternativas
        setConflictoData({
          conflicto: data.conflicto,
          alternativas: data.alternativas || [],
        })
        setShowConflictoModal(true)
      } else {
        setError(data.error || "Error al procesar la reserva")
      }
    } catch (error) {
      setError("Error de conexión. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSelectAlternativa = (habitacionId: number) => {
    setFormData((prev) => ({ ...prev, habitacion_id: habitacionId.toString() }))
    setConflictoData(null)
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ¡Reserva Confirmada!
            </CardTitle>
            <p className="text-lg text-gray-600 mt-2">
              Te esperamos en Casa de Emaús para que vivas una experiencia de descanso y espiritualidad
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
              <h4 className="font-bold text-emerald-800 mb-4 text-lg">Detalles de tu reserva:</h4>
              {reservaCreada && (
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-emerald-600 text-white">#{reservaCreada.id}</Badge>
                      <span className="text-emerald-700 font-medium">Reserva</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bed className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">
                        Habitación #{reservaCreada.habitaciones?.numero} - {reservaCreada.habitaciones?.tipo}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">{reservaCreada.cliente_nombre}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">
                        {reservaCreada.tipo_documento} {reservaCreada.cliente_documento}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">
                        {new Date(reservaCreada.fecha_checkin).toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">
                        {new Date(reservaCreada.fecha_checkout).toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold text-lg">
                        {new Intl.NumberFormat("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(reservaCreada.total)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Bed className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-800">Hotel Casa de Emaús</h4>
                  <p className="text-sm text-blue-600">Tu hogar espiritual en Salta</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">Calle Córdoba 758, Salta Capital, CP 4400</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">WhatsApp: +54 387 550-5939</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">hotelcasadeemaus@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">@hotelemaus_</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
              >
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Inicio
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                <Link href="/reservar">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Hacer Otra Reserva
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header mejorado */}
      <header className="bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 bg-transparent">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Inicio
                </Link>
              </Button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bed className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Hotel Casa de Emaús
                  </h1>
                  <p className="text-sm text-gray-600 flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>Salta Capital - Reserva Online</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <Shield className="w-3 h-3 mr-1" />
                Reserva Segura
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section mejorado */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full mb-6 border border-blue-200">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Reserva Online</span>
              <Star className="w-4 h-4 fill-current" />
            </div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              <span className="text-gray-800">Reserva tu</span>
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                experiencia espiritual
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Te esperamos en Casa de Emaús para que vivas una experiencia de{" "}
              <span className="font-semibold text-blue-600">descanso y espiritualidad</span> en el corazón de Salta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Información del Cliente - Mejorado */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Información Personal
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  {/* Nombre Completo */}
                  <div className="space-y-2">
                    <Label htmlFor="cliente_nombre" className="text-sm font-semibold text-gray-700 block">
                      Nombre Completo *
                    </Label>
                    <Input
                      id="cliente_nombre"
                      value={formData.cliente_nombre}
                      onChange={(e) => handleInputChange("cliente_nombre", e.target.value)}
                      placeholder="Ingresa tu nombre completo"
                      required
                      className="h-12 border-2 border-blue-100 focus:border-blue-400 rounded-lg transition-colors text-base"
                    />
                  </div>

                  {/* Nacionalidad */}
                  <div className="space-y-2">
                    <Label htmlFor="nacionalidad" className="text-sm font-semibold text-gray-700 block">
                      Nacionalidad *
                    </Label>
                    <Select
                      value={formData.nacionalidad}
                      onValueChange={(value) => handleInputChange("nacionalidad", value)}
                    >
                      <SelectTrigger className="h-12 border-2 border-blue-100 focus:border-blue-400 rounded-lg text-base">
                        <SelectValue placeholder="Selecciona tu nacionalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {paises.map((pais) => (
                          <SelectItem key={pais} value={pais} className="text-base">
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

                  {/* Documento - Grid mejorado */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo_documento" className="text-sm font-semibold text-gray-700 block">
                        Tipo de Documento *
                      </Label>
                      <Select
                        value={formData.tipo_documento}
                        onValueChange={(value) => handleInputChange("tipo_documento", value)}
                      >
                        <SelectTrigger className="h-12 border-2 border-blue-100 focus:border-blue-400 rounded-lg text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DNI" className="text-base">
                            DNI
                          </SelectItem>
                          <SelectItem value="PASAPORTE" className="text-base">
                            Pasaporte
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="cliente_documento" className="text-sm font-semibold text-gray-700 block">
                        Número de {formData.tipo_documento} *
                      </Label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                        <Input
                          id="cliente_documento"
                          value={formData.cliente_documento}
                          onChange={(e) => handleInputChange("cliente_documento", e.target.value.toUpperCase())}
                          placeholder={formData.tipo_documento === "DNI" ? "12345678" : "ABC123456"}
                          className={`h-12 pl-12 border-2 rounded-lg transition-colors text-base ${
                            formData.cliente_documento && !documentoValidacion.valido
                              ? "border-red-300 focus:border-red-400"
                              : "border-blue-100 focus:border-blue-400"
                          }`}
                          required
                        />
                      </div>
                      {formData.cliente_documento && !documentoValidacion.valido && (
                        <p className="text-sm text-red-600 flex items-center space-x-1 mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{documentoValidacion.mensaje}</span>
                        </p>
                      )}
                      {formData.tipo_documento === "DNI" && (
                        <p className="text-xs text-gray-500 mt-1">Solo números, sin puntos ni espacios</p>
                      )}
                      {formData.tipo_documento === "PASAPORTE" && (
                        <p className="text-xs text-gray-500 mt-1">Letras y números, mínimo 6 caracteres</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="cliente_email" className="text-sm font-semibold text-gray-700 block">
                      Email *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                      <Input
                        id="cliente_email"
                        type="email"
                        value={formData.cliente_email}
                        onChange={(e) => handleInputChange("cliente_email", e.target.value)}
                        placeholder="tu@email.com"
                        className="h-12 pl-12 border-2 border-blue-100 focus:border-blue-400 rounded-lg text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <Label htmlFor="cliente_telefono" className="text-sm font-semibold text-gray-700 block">
                      Teléfono
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                      <Input
                        id="cliente_telefono"
                        value={formData.cliente_telefono}
                        onChange={(e) => handleInputChange("cliente_telefono", e.target.value)}
                        placeholder={formData.nacionalidad === "Argentina" ? "+54 9 11 1234-5678" : "+1 234 567-8900"}
                        className="h-12 pl-12 border-2 border-blue-100 focus:border-blue-400 rounded-lg text-base"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información de la Reserva - Mejorado */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Detalles de la Reserva
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  {/* Fechas - Grid mejorado */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha_checkin" className="text-sm font-semibold text-gray-700 block">
                        Check-in *
                      </Label>
                      <Input
                        id="fecha_checkin"
                        type="date"
                        value={formData.fecha_checkin}
                        onChange={(e) => handleInputChange("fecha_checkin", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="h-12 border-2 border-purple-100 focus:border-purple-400 rounded-lg text-base"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fecha_checkout" className="text-sm font-semibold text-gray-700 block">
                        Check-out *
                      </Label>
                      <Input
                        id="fecha_checkout"
                        type="date"
                        value={formData.fecha_checkout}
                        onChange={(e) => handleInputChange("fecha_checkout", e.target.value)}
                        min={formData.fecha_checkin || new Date().toISOString().split("T")[0]}
                        className="h-12 border-2 border-purple-100 focus:border-purple-400 rounded-lg text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Habitación */}
                  <div className="space-y-2">
                    <Label htmlFor="habitacion_id" className="text-sm font-semibold text-gray-700 block">
                      Habitación Disponible *
                    </Label>
                    <Select
                      value={formData.habitacion_id}
                      onValueChange={(value) => handleInputChange("habitacion_id", value)}
                    >
                      <SelectTrigger className="h-12 border-2 border-purple-100 focus:border-purple-400 rounded-lg text-base">
                        <SelectValue
                          placeholder={
                            formData.fecha_checkin && formData.fecha_checkout
                              ? "Seleccionar habitación disponible"
                              : "Primero selecciona las fechas"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {habitaciones.length > 0 ? (
                          habitaciones.map((habitacion) => (
                            <SelectItem key={habitacion.id} value={habitacion.id.toString()} className="text-base">
                              <div className="flex items-center space-x-2">
                                <Bed className="w-4 h-4 text-purple-600" />
                                <span>
                                  #{habitacion.numero} - {habitacion.tipo} (
                                  {new Intl.NumberFormat("es-AR", {
                                    style: "currency",
                                    currency: "ARS",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  }).format(habitacion.precio)}
                                  /noche)
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-disponible" disabled className="text-base">
                            {formData.fecha_checkin && formData.fecha_checkout
                              ? "No hay habitaciones disponibles para estas fechas"
                              : "Selecciona fechas para ver disponibilidad"}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {formData.fecha_checkin && formData.fecha_checkout && habitaciones.length === 0 && (
                      <Alert className="border-red-200 bg-red-50 mt-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          No hay habitaciones disponibles para las fechas seleccionadas. Intenta con otras fechas.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Información de la habitación seleccionada */}
                  {habitacionSeleccionada && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mt-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                          <Bed className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800">Habitación #{habitacionSeleccionada.numero}</h4>
                          <p className="text-sm text-purple-600">{habitacionSeleccionada.tipo}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-purple-700">
                            Capacidad: {habitacionSeleccionada.capacidad} personas
                          </span>
                        </div>
                        <Badge className="bg-purple-600 text-white">
                          {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(habitacionSeleccionada.precio)}
                          /noche
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Resumen de Reserva - Completamente rediseñado */}
            {habitacionSeleccionada && formData.fecha_checkin && formData.fecha_checkout && (
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <span>Resumen de tu Reserva</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-800 flex items-center space-x-2">
                        <User className="w-5 h-5 text-emerald-600" />
                        <span>Huésped</span>
                      </h4>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-200 shadow-sm">
                        <p className="font-semibold text-lg text-gray-800">
                          {formData.cliente_nombre || "Nombre completo"}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center space-x-1">
                          <CreditCard className="w-3 h-3" />
                          <span>
                            {formData.tipo_documento} {formData.cliente_documento || "Documento"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center space-x-1">
                          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                          <span>{formData.nacionalidad}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-800 flex items-center space-x-2">
                        <Bed className="w-5 h-5 text-emerald-600" />
                        <span>Habitación</span>
                      </h4>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-200 shadow-sm">
                        <p className="font-semibold text-lg text-gray-800">#{habitacionSeleccionada.numero}</p>
                        <p className="text-sm text-gray-600">{habitacionSeleccionada.tipo}</p>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Users className="w-3 h-3" />
                          <span>{habitacionSeleccionada.capacidad} personas</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-800 flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <span>Fechas</span>
                      </h4>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-200 shadow-sm">
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium text-gray-700">Check-in:</span>{" "}
                            <span className="text-gray-600">
                              {new Date(formData.fecha_checkin).toLocaleDateString("es-ES", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="font-medium text-gray-700">Check-out:</span>{" "}
                            <span className="text-gray-600">
                              {new Date(formData.fecha_checkout).toLocaleDateString("es-ES", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </p>
                          <Badge className="bg-emerald-600 text-white">
                            <Clock className="w-3 h-3 mr-1" />
                            {calcularNoches()} noches
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-emerald-100 text-sm">
                          {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(habitacionSeleccionada.precio)}{" "}
                          × {calcularNoches()} noches
                        </p>
                        <p className="text-3xl font-bold flex items-center space-x-2">
                          <DollarSign className="w-8 h-8" />
                          <span>
                            {new Intl.NumberFormat("es-AR", {
                              style: "currency",
                              currency: "ARS",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(formData.total)}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-white/20 text-white border-white/30">
                          {formData.nacionalidad === "Argentina" ? "🇦🇷 Nacional" : "🌍 Extranjero"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {habitacionSeleccionada.descripcion && (
                    <div className="bg-white/60 p-4 rounded-xl border border-emerald-200">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                        <Star className="w-4 h-4 text-emerald-600" />
                        <span>Descripción de la habitación</span>
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{habitacionSeleccionada.descripcion}</p>
                    </div>
                  )}

                  {habitacionSeleccionada.amenidades && habitacionSeleccionada.amenidades.length > 0 && (
                    <div className="bg-white/60 p-4 rounded-xl border border-emerald-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Amenidades incluidas</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {habitacionSeleccionada.amenidades.map((amenidad, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-emerald-300 text-emerald-700 bg-emerald-50"
                          >
                            {amenidad.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50 shadow-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={loading || !formData.habitacion_id || !documentoValidacion.valido}
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-16 py-4 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Procesando tu reserva...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6" />
                    <span>Confirmar Reserva</span>
                    <Sparkles className="w-6 h-6" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de conflicto */}
      {showConflictoModal && conflictoData && (
        <HabitacionOcupadaModal
          isOpen={showConflictoModal}
          onClose={() => {
            setShowConflictoModal(false)
            setConflictoData(null)
          }}
          conflicto={conflictoData.conflicto}
          alternativas={conflictoData.alternativas}
          onSelectAlternativa={handleSelectAlternativa}
        />
      )}
    </div>
  )
}
