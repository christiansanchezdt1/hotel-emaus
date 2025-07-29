"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Calendar, Settings, BarChart3, Plus } from "lucide-react"
import Link from "next/link"

interface AdminQuickLinksProps {
  currentPage?: string
}

const links = [
  {
    href: "/admin/dashboard",
    icon: BarChart3,
    label: "Dashboard",
    description: "Resumen general",
    color: "bg-purple-100 text-purple-700",
    key: "dashboard",
  },
  {
    href: "/admin/habitaciones",
    icon: Home,
    label: "Habitaciones",
    description: "Gestionar habitaciones",
    color: "bg-blue-100 text-blue-700",
    key: "habitaciones",
  },
  {
    href: "/admin/reservas",
    icon: Calendar,
    label: "Reservas",
    description: "Gestionar reservas",
    color: "bg-green-100 text-green-700",
    key: "reservas",
  },
  {
    href: "/admin/habitaciones/nueva",
    icon: Plus,
    label: "Nueva Habitación",
    description: "Crear habitación",
    color: "bg-amber-100 text-amber-700",
    key: "nueva-habitacion",
  },
  {
    href: "/admin/reservas/nueva",
    icon: Plus,
    label: "Nueva Reserva",
    description: "Crear reserva",
    color: "bg-orange-100 text-orange-700",
    key: "nueva-reserva",
  },
]

export function AdminQuickLinks({ currentPage }: AdminQuickLinksProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
      <CardHeader>
        <CardTitle className="text-amber-900 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Enlaces Rápidos
        </CardTitle>
        <CardDescription className="text-amber-700">
          Navega rápidamente entre las secciones administrativas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {links.map((link) => {
            const IconComponent = link.icon
            const isActive = currentPage === link.key

            return (
              <Button
                key={link.key}
                asChild
                variant={isActive ? "default" : "outline"}
                className={`h-auto p-3 flex flex-col items-center gap-2 relative ${
                  isActive
                    ? "bg-amber-700 hover:bg-amber-800 text-white border-amber-700"
                    : "border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
                }`}
              >
                <Link href={link.href}>
                  {isActive && (
                    <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0">Actual</Badge>
                  )}
                  <div className={`p-2 rounded-lg ${isActive ? "bg-white/20" : link.color}`}>
                    <IconComponent className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium">{link.label}</div>
                    <div className={`text-xs ${isActive ? "text-white/80" : "text-gray-500"}`}>{link.description}</div>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
