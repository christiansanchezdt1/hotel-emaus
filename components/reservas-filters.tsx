"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, X, Filter, Search } from "lucide-react"

interface Filters {
  search: string
  estado: string
  fecha_desde: string
  fecha_hasta: string
  habitacion_tipo: string
}

interface ReservasFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function ReservasFiltersComponent({ filters, onFiltersChange }: ReservasFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      estado: "",
      fecha_desde: "",
      fecha_hasta: "",
      habitacion_tipo: "",
    })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Búsqueda principal */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, email o documento..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10 border-amber-200 focus:border-amber-400"
            />
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="border-amber-200 hover:bg-amber-50 text-amber-700"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
              {activeFiltersCount}
            </Badge>
          )}
          {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} className="text-amber-600 hover:text-amber-700">
            <X className="mr-1 h-3 w-3" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Filtros expandibles */}
      {isExpanded && (
        <Card className="border-amber-200">
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-amber-900">
                  Estado
                </Label>
                <Select value={filters.estado} onValueChange={(value) => handleFilterChange("estado", value)}>
                  <SelectTrigger className="border-amber-200 focus:border-amber-400">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="confirmada">Confirmada</SelectItem>
                    <SelectItem value="checkin">Check-in</SelectItem>
                    <SelectItem value="checkout">Check-out</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_desde" className="text-amber-900">
                  Desde
                </Label>
                <Input
                  id="fecha_desde"
                  type="date"
                  value={filters.fecha_desde}
                  onChange={(e) => handleFilterChange("fecha_desde", e.target.value)}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_hasta" className="text-amber-900">
                  Hasta
                </Label>
                <Input
                  id="fecha_hasta"
                  type="date"
                  value={filters.fecha_hasta}
                  onChange={(e) => handleFilterChange("fecha_hasta", e.target.value)}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="habitacion_tipo" className="text-amber-900">
                  Tipo de Habitación
                </Label>
                <Select
                  value={filters.habitacion_tipo}
                  onValueChange={(value) => handleFilterChange("habitacion_tipo", value)}
                >
                  <SelectTrigger className="border-amber-200 focus:border-amber-400">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="Simple">Simple</SelectItem>
                    <SelectItem value="Doble">Doble</SelectItem>
                    <SelectItem value="Triple">Triple</SelectItem>
                    <SelectItem value="Cuádruple">Cuádruple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Export adicional para compatibilidad
export { ReservasFiltersComponent as ReservasFilters }
