"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, Calendar } from "lucide-react"
import type { ReservasFilters } from "@/hooks/use-reservas-admin"

interface ReservasFiltersProps {
  filters: ReservasFilters
  onFiltersChange: (filters: Partial<ReservasFilters>) => void
  stats?: {
    total: number
    confirmadas: number
    checkin: number
    checkout: number
    canceladas: number
  }
}

export function ReservasFiltersComponent({ filters, onFiltersChange, stats }: ReservasFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltersChange({ search: searchInput })
  }

  const clearFilters = () => {
    setSearchInput("")
    onFiltersChange({ estado: "todas", tipo: "todos", fecha: "", search: "" })
  }

  const hasActiveFilters =
    filters.estado !== "todas" || filters.tipo !== "todos" || filters.fecha !== "" || filters.search !== ""

  const estadoOptions = [
    { value: "todas", label: "Todas", count: stats?.total || 0, icon: "📋" },
    { value: "confirmada", label: "Confirmadas", count: stats?.confirmadas || 0, icon: "📅" },
    { value: "checkin", label: "Check-in", count: stats?.checkin || 0, icon: "🏨" },
    { value: "checkout", label: "Check-out", count: stats?.checkout || 0, icon: "✅" },
    { value: "cancelada", label: "Canceladas", count: stats?.canceladas || 0, icon: "❌" },
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
            {option.icon} {option.label} ({option.count})
          </Badge>
        ))}
      </div>

      {/* Filtros avanzados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <form onSubmit={handleSearchSubmit} className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por cliente, email o habitación..."
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

        {/* Filtro por tipo de habitación */}
        <Select value={filters.tipo} onValueChange={(value) => onFiltersChange({ tipo: value })}>
          <SelectTrigger>
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

        {/* Filtro por fecha */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="date"
            value={filters.fecha}
            onChange={(e) => onFiltersChange({ fecha: e.target.value })}
            className="pl-10"
            placeholder="Filtrar por fecha"
          />
        </div>
      </div>

      {/* Botón limpiar filtros y filtros activos */}
      <div className="flex flex-wrap items-center gap-2">
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="sm" className="bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Limpiar Filtros
          </Button>
        )}

        {/* Indicadores de filtros activos */}
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
        {filters.fecha && (
          <Badge variant="secondary" className="flex items-center space-x-1">
            <span>Fecha: {new Date(filters.fecha).toLocaleDateString("es-ES")}</span>
            <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => onFiltersChange({ fecha: "" })} />
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
    </div>
  )
}
