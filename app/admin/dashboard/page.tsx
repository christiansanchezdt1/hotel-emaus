"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Bed, Calendar, LogOut, Hotel } from "lucide-react"
import type { Room, Booking } from "@/lib/supabase"

export default function AdminDashboard() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const router = useRouter()

  // Estado para el formulario de habitación
  const [roomForm, setRoomForm] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "",
    size: "",
    amenities: "",
    image_url: "",
    is_available: true,
  })

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }

    loadData()
  }, [router])

  const loadData = async () => {
    try {
      const [roomsResponse, bookingsResponse] = await Promise.all([
        fetch("/api/admin/rooms"),
        fetch("/api/admin/bookings"),
      ])

      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json()
        setRooms(roomsData)
      }

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData)
      }
    } catch (error) {
      setError("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          ...roomForm,
          price: Number.parseFloat(roomForm.price),
          capacity: Number.parseInt(roomForm.capacity),
          amenities: roomForm.amenities.split(",").map((a) => a.trim()),
        }),
      })

      if (response.ok) {
        setIsAddRoomOpen(false)
        setRoomForm({
          name: "",
          description: "",
          price: "",
          capacity: "",
          size: "",
          amenities: "",
          image_url: "",
          is_available: true,
        })
        loadData()
      } else {
        setError("Error al agregar habitación")
      }
    } catch (error) {
      setError("Error de conexión")
    }
  }

  const handleToggleAvailability = async (roomId: string, isAvailable: boolean) => {
    try {
      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ is_available: !isAvailable }),
      })

      if (response.ok) {
        loadData()
      } else {
        setError("Error al actualizar habitación")
      }
    } catch (error) {
      setError("Error de conexión")
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("¿Está seguro de que desea eliminar esta habitación?")) return

    try {
      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })

      if (response.ok) {
        loadData()
      } else {
        setError("Error al eliminar habitación")
      }
    } catch (error) {
      setError("Error de conexión")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  const stats = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter((r) => r.is_available).length,
    occupiedRooms: rooms.filter((r) => !r.is_available).length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    revenue: bookings.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + (b.total_amount || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-500">Hotel Emaus</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Habitaciones</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRooms}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Habitaciones Disponibles</CardTitle>
              <Bed className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.availableRooms}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Habitaciones Ocupadas</CardTitle>
              <Bed className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.occupiedRooms}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas Pendientes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rooms">Gestión de Habitaciones</TabsTrigger>
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Habitaciones</h2>
              <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Habitación
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agregar Nueva Habitación</DialogTitle>
                    <DialogDescription>Complete los datos de la nueva habitación</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddRoom} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={roomForm.name}
                        onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={roomForm.description}
                        onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Precio por noche</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={roomForm.price}
                          onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacidad</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={roomForm.capacity}
                          onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Tamaño</Label>
                      <Input
                        id="size"
                        placeholder="ej: 25 m²"
                        value={roomForm.size}
                        onChange={(e) => setRoomForm({ ...roomForm, size: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amenities">Comodidades (separadas por comas)</Label>
                      <Textarea
                        id="amenities"
                        placeholder="WiFi gratuito, TV por cable, Aire acondicionado"
                        value={roomForm.amenities}
                        onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image_url">URL de la imagen</Label>
                      <Input
                        id="image_url"
                        type="url"
                        value={roomForm.image_url}
                        onChange={(e) => setRoomForm({ ...roomForm, image_url: e.target.value })}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Agregar Habitación</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {rooms.map((room) => (
                <Card key={room.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {room.name}
                          <Badge variant={room.is_available ? "default" : "destructive"}>
                            {room.is_available ? "Disponible" : "Ocupada"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{room.description}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={room.is_available}
                          onCheckedChange={() => handleToggleAvailability(room.id, room.is_available)}
                        />
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteRoom(room.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Precio:</span>
                        <p>${room.price}/noche</p>
                      </div>
                      <div>
                        <span className="font-medium">Capacidad:</span>
                        <p>{room.capacity} huéspedes</p>
                      </div>
                      <div>
                        <span className="font-medium">Tamaño:</span>
                        <p>{room.size}</p>
                      </div>
                      <div>
                        <span className="font-medium">Comodidades:</span>
                        <p>{room.amenities.length} servicios</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-2xl font-bold">Reservas</h2>
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{booking.guest_name}</CardTitle>
                        <CardDescription>{booking.guest_email}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {booking.status === "confirmed"
                          ? "Confirmada"
                          : booking.status === "pending"
                            ? "Pendiente"
                            : "Cancelada"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Check-in:</span>
                        <p>{new Date(booking.check_in).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Check-out:</span>
                        <p>{new Date(booking.check_out).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Huéspedes:</span>
                        <p>{booking.guests_count}</p>
                      </div>
                      <div>
                        <span className="font-medium">Total:</span>
                        <p>${booking.total_amount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
