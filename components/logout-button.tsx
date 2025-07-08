"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function LogoutButton({ variant = "outline", size = "sm", className }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (response.ok) {
        // Redirigir a la página principal
        router.push("/")
        router.refresh()
      } else {
        console.error("Error en logout")
        // Aún así redirigir por si acaso
        router.push("/")
      }
    } catch (error) {
      console.error("Error en logout:", error)
      // Redirigir de todas formas
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout} disabled={loading} className={className}>
      <LogOut className="w-4 h-4 mr-2" />
      {loading ? "Cerrando..." : "Cerrar Sesión"}
    </Button>
  )
}
