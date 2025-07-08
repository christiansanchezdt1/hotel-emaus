"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import type { HabitacionesFilters } from "@/hooks/use-habitaciones-admin"

interface HabitacionesFiltersProps {
  filters: HabitacionesFilters
  onFiltersChange: (filters: Partial<HabitacionesFilters>) => void
  stats?: {
    total: number
    disponibles: number
    ocupadas: number
    mantenimiento: number
    fuera_servicio: number
  }
}

export function HabitacionesFiltersComponent({ filters, onFiltersChange, stats }: HabitacionesFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltersChange({ search: searchInput })
  }

  const clearFilters = () => {
    setSearchInput("")
    onFiltersChange({ estado: "todas", tipo: "todos", search: "" })
  }

  const hasActiveFilters = filters.estado !== "todas" || filters.tipo !== "todos" || filters.search !== ""

  const estadoOptions = [
    { value: "todas", label: "Todas", count: stats?.total || 0 },
    { value: "disponible", label: "Disponibles", count: stats?.disponibles || 0 },
    { value: "ocupadas", label: "Ocupadas", count: stats?.ocupadas || 0 },
    { value: "mantenimiento", label: "Mantenimiento", count: stats?.mantenimiento || 0 },
    { value: "fuera_servicio", label: "Fuera de Servicio", count: stats?.fuera_servicio || 0 },
  ]

  const tipoOptions = [
    { value: "todos", label: "Todos los tipos" },
    { value: "Individual", label: "Individual" },
    { value: "Doble", label: "Doble" },
    { value: "Suite Familiar", label: "Suite Familiar" },
    { value: "Suite Premium", label: "Suite Premium" },
  ]

  return (
    <div className="space-y-4">
      {/* Filtros rápidos por estado */}
      <div className="flex flex-wrap gap-2">
        {estadoOptions.map((option) => (
          <Badge
            key={option.value}
            variant={filters.estado === option.value ? "default" : "outline"}
            className={`cursor-pointer hover:bg-opacity-80 transition-colors ${
              filters.estado === option.value ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-100"
            }`}
            onClick={() => onFiltersChange({ estado: option.value })}
          >
            {option.label} ({option.count})
          </Badge>
        ))}
      </div>

      {/* Filtros avanzados */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        {/* Búsqueda */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por número, tipo o descripción..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchInput && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => {
                  setSearchInput("")
                  onFiltersChange({ search: "" })
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </form>

        {/* Filtro por tipo */}
        <Select value={filters.tipo} onValueChange={(value) => onFiltersChange({ tipo: value })}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Tipo de habitación" />
          </SelectTrigger>
          <SelectContent>
            {tipoOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="flex items-center space-x-2 bg-transparent">
            <Filter className="w-4 h-4" />
            <span>Limpiar</span>
          </Button>
        )}
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
          <span>Filtros activos:</span>
          {filters.estado !== "todas" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Estado: {estadoOptions.find((o) => o.value === filters.estado)?.label}</span>
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => onFiltersChange({ estado: "todas" })}
              />
            </Badge>
          )}
          {filters.tipo !== "todos" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Tipo: {filters.tipo}</span>
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => onFiltersChange({ tipo: "todos" })}
              />
            </Badge>
          )}
          {filters.search && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Búsqueda: "{filters.search}"</span>
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => {
                  setSearchInput("")
                  onFiltersChange({ search: "" })
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
