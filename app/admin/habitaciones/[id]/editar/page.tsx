"use client"

import type React from "react"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { LogoutButton } from "@/components/logout-button"
import { AdminQuickLinks } from "@/components/admin-quick-links"
import { ArrowLeft, Save, AlertCircle, CheckCircle, Wifi, Car, Coffee, Tv, Wind, Bath, Bed } from "lucide-react"
import Link from "next/link"

interface Habitacion {
  id: number
  numero: string
  tipo: string
  capacidad: number
  precio: number
  descripcion: string | null
  amenidades: string[] | null
  estado: string
}

const tiposHabitacion = [
  { value: "Simple", label: "Simple" },
  { value: "Doble", label: "Doble" },
  { value: "Triple", label: "Triple" },
  { value: "Cuádruple", label: "Cuádruple" },
]

const estadosHabitacion = [
  { value: "disponible", label: "Disponible" },
  { value: "ocupada", label: "Ocupada" },
  { value: "mantenimiento", label: "Mantenimiento" },
]

const amenidadesDisponibles = [
  { id: "WiFi", label: "WiFi", icon: Wifi },
  { id: "Estacionamiento", label: "Estacionamiento", icon: Car },
  { id: "Desayuno", label: "Desayuno Incluido", icon: Coffee },
  { id: "TV", label: "Televisión", icon: Tv },
  { id: "Aire Acondicionado", label: "Aire Acondicionado", icon: Wind },
  { id: "Baño Privado", label: "Baño Privado", icon: Bath },
]

export default function EditarHabitacionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [habitacion, setHabitacion] = useState<Habitacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    numero: "",
    tipo: "",
    capacidad: "",
    precio: "",
    descripcion: "",
    amenidades: [] as string[],
    estado: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchHabitacion = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(`/api/admin/habitaciones/${resolvedParams.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Habitación no encontrada")
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        const hab = data.habitacion

        setHabitacion(hab)
        setFormData({
          numero: hab.numero || "",
          tipo: hab.tipo || "",
          capacidad: hab.capacidad?.toString() || "",
          precio: hab.precio?.toString() || "",
          descripcion: hab.descripcion || "",
          amenidades: hab.amenidades || [],
          estado: hab.estado || "disponible",
        })
      } catch (err) {
        console.error("Error fetching habitacion:", err)
        setError(err instanceof Error ? err.message : "Error al cargar la habitación")
      } finally {
        setLoading(false)
      }
    }

    if (resolvedParams.id) {
      fetchHabitacion()
    }
  }, [resolvedParams.id])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.numero.trim()) {
      newErrors.numero = "El número de habitación es requerido"
    }

    if (!formData.tipo) {
      newErrors.tipo = "El tipo de habitación es requerido"
    }

    const capacidad = Number.parseInt(formData.capacidad)
    if (!formData.capacidad || isNaN(capacidad) || capacidad < 1 || capacidad > 10) {
      newErrors.capacidad = "La capacidad debe ser un número entre 1 y 10"
    }

    const precio = Number.parseFloat(formData.precio)
    if (!formData.precio || isNaN(precio) || precio <= 0) {
      newErrors.precio = "El precio debe ser un número mayor a 0"
    }

    if (!formData.estado) {
      newErrors.estado = "El estado es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      setError("")
      setSuccess("")

      const response = await fetch(`/api/admin/habitaciones/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numero: formData.numero.trim(),
          tipo: formData.tipo,
          capacidad: Number.parseInt(formData.capacidad),
          precio: Number.parseFloat(formData.precio),
          descripcion: formData.descripcion.trim() || null,
          amenidades: formData.amenidades,
          estado: formData.estado,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }

      setSuccess("Habitación actualizada exitosamente")

      // Redirect after success
      setTimeout(() => {
        router.push("/admin/habitaciones")
      }, 1500)
    } catch (err) {
      console.error("Error updating habitacion:", err)
      setError(err instanceof Error ? err.message : "Error al actualizar la habitación")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleAmenidadChange = (amenidadId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenidades: checked ? [...prev.amenidades, amenidadId] : prev.amenidades.filter((a) => a !== amenidadId),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2 bg-amber-200/50" />
              <Skeleton className="h-4 w-48 bg-amber-200/50" />
            </div>
            <Skeleton className="h-10 w-24 bg-amber-200/50" />
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <Skeleton className="h-6 w-48 bg-amber-200/50" />
              <Skeleton className="h-4 w-64 bg-amber-200/50" />
            </CardHeader>
            <CardContent className="space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-amber-200/50" />
                  <Skeleton className="h-10 w-full bg-amber-200/50" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error && !habitacion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">Editar Habitación</h1>
              <p className="text-amber-700">Error al cargar la habitación</p>
            </div>
            <LogoutButton />
          </div>

          <Alert variant="destructive" className="bg-red-50/80 backdrop-blur-sm border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button asChild variant="outline" size="sm" className="ml-4 bg-transparent">
                <Link href="/admin/habitaciones">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Link>
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
            <h1 className="text-3xl font-bold text-amber-900">Editar Habitación</h1>
            <p className="text-amber-700">Modificar información de la habitación {habitacion?.numero}</p>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
            >
              <Link href="/admin/habitaciones">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="bg-red-50/80 backdrop-blur-sm border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50/80 backdrop-blur-sm border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {/* Formulario */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Información de la Habitación
            </CardTitle>
            <CardDescription className="text-amber-700">
              Modifica los datos de la habitación según sea necesario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Número */}
                <div className="space-y-2">
                  <Label htmlFor="numero" className="text-amber-900">
                    Número de Habitación *
                  </Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => handleInputChange("numero", e.target.value)}
                    placeholder="Ej: 101, A1, etc."
                    className={`bg-white border-amber-200 focus:border-amber-400 ${
                      errors.numero ? "border-red-300 focus:border-red-400" : ""
                    }`}
                  />
                  {errors.numero && <p className="text-sm text-red-600">{errors.numero}</p>}
                </div>

                {/* Tipo */}
                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-amber-900">
                    Tipo de Habitación *
                  </Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                    <SelectTrigger
                      className={`bg-white border-amber-200 focus:border-amber-400 ${
                        errors.tipo ? "border-red-300 focus:border-red-400" : ""
                      }`}
                    >
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposHabitacion.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tipo && <p className="text-sm text-red-600">{errors.tipo}</p>}
                </div>

                {/* Capacidad */}
                <div className="space-y-2">
                  <Label htmlFor="capacidad" className="text-amber-900">
                    Capacidad (personas) *
                  </Label>
                  <Input
                    id="capacidad"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.capacidad}
                    onChange={(e) => handleInputChange("capacidad", e.target.value)}
                    placeholder="Número de personas"
                    className={`bg-white border-amber-200 focus:border-amber-400 ${
                      errors.capacidad ? "border-red-300 focus:border-red-400" : ""
                    }`}
                  />
                  {errors.capacidad && <p className="text-sm text-red-600">{errors.capacidad}</p>}
                </div>

                {/* Precio */}
                <div className="space-y-2">
                  <Label htmlFor="precio" className="text-amber-900">
                    Precio por Noche (ARS) *
                  </Label>
                  <Input
                    id="precio"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => handleInputChange("precio", e.target.value)}
                    placeholder="Precio en pesos argentinos"
                    className={`bg-white border-amber-200 focus:border-amber-400 ${
                      errors.precio ? "border-red-300 focus:border-red-400" : ""
                    }`}
                  />
                  {errors.precio && <p className="text-sm text-red-600">{errors.precio}</p>}
                </div>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-amber-900">
                  Estado de la Habitación *
                </Label>
                <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                  <SelectTrigger
                    className={`bg-white border-amber-200 focus:border-amber-400 ${
                      errors.estado ? "border-red-300 focus:border-red-400" : ""
                    }`}
                  >
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosHabitacion.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.estado && <p className="text-sm text-red-600">{errors.estado}</p>}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-amber-900">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  placeholder="Descripción opcional de la habitación..."
                  rows={3}
                  className="bg-white border-amber-200 focus:border-amber-400 resize-none"
                />
              </div>

              {/* Amenidades */}
              <div className="space-y-3">
                <Label className="text-amber-900">Amenidades</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {amenidadesDisponibles.map((amenidad) => {
                    const IconComponent = amenidad.icon
                    return (
                      <div key={amenidad.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenidad.id}
                          checked={formData.amenidades.includes(amenidad.id)}
                          onCheckedChange={(checked) => handleAmenidadChange(amenidad.id, checked as boolean)}
                          className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                        />
                        <Label
                          htmlFor={amenidad.id}
                          className="text-sm text-gray-700 flex items-center gap-2 cursor-pointer"
                        >
                          <IconComponent className="h-4 w-4 text-amber-600" />
                          {amenidad.label}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={saving} className="flex-1 bg-amber-700 hover:bg-amber-800 text-white">
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/habitaciones")}
                  disabled={saving}
                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Enlaces Rápidos */}
        <AdminQuickLinks currentPage="habitaciones" />
      </div>
    </div>
  )
}
