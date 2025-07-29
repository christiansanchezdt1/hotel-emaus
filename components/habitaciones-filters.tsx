"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Filter, X, Search } from "lucide-react"

interface FiltrosHabitaciones {
  fechaInicio?: string
  fechaFin?: string
  tipo?: string
  capacidad?: string
}

interface HabitacionesFiltrosProps {
  onFiltrosChange: (filtros: FiltrosHabitaciones) => void
  loading?: boolean
}

export default function HabitacionesFiltros({ onFiltrosChange, loading = false }: HabitacionesFiltrosProps) {
  const [filtros, setFiltros] = useState<FiltrosHabitaciones>({
    fechaInicio: "",
    fechaFin: "",
    tipo: "todos",
    capacidad: "todas",
  })

  const handleFiltroChange = (key: keyof FiltrosHabitaciones, value: string) => {
    const nuevosFiltros = { ...filtros, [key]: value }
    setFiltros(nuevosFiltros)
  }

  const aplicarFiltros = () => {
    const filtrosLimpios = {
      fechaInicio: filtros.fechaInicio || undefined,
      fechaFin: filtros.fechaFin || undefined,
      tipo: filtros.tipo !== "todos" ? filtros.tipo : undefined,
      capacidad: filtros.capacidad !== "todas" ? filtros.capacidad : undefined,
    }
    onFiltrosChange(filtrosLimpios)
  }

  const limpiarFiltros = () => {
    const filtrosVacios = {
      fechaInicio: "",
      fechaFin: "",
      tipo: "todos",
      capacidad: "todas",
    }
    setFiltros(filtrosVacios)
    onFiltrosChange({})
  }

  const tienesFiltrosActivos = () => {
    return (
      filtros.fechaInicio ||
      filtros.fechaFin ||
      (filtros.tipo && filtros.tipo !== "todos") ||
      (filtros.capacidad && filtros.capacidad !== "todas")
    )
  }

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-800">
            <Filter className="w-5 h-5" />
            <span>Filtrar Habitaciones</span>
          </div>
          {tienesFiltrosActivos() && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Filtros activos
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filtros de fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 mr-2" />
              Fecha de Entrada
            </label>
            <Input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => handleFiltroChange("fechaInicio", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 mr-2" />
              Fecha de Salida
            </label>
            <Input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => handleFiltroChange("fechaFin", e.target.value)}
              min={filtros.fechaInicio || new Date().toISOString().split("T")[0]}
              className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Filtros de habitación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tipo de Habitación</label>
            <Select value={filtros.tipo} onValueChange={(value) => handleFiltroChange("tipo", value)}>
              <SelectTrigger className="border-amber-200 focus:border-amber-500 focus:ring-amber-500">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="doble">Doble</SelectItem>
                <SelectItem value="triple">Triple</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Users className="w-4 h-4 mr-2" />
              Capacidad
            </label>
            <Select value={filtros.capacidad} onValueChange={(value) => handleFiltroChange("capacidad", value)}>
              <SelectTrigger className="border-amber-200 focus:border-amber-500 focus:ring-amber-500">
                <SelectValue placeholder="Seleccionar capacidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="1">1 persona</SelectItem>
                <SelectItem value="2">2 personas</SelectItem>
                <SelectItem value="3">3 personas</SelectItem>
                <SelectItem value="4">4+ personas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-amber-200">
          <Button
            onClick={aplicarFiltros}
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium"
            disabled={loading}
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? "Buscando..." : "Buscar Habitaciones"}
          </Button>

          <Button
            variant="outline"
            onClick={limpiarFiltros}
            disabled={loading}
            className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
          >
            <X className="w-4 h-4 mr-2" />
            Limpiar Filtros
          </Button>
        </div>

        {/* Filtros activos */}
        {tienesFiltrosActivos() && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-200">
            <span className="text-sm font-medium text-gray-600">Filtros activos:</span>
            {filtros.fechaInicio && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Desde: {new Date(filtros.fechaInicio).toLocaleDateString("es-AR")}
              </Badge>
            )}
            {filtros.fechaFin && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Hasta: {new Date(filtros.fechaFin).toLocaleDateString("es-AR")}
              </Badge>
            )}
            {filtros.tipo && filtros.tipo !== "todos" && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Tipo: {filtros.tipo}
              </Badge>
            )}
            {filtros.capacidad && filtros.capacidad !== "todas" && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Capacidad: {filtros.capacidad}+ personas
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
